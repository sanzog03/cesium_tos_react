import React, { Component } from "react";

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
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        this.startDrawing();
    }

    startDrawing() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYTg3MTQxNS01ZTIwLTQ4MmItYjA5NS1hYWM3MWQ0OTNkYTMiLCJpZCI6MTA1ODMzLCJpYXQiOjE2NjE0MzkwOTB9.IWdoSi1zjC7fl7Ncj0YVJgXMfjX3K-RmRcGtjp2xryo";
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
    }

    render() {
      return (
        <>
            <div id="cesiumContainer"></div>
        </>
      )
    }
}
  
  export default FCXViewer;
  