import * as Cesium from 'cesium';
import impactData from "../datas/impactData.czml";

export default function CZMLPathViewer(setCurrentViewer) {

    // var viewer = new Cesium.Viewer('cesiumContainer');
    // var baseLayerPickerViewModel = viewer.baseLayerPicker.viewModel;
    // baseLayerPickerViewModel.selectedImagery = baseLayerPickerViewModel.imageryProviderViewModels[0];

    // var viewer = new Cesium.Viewer('cesiumContainer', {
    //     imageryProvider : Cesium.createWorldImagery({
    //         style : Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
    //     }),
    //     baseLayerPicker : false
    // });

    const viewer = new Cesium.Viewer("cesiumContainer", {
        // terrainProvider: Cesium.createWorldTerrain(
        //     {
        //     requestWaterMask : true,
        //     requestVertexNormals : true}
        // ),
        shouldAnimate: false,
        useBrowserRecommendedResolution: true,
        selectedImageryProviderViewModel: new Cesium.ProviderViewModel({
            name: "Bing Maps Aerial with Labels",
            iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerialLabels.png"),
            tooltip: "Bing Maps aerial imagery with labels, provided by Cesium ion",
            category: "Cesium ion",
            creationFunction: function () {
              return Cesium.createWorldImagery({
                style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
              })
            },
          })
    });

    setCurrentViewer(viewer);

    // viewer.extend(Cesium.viewerCesiumInspectorMixin);

    doStuffWithCZML()

    function doStuffWithCZML() {
        // Cesium.CzmlDataSource.load("./testData.czml")
        // Cesium.CzmlDataSource.load("https://fcx-czml.s3.amazonaws.com/flight_track/goesrplt_naver2_IWG1_20170322-0136")
        Cesium.CzmlDataSource.load(impactData)
        .then(async (dataSource) => {
            viewer.dataSources.add(dataSource);
            const clock = viewer.clock;
            const p3Entity = dataSource.entities.getById("Flight Track");
            
            // set the camera orientation and keep it far apart from the model.

            // a fly to is much better than zoom to.
            viewer.zoomTo(dataSource,  new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-10), 40000));
            // await viewer.flyTo(p3Entity, {offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-10), 40000)})

            // viewer.camera.Zoomout(10000000);
            // viewer.camera.setView({ destination: p3Entity, orientation: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-10), 40000)})

            viewer.trackedEntity = p3Entity;

            clock.onTick.addEventListener(() => {
                fixOrientation();
            });

            function fixOrientation() {
                // change the model orientation
                const heading = Cesium.Math.toRadians(270);
                const pitch = Cesium.Math.toRadians(90);
                const roll = Cesium.Math.toRadians(0);
                const position = p3Entity.position.getValue(clock.currentTime);
                    // the heading should change with respect to the position.
                    // TODO: if possible get the heading roll and pitch from the czml data itself. But question is when to take which data.
                    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
                    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
                        position,
                        hpr
                    );
                p3Entity.orientation = orientation;
            }
        });
    }
}