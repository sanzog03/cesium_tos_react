import { Viewer ,createWorldTerrain ,Cesium3DTileset ,IonResource, PointPrimitiveCollection } from 'cesium';
// import GLMpoints from '../datas/CZMLS_FCX_05172017/points/GLMpoints.json';
import GLMpoints from '../datas/CZMLS_FCX_05172017/3dTile/tileset_goesrpltcrs_phys.json';

export default function pointCloudViewer(setCurrentViewer) {   
    const viewer = new Viewer("cesiumContainer", {
        terrainProvider: createWorldTerrain(),
        shouldAnimate: true,
    });

    setCurrentViewer(viewer);

    // views the 3D tiles
    const tileset = new Cesium3DTileset({
        // url: IonResource.fromAssetId(28945),
        // url: 'https://ghrc-fcx-viz-output.s3.us-west-2.amazonaws.com/fieldcampaign/goesrplt/2017-05-17/iss-lis_points/LISpoints.json'
        url: 'https://ghrc-fcx-viz-output.s3.us-west-2.amazonaws.com/fieldcampaign/goesrplt/2017-05-17/crs/tileset.json'
    });

    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);
}