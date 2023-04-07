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
      // clock: {
      //   // interval: "2015-12-03T00:00:00Z/2015-12-03T02:00:00Z",
      //   // currentTime: "2015-12-03T00:00:00Z",
      //   // multiplier: 16,
      // },
    },
    {
      id: "BatchedColors1",
      name: "BatchedColors",
      availability: "2015-12-03T00:05:00Z/2015-12-03T00:20:08Z",
      tileset: {
        uri: "https://ghrc-fcx-field-campaigns-szg.s3.amazonaws.com/Olympex/instrument-processed-data/npol/20151203/freq-1/tileset.json",
        color: "color('#ff0000')", // this doesnot work
        show: true // whereas this works 
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

async function view3dTilesInCzml(viewer) {
  const loadDatasourcePromise = Cesium.CzmlDataSource.load(czml);
  loadDatasourcePromise.then(ds => {
    console.log(">>>>", ds)
    console.log("entities>>>", ds.entities.values)

    ds.entities.values.forEach((entity) => {
      console.log("-->", entity.tileset)
      let tileset = entity.tileset;

      tileset.style = new Cesium.Cesium3DTileStyle({
        color: getColorExpression(),
        pointSize: "5000000",
        show: false
      });
    })
  })
  const dataSourcePromise = viewer.dataSources.add(loadDatasourcePromise);

  dataSourcePromise
  .then(function (dataSource) {
    // viewer.flyTo(dataSource.entities.getById("npol-3dtile-0"));
    viewer.flyTo(dataSource.entities.getById("BatchedColors1"));
    // let entities = dataSource.entities._entities._array.map((ent) => {
    //   return ent._id
    // });
    // console.log("hey!!", entities)
    // let first_tileset = dataSource.entities.getById(entities[0])
    // console.log(">>>", first_tileset)
    // if(first_tileset){
    //   first_tileset._tileset.style.pointSize = 2.0;
    //   first_tileset._tileset.style.color = getColorExpression();  
    // }
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

// utils

function getColorExpression() {
  let lead = 0
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

