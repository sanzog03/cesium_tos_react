import * as Cesium from 'cesium';
import { Viewer ,createWorldTerrain ,Cesium3DTileset ,IonResource, PointPrimitiveCollection } from 'cesium';
// import GLMpoints from '../datas/CZMLS_FCX_05172017/points/GLMpoints.json';
import GLMpoints from '../datas/CZMLS_FCX_05172017/3dTile/tileset_goesrpltcrs_phys.json';
import { extendCesium3DTileset } from 'temporal-3d-tile';
const Temporal3DTileset = extendCesium3DTileset(Cesium);

export default function pointCloudViewer(setCurrentViewer) {   
    const viewer = new Viewer("cesiumContainer", {
        terrainProvider: createWorldTerrain(),
        shouldAnimate: true,
    });

    setCurrentViewer(viewer);
    // views the 3D tiles
    // const tileset = new Cesium3DTileset({
    const tileset = new Temporal3DTileset({
        // url: IonResource.fromAssetId(28945),
        // url: 'https://ghrc-fcx-viz-output.s3.us-west-2.amazonaws.com/fieldcampaign/goesrplt/2017-05-17/iss-lis_points/LISpoints.json'
        url: 'https://ghrc-fcx-viz-output.s3.us-west-2.amazonaws.com/fieldcampaign/goesrplt/2017-05-17/crs/tileset.json'
    });
    // const clock = new Cesium.Clock({
    //     startTime : Cesium.JulianDate.fromIso8601("2013-12-25"),
    //     currentTime : Cesium.JulianDate.fromIso8601("2013-12-25"),
    //     stopTime : Cesium.JulianDate.fromIso8601("2013-12-26"),
    //     clockRange : Cesium.ClockRange.LOOP_STOP,
    //     clockStep : Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER
    //  });

     var currentTime = Cesium.JulianDate.fromIso8601("2017-05-17T04:00:00.09Z")
     var endTime = Cesium.JulianDate.fromIso8601("2017-05-18");

     viewer.clock.currentTime = currentTime;
     viewer.clock.multiplier = 160;
     viewer.timeline.zoomTo(currentTime, endTime);

    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);
    }