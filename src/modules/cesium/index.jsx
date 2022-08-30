import React, { Component } from "react";
import flightDataRaw from "./flightData.js";

// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';

// eslint-disable-next-line import/first
import * as Cesium from 'cesium';

// import "cesium/Build/Cesium/Widgets/widgets.css";

class FCXViewer extends Component {

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        // dont change states here. will cause double render.
        this.startDrawing();
    }

    startDrawing() {
        Cesium.Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_DEFAULT_ACCESS_TOKEN;
        // Add viewer(Camera) with cesium world terrain
        const viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: Cesium.createWorldTerrain({
                requestWaterMask : true,
                requestVertexNormals : true
            })
        });

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
            const airPlaneModel = await Cesium.IonResource.fromAssetId(1284311);

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

    render() {
      return (
            <div id="cesiumContainer"></div>
      )
    }
}
  
  export default FCXViewer;
  