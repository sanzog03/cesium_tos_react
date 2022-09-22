import { Viewer ,createWorldTerrain , ImageryLayer, WebMapTileServiceImageryProvider, JulianDate, TimeIntervalCollection } from 'cesium';
import wmtsData from "../datas/CZMLS_FCX_05172017/wmts/index.json";

export default function webMapTileServiceViewer(setCurrentViewer) {
    const viewer = new Viewer("cesiumContainer", {
        terrainProvider: createWorldTerrain(),
        shouldAnimate: true,
    });
    
    setCurrentViewer(viewer);

    let imageryProvider = new WebMapTileServiceImageryProvider({
        url: wmtsData.url,
        format: wmtsData.format,
        style: wmtsData.style,
        // times: getTimeIntervalCollection(wmtsData.times),
        times: getWrappedTimeIntervalCollection(wmtsData.times),
        tileMatrixSetID: wmtsData.tileMatrixSetID,
        clock: viewer.clock,
        layer: wmtsData.layer,
    });

    let imageLayer = new ImageryLayer(imageryProvider);
    viewer.imageryLayers.add(imageLayer);

    const startDate =   JulianDate.fromIso8601("2017-05-17T02:07:13Z"); // got from the times array when changed into Julian date format.
    const endDate =     JulianDate.fromIso8601("2017-05-17T07:52:13Z");
    viewer.timeline.zoomTo(startDate, endDate);

    viewer.clock.startTime = startDate;
    viewer.clock.stopTime = endDate;
    viewer.clock.currentTime = startDate;
}

function getWrappedTimeIntervalCollection(rawTimes) {
    /**
     * From a input array of raw times
     * Return an array output of time interval collection
     */

    // mapping the time offsets into julian date format. Required for Time interval collection.
    const dates = rawTimes.map((time) => {
        const resultTimeStandard = new JulianDate()
        return JulianDate.addSeconds(JulianDate.fromIso8601("2000-01-01T12:00:00Z"), Number(time), resultTimeStandard);
    });

    const timeIntervalCollection = TimeIntervalCollection.fromJulianDateArray({
        julianDates: dates, // need the julian dates to be in julian format (offsets not allowed)
        dataCallback: (_interval, index) => {
            // `https://q6eymnfsd9.execute-api.us-west-2.amazonaws.com/development/singleband/C13/${Time}/${TileMatrix}/${TileCol}/${TileRow}.png?colormap=cloud`
            // https://q6eymnfsd9.execute-api.us-west-2.amazonaws.com/development/singleband/C13/ 548258838 /   8     /    56     /    103   .png?colormap=cloud
            /**
             * The time in this wmts url accepted only the seconds offset (from 2000-01-01).
             * So, instead of sending the time in Julian format (which would invalidate the url request)
             * Send the second offset in the place of time
             * in time interval collection.
             */
            return {
              Time: rawTimes[index],
            };
        },
    });
    return timeIntervalCollection;
}

function getTimeIntervalCollection(rawTimes) {
    /**
     * From a input array of raw times
     * Return an array output of time interval collection
     */
    const dates = rawTimes.map((time) => {
        const resultTimeStandard = new JulianDate()
        return JulianDate.addSeconds(JulianDate.fromIso8601("2000-01-01T12:00:00Z"), Number(time), resultTimeStandard);
    });
    const timeIntervalCollection = TimeIntervalCollection.fromJulianDateArray({
        // ideally would do this.
        julianDates: dates,
        dataCallback: (_interval, index) => {
            let time;
            if (index === 0) {
              // leading
              time = JulianDate.toIso8601(_interval.stop);
            } else {
              time = JulianDate.toIso8601(_interval.start);
            }

            return {
              Time: time,
            };
        },
    });
    return timeIntervalCollection;
}
