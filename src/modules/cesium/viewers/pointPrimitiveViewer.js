import { Viewer ,createWorldTerrain , Color, PointPrimitiveCollection, Cartesian3,  NearFarScalar } from 'cesium';
// import LISpoints from '../datas/CZMLS_FCX_05172017/points/GLMpoints.json';
import LISpoints from '../datas/CZMLS_FCX_05172017/points/LISpoints.json';

export default function pointPrimitiveViewer(setCurrentViewer) {
    const viewer = new Viewer("cesiumContainer", {
        terrainProvider: createWorldTerrain(),
        shouldAnimate: true,
    });

    setCurrentViewer(viewer);
    LISpoints.forEach(packet => basicPlotter(viewer, packet));
    // basicPlotterKTM(viewer);
}

function basicPlotter (viewer, packet) {
    const {id, Lon, Lat, Rad, count} = packet;
    // Create a pointPrimitive collection with two points
    const primitiveCollection = new PointPrimitiveCollection();
    const points = viewer.scene.primitives.add(primitiveCollection);

    Lon.forEach((element, index) => {
        let pw = 0.6, fct = 1/15;
        let nFScalar = new NearFarScalar(1.e2, 2, 8.0e6, 0.5);
        points.add({
            // position : new Cartesian3(1.0, 2.0, 3.0),
            position: Cartesian3.fromDegrees(Lon[index], Lat[index]),
            color : selectColor(),
            pixel: Math.pow(Rad[index], pw) * fct,
            scaleByDistance: nFScalar
            });
    });
}

function selectColor() {
    let colors = {
        yellow: new Color(1.0, 1.0, 0.4, 1),
        cyan: new Color(0.68, 1.0, 0.55, .6),
        orng: Color.ORANGE.brighten(0.5, new Color())
    }
    let rand = Math.floor(Math.random() * 3);
    switch (rand) {
        case 0:
            return colors.yellow;
        case 1:
            return colors.cyan;
        default:
            return colors.orng;
    }
}

function basicPlotterKTM (viewer) {

    // views the 3D tiles
    // const tileset = new Cesium3DTileset({

    // Create a pointPrimitive collection with two points
    const primitiveCollection = new PointPrimitiveCollection();
    const points = viewer.scene.primitives.add(primitiveCollection);

    points.add({
    // position : new Cartesian3(1.0, 2.0, 3.0),
    position: Cartesian3.fromDegrees(85.300140, 27.700769),
    color : Color.RED
    });
    points.add({
    position : Cartesian3.fromDegrees(85.300140, 27.700769),
    color : Color.RED
    });

    moveCameraToKTM(viewer);
}

function moveCameraToKTM(viewer) {
    const long = 85.300140, lat = 27.700769;
    viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(
            long,
            lat,
            1000.0
        ),
        });
}