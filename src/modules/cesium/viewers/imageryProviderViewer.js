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

    setCurrentViewer(viewer);
    imageryViewer(viewer);
}

function imageryViewer(viewer) {
      const layers = viewer.scene.imageryLayers;
      const blackMarble = layers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 3812 })
      );
      
      blackMarble.alpha = 0.5;
      
      blackMarble.brightness = 2.0;
      
      let spatialCoverage = {N: 49.653, S: 48.735, E: -121.812, W: -123.197}
      layers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
        //   url: "../datas/CZMLS_FCX_05172017/nexrad/olympex_Level2_KATX_20150922_2229_ELEV_01.png",
          url: img,
        //   rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
        //   rectangle: Cesium.Rectangle.fromDegrees(114.591,-45.837,148.97,-5.73),// australia
        // Cesium.Rectangle.fromDegrees(west, south, east, north, result) → Rectangle
          rectangle: Cesium.Rectangle.fromDegrees(spatialCoverage.W, spatialCoverage.S, spatialCoverage.E, spatialCoverage.N)
        })
      ); 
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