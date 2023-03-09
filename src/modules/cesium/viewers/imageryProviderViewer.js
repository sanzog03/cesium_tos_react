import * as Cesium from 'cesium';
import img from "../datas/CZMLS_FCX_05172017/nexrad/olympex_Level2_KATX_20150922_2229_ELEV_01.png"

export default function imageryProviderViewer(setCurrentViewer) {
    const viewer = new Cesium.Viewer("cesiumContainer", {
    //     terrainProvider: createWorldTerrain(),
    //     shouldAnimate: true,
    // });
    baseLayerPicker: true,
    skyBox: false,
    automaticallyTrackDataSourceClocks: true,
    navigationHelpButton: true,
    homeButton: false,
    sceneModePicker: true,
    shadows: false,
    infoBox: false,
    imageryProviderViewModels: getProviderViewModels(),
    selectedImageryProviderViewModel: getProviderViewModels()[0],
    // imageryProvider: Cesium.createWorldImagery({
    //     style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
    //   }),
    //   baseLayerPicker: false,
    });

    // setting time of cesium
    let start = Cesium.JulianDate.fromIso8601("2016-04-30T00:02:00Z");
    let stop = Cesium.JulianDate.fromIso8601("2016-04-30T23:56:00Z");
    const clock = viewer.clock;
    clock.startTime = start;
    clock.currentTime = start;
    clock.stopTime = stop;


    setCurrentViewer(viewer);

    // let timeIntervalCollection = timeDynamicData(viewer);
    // imageryViewer(viewer, timeIntervalCollection);
    imageViewerCZML(viewer);
}

function imageViewerCZML(viewer) {  
  const dataSourcePromise = Cesium.CzmlDataSource.load("https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-processed-data/nexrad/katx/olympex_Level2_20160430.czml");
  viewer.dataSources.add(dataSourcePromise);
  viewer.zoomTo(dataSourcePromise);
  
  
}

function timeDynamicData(viewer) {
  const dates = [
    "2015-09-22T22:29:00Z",
    "2015-09-22T22:38:00Z",
    "2015-09-22T22:48:00Z",
    "2015-09-22T22:58:00Z",
    "2015-09-22T23:07:00Z",
    "2015-09-22T23:17:00Z",
    "2015-09-22T23:27:00Z",
    "2015-09-22T23:37:00Z",
    "2015-09-22T23:46:00Z",
    "2015-09-22T23:58:00Z",
  ];
  
  const uris = [
    "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-raw-data/nexrad/katx/2015-09-22/olympex_Level2_KATX_20150922_2229_ELEV_01.png",
    "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-raw-data/nexrad/katx/2015-09-22/olympex_Level2_KATX_20150922_2238_ELEV_01.png",
    "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-raw-data/nexrad/katx/2015-09-22/olympex_Level2_KATX_20150922_2248_ELEV_01.png",
    "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-raw-data/nexrad/katx/2015-09-22/olympex_Level2_KATX_20150922_2258_ELEV_01.png",
    "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-raw-data/nexrad/katx/2015-09-22/olympex_Level2_KATX_20150922_2307_ELEV_01.png",
    "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-raw-data/nexrad/katx/2015-09-22/olympex_Level2_KATX_20150922_2317_ELEV_01.png",
    "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-raw-data/nexrad/katx/2015-09-22/olympex_Level2_KATX_20150922_2327_ELEV_01.png",
    "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-raw-data/nexrad/katx/2015-09-22/olympex_Level2_KATX_20150922_2337_ELEV_01.png",
    "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-raw-data/nexrad/katx/2015-09-22/olympex_Level2_KATX_20150922_2346_ELEV_01.png",
    "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-raw-data/nexrad/katx/2015-09-22/olympex_Level2_KATX_20150922_2358_ELEV_01.png",
  ];
  
  function dataCallback(interval, index) {
      console.log("::::::::::::::::", index)
      let spatialCoverage = {W: -123.197, S: 48.735, E: -121.812, N: 49.653}
      let rectangle = Cesium.Rectangle.fromDegrees(spatialCoverage.W, spatialCoverage.S, spatialCoverage.E, spatialCoverage.N);
      let layers = viewer.scene.imageryLayers;

      layers.addImageryProvider(
      new Cesium.SingleTileImageryProvider({
      //   url: "../datas/CZMLS_FCX_05172017/nexrad/olympex_Level2_KATX_20150922_2229_ELEV_01.png",
        url: uris[index],
      //   rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
      //   rectangle: Cesium.Rectangle.fromDegrees(114.591,-45.837,148.97,-5.73),// australia
      // Cesium.Rectangle.fromDegrees(west, south, east, north, result) → Rectangle
        rectangle
      })
    );


    return {
      uri: uris[index],
    };
  }
  
  const timeIntervalCollection = Cesium.TimeIntervalCollection.fromIso8601DateArray(
    {
      iso8601Dates: dates,
      dataCallback: dataCallback,
    }
  );
  return timeIntervalCollection;
}

function imageryViewer(viewer, timeIntervalCollection) {
      const layers = viewer.scene.imageryLayers;
      const blackMarble = layers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 3812 })
      );
      
      blackMarble.alpha = 0.5;
      
      blackMarble.brightness = 2.0;
      
      // adding the imagery layer to the viewer scene.
      
      // let spatialCoverage = {N: 49.653, S: 48.735, E: -121.812, W: -123.197}
      // let rectangle = Cesium.Rectangle.fromDegrees(spatialCoverage.W, spatialCoverage.S, spatialCoverage.E, spatialCoverage.N);

      let timeDynamicImageryProviderInstance = new Cesium.TimeDynamicImagery({
        times: timeIntervalCollection,
        clock: viewer.clock,
        requestImageFunction: function() {
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!! Requeusting new image in progress.")
        },
        reloadFunction: function() {
          console.log("--------------------------- Requeusting RELOAD in progress.")
       
        }
      })

      layers.addImageryProvider(timeDynamicImageryProviderInstance);

      // layers.addImageryProvider(
      //   new Cesium.SingleTileImageryProvider({
      //   //   url: "../datas/CZMLS_FCX_05172017/nexrad/olympex_Level2_KATX_20150922_2229_ELEV_01.png",
      //     url: img,
      //   //   rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
      //   //   rectangle: Cesium.Rectangle.fromDegrees(114.591,-45.837,148.97,-5.73),// australia
      //   // Cesium.Rectangle.fromDegrees(west, south, east, north, result) → Rectangle
      //     rectangle
      //   })
      // ); 
}


let mapboxUsername = "ajinkyakulkarni"
let mapboxStyleId = "ckc65ettm0ixc1ipexrpklr96"
let mapboxAccessToken = "pk.eyJ1IjoiYWppbmt5YWt1bGthcm5pIiwiYSI6ImNrYzY1NHh3bDA3cXIyenA4dDdpOGlja2UifQ.g4r3pjugLK8yC2mkQmJr4w"
let mapboxUrl = "https://api.mapbox.com/styles/v1/" + mapboxUsername + "/" + mapboxStyleId + "/tiles/256/{z}/{x}/{y}?access_token=" + mapboxAccessToken

const getProviderViewModels = () =>{
    const providerViewModels = []  
    providerViewModels.push(
      new Cesium.ProviderViewModel({
        name: "Mapbox Streets Dark",
        iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/mapboxStreets.png"),
        category: "Mapbox",
        tooltip: "Mapbox Streets Dark",
        creationFunction: function () {
          return new Cesium.UrlTemplateImageryProvider({
            url: mapboxUrl,
          })
        },
      })
    )
    return providerViewModels
  }