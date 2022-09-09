import React, { Component } from "react";
import flightDataRaw from "./flightData.js";
import dataImpact from "./impactData.czml";

// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';

// eslint-disable-next-line import/first
import * as Cesium from 'cesium';

// import "cesium/Build/Cesium/Widgets/widgets.css";

class FCXViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentlyShowing: "czml",
            currentViewer: null
        };

        this.defaultViewer = this.defaultViewer.bind(this);
        this.CZMLPathViewer = this.CZMLPathViewer.bind(this);
        this.pointCloudViewer = this.pointCloudViewer.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.implementationHandler = this.implementationHandler.bind(this);
    }

    componentDidMount() {
       Cesium.Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_DEFAULT_ACCESS_TOKEN;
       this.implementationHandler();
    }

    implementationHandler() {
        // on initial render, after component mount, show default viewer
        // on state change, check which viewer was supposed to be shown
        // remove the previous viewer, and load the new viewer.
        if (this.state.currentViewer) {
            this.state.currentViewer.destroy();
        }
        switch(this.state.currentlyShowing) {
            case "czml":
                this.CZMLPathViewer();
                break;
            case "general":
                this.defaultViewer();
                break;
            case "point":
                this.pointCloudViewer();
                break;
            default:
                this.CZMLPathViewer();    
        }
        // let canvasElement = document.getElementsByTagName("canvas")[0];
        // console.log(canvasElement)
        // console.log(window.innerWidth, window.innerHeight)
        // canvasElement.style.height = `${window.innerHeight} px !important`;
        // canvasElement.style.width = `${window.innerWidth} px !important`;
        // dont change states here. will cause double render.
    }

    defaultViewer() {
        Cesium.Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_DEFAULT_ACCESS_TOKEN;
        // Add viewer(Camera) with cesium world terrain
        const viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: Cesium.createWorldTerrain({
                requestWaterMask : true,
                requestVertexNormals : true
            })
        });
        this.setState({currentViewer: viewer});

        // create Cesium OSM buildings
        // const osmBuildings =
        viewer.scene.primitives.add(Cesium.createOsmBuildings());
        
        //// Arrange below code to following sections.
        // createViewer();
        // addOSMBuildings();
        // manageData();
        // sampleData();
        // addPlane();
        // trackPlane();

        const flightData = JSON.parse(flightDataRaw);

        /* Initialize the viewer clock:
        Assume the radar samples are 30 seconds apart, and calculate the entire flight duration based on that assumption.
        Get the start and stop date times of the flight, where the start is the known flight departure time (converted from PST 
            to UTC) and the stop is the start plus the calculated duration. (Note that Cesium uses Julian dates. See 
            https://simple.wikipedia.org/wiki/Julian_day.)
        */
        const timeStepsInSecond = 30;
        const totalSeconds = timeStepsInSecond * flightData.length - 1;
        const startTime = Cesium.JulianDate.fromIso8601("2022-08-24T23:10:00Z");
        const endTime = Cesium.JulianDate.addSeconds(startTime, totalSeconds, new Cesium.JulianDate());

        /** VIEWER TIME MANIPULATION **/

        // Initialize the viewer's clock by setting its start and stop to the flight start and stop times we just calculated. 
        // Also, set the viewer's current time to the start time and take the user to that time. 
        viewer.clock.startTime = startTime.clone();
        viewer.clock.endTime = endTime.clone();
        viewer.clock.currentTime = startTime.clone();

        viewer.timeline.zoomTo(startTime, endTime);
        viewer.clock.multiplier = 50; // speed up playback speed 50x
        viewer.clock.shouldAnimate = true; // start animating/playing the scene

        /** TRACKING POSITION AND TIME DATE (SPATIAL AND TEMPORAL DATA) using "sampled position property" **/

        // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
        const positionProperty = new Cesium.SampledPositionProperty();

        // For all flightData
        for (let i = 0; i < flightData.length; i++) {
            const dataPoint = flightData[i];
            
            // formulate position and its corresponding time
            const time = Cesium.JulianDate.addSeconds(startTime, i * timeStepsInSecond, new Cesium.JulianDate());
            const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);

            // mix position and time property
            positionProperty.addSample(time, position);
        }

        async function play() {
            // add 3d model
            // const airPlaneModel = await Cesium.IonResource.fromAssetId(1284311);
            const airPlaneModel = "https://fcx-czml.s3.amazonaws.com/img/p3.gltf";

            // Interpolate the points (position wrt to time)
            const airPlaneEntity = viewer.entities.add({
                availability: new Cesium.TimeIntervalCollection([ new Cesium.TimeInterval({ start: startTime, stop: endTime }) ]),
                position: positionProperty,
                point: {pixelSize: 30},
                model: {uri: airPlaneModel, scale: 0.1},
                orientation: new Cesium.VelocityOrientationProperty(positionProperty),
                path: new Cesium.PathGraphics({width: 3})
            });

            // make viewer camera track the moving entity
            viewer.trackedEntity = airPlaneEntity;
        }
        play();
    }

    CZMLPathViewer() {

        // var viewer = new Cesium.Viewer('cesiumContainer');
        // var baseLayerPickerViewModel = viewer.baseLayerPicker.viewModel;
        // baseLayerPickerViewModel.selectedImagery = baseLayerPickerViewModel.imageryProviderViewModels[0];

        // var viewer = new Cesium.Viewer('cesiumContainer', {
        //     imageryProvider : Cesium.createWorldImagery({
        //         style : Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
        //     }),
        //     baseLayerPicker : false
        // });

        const viewer = new Cesium.Viewer("cesiumContainer", {
            // terrainProvider: Cesium.createWorldTerrain(
            //     {
            //     requestWaterMask : true,
            //     requestVertexNormals : true}
            // ),
            shouldAnimate: false,
            useBrowserRecommendedResolution: true,
            selectedImageryProviderViewModel: new Cesium.ProviderViewModel({
                name: "Bing Maps Aerial with Labels",
                iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerialLabels.png"),
                tooltip: "Bing Maps aerial imagery with labels, provided by Cesium ion",
                category: "Cesium ion",
                creationFunction: function () {
                  return Cesium.createWorldImagery({
                    style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
                  })
                },
              })
        });

        this.setState({currentViewer: viewer});

        // viewer.extend(Cesium.viewerCesiumInspectorMixin);

        doStuffWithCZML()

        function doStuffWithCZML() {
            // Cesium.CzmlDataSource.load("./testData.czml")
            // Cesium.CzmlDataSource.load("https://fcx-czml.s3.amazonaws.com/flight_track/goesrplt_naver2_IWG1_20170322-0136")
            Cesium.CzmlDataSource.load(dataImpact)
            .then(async (dataSource) => {
                viewer.dataSources.add(dataSource);
                const clock = viewer.clock;
                const p3Entity = dataSource.entities.getById("Flight Track");
                
                // set the camera orientation and keep it far apart from the model.

                // a fly to is much better than zoom to.
                viewer.zoomTo(dataSource,  new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-10), 40000));
                // await viewer.flyTo(p3Entity, {offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-10), 40000)})

                // viewer.camera.Zoomout(10000000);
                // viewer.camera.setView({ destination: p3Entity, orientation: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-10), 40000)})

                viewer.trackedEntity = p3Entity;

                clock.onTick.addEventListener(() => {
                    fixOrientation();
                });

                function fixOrientation() {
                    // change the model orientation
                    const heading = Cesium.Math.toRadians(270);
                    const pitch = Cesium.Math.toRadians(90);
                    const roll = Cesium.Math.toRadians(0);
                    const position = p3Entity.position.getValue(clock.currentTime);
                        // the heading should change with respect to the position.
                        // TODO: if possible get the heading roll and pitch from the czml data itself. But question is when to take which data.
                        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
                        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
                            position,
                            hpr
                        );
                    p3Entity.orientation = orientation;
                }
            });
        }
    }

    pointCloudViewer() {   
        Cesium.Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_DEFAULT_ACCESS_TOKEN;
        const viewer = new Cesium.Viewer("cesiumContainer", {
            terrainProvider: Cesium.createWorldTerrain(),
            shouldAnimate: true,
        });

        this.setState({currentViewer: viewer});

        const tileset = new Cesium.Cesium3DTileset({
            url: Cesium.IonResource.fromAssetId(28945),
        });

        viewer.scene.primitives.add(tileset);
        viewer.zoomTo(tileset);
    }

    handleSelectionChange(event) {
        this.setState({currentlyShowing: event.target.value}, () => {
            this.implementationHandler();
        });
    }

    render() {
      return (
        <div>
            <div id="cesiumContainer" style={{width: "100%", height: "100%"}}></div>
            <div id="toolbar">
            <table>
                <tbody>
                    <tr>
                        <td>Implementations</td>
                        <td>
                        <select id="cesiumImplementations" name="cesiumImplementations" value={this.state.currentlyShowing} onChange={this.handleSelectionChange}>
                            <option value="czml">CZML flight Path Tracking</option>
                            <option value="general">General Flight Tracking</option>
                            <option value="point">Point Cloud Plotting</option>
                        </select>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
      )
    }
}
  
  export default FCXViewer;
  