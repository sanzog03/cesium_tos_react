import * as Cesium from 'cesium';

export default function tilesCzmlViewer(setCurrentViewer) {
    const viewer = new Cesium.Viewer("cesiumContainer", {
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
    });

    // setting time of cesium
    let start = Cesium.JulianDate.fromIso8601("2016-04-30T00:02:00Z");
    let stop = Cesium.JulianDate.fromIso8601("2016-04-30T23:56:00Z");
    const clock = viewer.clock;
    clock.startTime = start;
    clock.currentTime = start;
    clock.stopTime = stop;


    setCurrentViewer(viewer);

    view3dTilesInCzml(viewer);
}

// real stuff

const czml = [
    {
      id: "document",
      version: "1.0",
      clock: {
        interval: "2015-12-03T00:00:00Z/2015-12-03T02:00:00Z",
        currentTime: "2015-12-03T00:00:00Z",
        multiplier: 16,
      },
    },
    {
      id: "BatchedColors1",
      name: "BatchedColors",
      availability: "2015-12-03T00:05:00Z/2015-12-03T00:20:08Z",
      tileset: {
        uri:
          "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-processed-data/npol/20151203/freq-0/tileset.json",
      },
    },
    {
        id: "BatchedColors2",
        name: "BatchedColors",
        availability: "2015-12-03T00:20:08Z/2015-12-03T00:40:05Z",
        tileset: {
          uri:
            "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-processed-data/npol/20151203/freq-2/tileset.json",
        },
    },
    {
        id: "BatchedColors3",
        name: "BatchedColors",
        availability: "2015-12-03T00:40:05Z/2015-12-03T01:00:03Z",
        tileset: {
          uri:
            "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-processed-data/npol/20151203/freq-4/tileset.json",
        },
    },
    {
        id: "BatchedColors4",
        name: "BatchedColors",
        availability: "2015-12-03T01:00:03Z/2015-12-03T01:20:04Z",
        tileset: {
          uri:
            "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-processed-data/npol/20151203/freq-6/tileset.json",
        },
    },
    {
        id: "BatchedColors5",
        name: "BatchedColors",
        availability: "2015-12-03T01:20:04Z/2015-12-03T01:40:05Z",
        tileset: {
          uri:
            "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-processed-data/npol/20151203/freq-8/tileset.json",
        },
    },

  ];

function view3dTilesInCzml(viewer) {
  const loadedDatasource = Cesium.CzmlDataSource.load(czml);
  const dataSourcePromise = viewer.dataSources.add(loadedDatasource);

  dataSourcePromise
  .then(function (dataSource) {
    viewer.flyTo(dataSource.entities.getById("BatchedColors1"));
  })
  .catch(function (error) {
    window.alert(error);
  });
}

// for worldmap

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