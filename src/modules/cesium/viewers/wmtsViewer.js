import { Viewer ,createWorldTerrain , ImageryLayer, WebMapTileServiceImageryProvider, JulianDate, TimeIntervalCollection } from 'cesium';
import wmtsData from "../datas/CZMLS_FCX_05172017/wmts/index.json";

export default function webMapTileServiceViewer(setCurrentViewer) {
    const viewer = new Viewer("cesiumContainer", {
        terrainProvider: createWorldTerrain(),
        shouldAnimate: true,
    });
    
    setCurrentViewer(viewer);

    // const times = [];
    // const dates = [];
    // for (const time of times) {
    //     const date = new JulianDate()
    //     JulianDate.addSeconds(JulianDate.fromIso8601("2000-01-01T12:00:00Z"), Number(time), date)
    //     dates.push(date)
    // }
    // const timeIntervalCollection = TimeIntervalCollection.fromJulianDateArray({
    //     julianDates: dates,
    //     dataCallback: (_interval, index) => {
    //         return { Time: wmtsData.times[index] }
    //     },
    // })

    // const times = Cesium.TimeIntervalCollection.fromIso8601({
    //     iso8601: '2015-07-30/2017-06-16/P1D',
    //     dataCallback: function dataCallback(interval, index) {
    //         return {
    //             Time: Cesium.JulianDate.toIso8601(interval.start)
    //         };
    //     }
    // });

    // let imageryProvider = new WebMapTileServiceImageryProvider({
    //     url: wmtsData.url,
    //     format: wmtsData.format,
    //     style: wmtsData.style,
    //     times: timeIntervalCollection,
    //     tileMatrixSetID: wmtsData.tileMatrixSetID,
    //     clock: viewer.clock,
    //     layer: wmtsData.layer,
    // })
    // let imageLayer = new ImageryLayer(imageryProvider)
    // viewer.imageryLayers.add(imageLayer)
}