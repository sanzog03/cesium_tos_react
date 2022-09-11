import * as Cesium from 'cesium';

export default function pointCloudViewer(setCurrentViewer) {   
    Cesium.Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_DEFAULT_ACCESS_TOKEN;
    const viewer = new Cesium.Viewer("cesiumContainer", {
        terrainProvider: Cesium.createWorldTerrain(),
        shouldAnimate: true,
    });

    setCurrentViewer(viewer);

    const tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(28945),
    });

    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);
}