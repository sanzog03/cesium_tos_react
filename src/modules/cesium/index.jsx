import React, { Component } from "react";
import * as Cesium from 'cesium';
import defaultViewer from "./viewers/default";
import CZMLPathViewer from "./viewers/czmlPathViewer";
import pointCloudViewer from "./viewers/pointCloudViewer";

// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';

class FCXViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentlyShowing: "czml",
            currentViewer: null
        };

        // this.pointCloudViewer = this.pointCloudViewer.bind(this);
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
                CZMLPathViewer(this.setCurrentViewer);
                break;
            case "general":
                defaultViewer(this.setCurrentViewer);
                break;
            case "point":
                pointCloudViewer(this.setCurrentViewer);
                break;
            default:
                CZMLPathViewer(this.setCurrentViewer); 
        }
    }

    // pointCloudViewer() {   
    //     Cesium.Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_DEFAULT_ACCESS_TOKEN;
    //     const viewer = new Cesium.Viewer("cesiumContainer", {
    //         terrainProvider: Cesium.createWorldTerrain(),
    //         shouldAnimate: true,
    //     });

    //     this.setState({currentViewer: viewer});

    //     const tileset = new Cesium.Cesium3DTileset({
    //         url: Cesium.IonResource.fromAssetId(28945),
    //     });

    //     viewer.scene.primitives.add(tileset);
    //     viewer.zoomTo(tileset);
    // }

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
  