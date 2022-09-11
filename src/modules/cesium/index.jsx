import React, { Component } from "react";
import dataImpact from "./impactData.czml";
import defaultViewer from "./viewers/default.js";
import * as Cesium from 'cesium';

// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';

class FCXViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentlyShowing: "czml",
            currentViewer: null
        };

        this.CZMLPathViewer = this.CZMLPathViewer.bind(this);
        this.pointCloudViewer = this.pointCloudViewer.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.implementationHandler = this.implementationHandler.bind(this);
        this.setCurrentViewer = this.setCurrentViewer.bind(this);
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
                defaultViewer(this.setCurrentViewer);
                break;
            case "point":
                this.pointCloudViewer();
                break;
            default:
                this.CZMLPathViewer();    
        }
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

    setCurrentViewer(viewer){
        this.setState({currentViewer: viewer});
    }

    render() {
      return (
        <div>
            <div id="cesiumContainer" style={{width: "100%", height: "100%"}}></div>
            <div id="customSelectionTool">
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
  