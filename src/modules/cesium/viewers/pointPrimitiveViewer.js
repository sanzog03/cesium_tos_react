import { Viewer ,createWorldTerrain , Color, PointPrimitiveCollection, Cartesian3 } from 'cesium';
// import GLMpoints from '../datas/CZMLS_FCX_05172017/points/GLMpoints.json';
import GLMpoints from '../datas/CZMLS_FCX_05172017/3dTile/tileset_goesrpltcrs_phys.json';
import { extendCesium3DTileset } from 'temporal-3d-tile';

export default function pointPrimitiveViewer(setCurrentViewer) {
        basicPlotter(setCurrentViewer);
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

    function basicPlotter (setCurrentViewer) {
        const viewer = new Viewer("cesiumContainer", {
            terrainProvider: createWorldTerrain(),
            shouldAnimate: true,
        });
    
        setCurrentViewer(viewer);
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
    
        // moveCameraToKTM(viewer);
        // viewer.zoomTo(primitiveCollection);
    }