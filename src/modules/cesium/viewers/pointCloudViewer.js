import { Viewer ,createWorldTerrain ,Cesium3DTileset ,IonResource } from 'cesium';

export default function pointCloudViewer(setCurrentViewer) {   
    const viewer = new Viewer("cesiumContainer", {
        terrainProvider: createWorldTerrain(),
        shouldAnimate: true,
    });

    setCurrentViewer(viewer);

    const tileset = new Cesium3DTileset({
        url: IonResource.fromAssetId(28945),
    });

    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);
}