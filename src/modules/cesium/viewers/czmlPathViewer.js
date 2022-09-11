import { Viewer, createWorldImagery, IonWorldImageryStyle, createWorldTerrain, ProviderViewModel, buildModuleUrl, viewerCesiumInspectorMixin, CzmlDataSource, HeadingPitchRange, Math, HeadingPitchRoll, Transforms } from 'cesium';
import impactData from "../datas/impactData.czml";

export default function CZMLPathViewer(setCurrentViewer) {

    // var viewer = new Viewer('cesiumContainer');
    // var baseLayerPickerViewModel = viewer.baseLayerPicker.viewModel;
    // baseLayerPickerViewModel.selectedImagery = baseLayerPickerViewModel.imageryProviderViewModels[0];

    // var viewer = new Viewer('cesiumContainer', {
    //     imageryProvider : createWorldImagery({
    //         style : IonWorldImageryStyle.AERIAL_WITH_LABELS
    //     }),
    //     baseLayerPicker : false
    // });

    const viewer = new Viewer("cesiumContainer", {
        // terrainProvider: createWorldTerrain(
        //     {
        //     requestWaterMask : true,
        //     requestVertexNormals : true}
        // ),
        shouldAnimate: false,
        useBrowserRecommendedResolution: true,
        selectedImageryProviderViewModel: new ProviderViewModel({
            name: "Bing Maps Aerial with Labels",
            iconUrl: buildModuleUrl("Widgets/Images/ImageryProviders/bingAerialLabels.png"),
            tooltip: "Bing Maps aerial imagery with labels, provided by Cesium ion",
            category: "Cesium ion",
            creationFunction: function () {
              return createWorldImagery({
                style: IonWorldImageryStyle.AERIAL_WITH_LABELS,
              })
            },
          })
    });

    setCurrentViewer(viewer);

    // viewer.extend(viewerCesiumInspectorMixin);

    doStuffWithCZML()

    function doStuffWithCZML() {
        // CzmlDataSource.load("./testData.czml")
        // CzmlDataSource.load("https://fcx-czml.s3.amazonaws.com/flight_track/goesrplt_naver2_IWG1_20170322-0136")
        CzmlDataSource.load(impactData)
        .then(async (dataSource) => {
            viewer.dataSources.add(dataSource);
            const clock = viewer.clock;
            const p3Entity = dataSource.entities.getById("Flight Track");
            
            // set the camera orientation and keep it far apart from the model.

            // a fly to is much better than zoom to.
            viewer.zoomTo(dataSource,  new HeadingPitchRange(0, Math.toRadians(-10), 40000));
            // await viewer.flyTo(p3Entity, {offset: new HeadingPitchRange(0, Math.toRadians(-10), 40000)})

            // viewer.camera.Zoomout(10000000);
            // viewer.camera.setView({ destination: p3Entity, orientation: new HeadingPitchRange(0, Math.toRadians(-10), 40000)})

            viewer.trackedEntity = p3Entity;

            clock.onTick.addEventListener(() => {
                fixOrientation();
            });

            function fixOrientation() {
                // change the model orientation
                const heading = Math.toRadians(270);
                const pitch = Math.toRadians(90);
                const roll = Math.toRadians(0);
                const position = p3Entity.position.getValue(clock.currentTime);
                    // the heading should change with respect to the position.
                    // TODO: if possible get the heading roll and pitch from the czml data itself. But question is when to take which data.
                    const hpr = new HeadingPitchRoll(heading, pitch, roll);
                    const orientation = Transforms.headingPitchRollQuaternion(
                        position,
                        hpr
                    );
                p3Entity.orientation = orientation;
            }
        });
    }
}