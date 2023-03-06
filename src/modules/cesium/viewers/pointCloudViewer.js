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
        // url: 'https://ghrc-fcx-viz-output.s3.us-west-2.amazonaws.com/fieldcampaign/goesrplt/2017-05-17/crs/tileset.json'
        // url: 'https://ghrc-fcx-viz-output.s3.us-west-2.amazonaws.com/fieldcampaign/goesrplt/2017-05-17/iss-lis_points/LISpoints.json'
        // url: 'https://ghrc-fcx-viz-output.s3.us-west-2.amazonaws.com/fieldcampaign/goesrplt/2017-05-17/crs/tileset.json'
        // url: "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-processed-data/crs/20151110/tileset.json"
        // url: "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-processed-data/cpl/20151110/tileset.json"
        url: "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-processed-data/hiwrap/20151203/tileset.json"
        // url: "https://ghrc-fcx-viz-output.s3.us-west-2.amazonaws.com/fieldcampaign/goesrplt/2017-05-17/cpl/cpl_atb/tileset.json"
    });

    // tileset.pointCloudShading.attenuation = true;
    tileset.style = new Cesium.Cesium3DTileStyle({
        color: 'mix(color("yellow"), color("red"), -1*${value})',
        // color: { conditions: [
        //                         ["${value} < -33", "rgb(0, 255, 0)"],
        //                         ["true", "rgb(255+${value}, 255+${value}, 255+${value})"]
        //                     ]
        //         },
        color: getColorExpression(),
        pointSize: 5.0
      });
    
    tileset.readyPromise.then((ts) => {
        console.log("1>>>>>>>", (ts.properties.epoch))
        console.log("2>>>>>>>", Cesium.JulianDate.fromIso8601(ts.properties.epoch))
    })
    

    // tileset.pointCloudShading.attenuation = true;
    // tileset.pointCloudShading.eyeDomeLighting = true;

    var currentTime = Cesium.JulianDate.fromIso8601("2015-12-03T13:15:33Z")
    var endTime = Cesium.JulianDate.fromIso8601("2015-12-04T00:00:25Z");

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