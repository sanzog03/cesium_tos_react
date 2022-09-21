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

    // tileset.pointCloudShading.attenuation = true;
    tileset.style = new Cesium.Cesium3DTileStyle({
        // color: 'mix(color("yellow"), color("red"), -1*${value})',
        // color: { conditions: [
        //                         ["${value} < -33", "rgb(0, 255, 0)"],
        //                         ["true", "rgb(255+${value}, 255+${value}, 255+${value})"]
        //                     ]
        //         },
        color: getColorExpression(),
        pointSize: 2.0
      });

     var currentTime = Cesium.JulianDate.fromIso8601("2017-05-17T02:23:33Z")
     var endTime = Cesium.JulianDate.fromIso8601("2017-05-18");

     viewer.clock.currentTime = currentTime;
     viewer.clock.multiplier = 160;
     viewer.timeline.zoomTo(currentTime, endTime);

    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);
    }

    function getColorExpression() {
        let reverse = true
        let ascale = 4.346
        let vmin = -10
        let vmax = 30
        let vrange = vmax - vmin
        let hmin = 0.438
        let hrange = 1

        let revScale = ""
        if (reverse) {
            revScale = " * -1.0 + 1.0"
        }
        return `hsla((((clamp(\${value}, ${vmin}, ${vmax}) + ${vmin}) / ${vrange}) ${revScale}) * ${hrange} + ${hmin}, 1.0, 0.5, pow((\${value} - ${vmin})/${vrange}, ${ascale}))`
    }