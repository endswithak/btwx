// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { importPaperProject } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { LayerTypes } from '../store/actionTypes/layer';
import { updateInViewLayers } from '../store/actions/layer';
// import { APPLE_IPHONE_DEVICES, ANDROID_MOBILE_DEVICES } from '../constants';
// import { zoomSelectionThunk } from '../store/actions/zoomTool';
import Canvas from './Canvas';

interface CanvasWrapProps {
  ready: boolean;
  documentImages: {
    [id: string]: em.DocumentImage;
  };
  paperProject?: string;
  allArtboardIds?: string[];
  allShapeIds?: string[];
  allTextIds?: string[];
  allImageIds?: string[];
  matrix?: number[];
  updateInViewLayers(): LayerTypes;
  setReady(ready: boolean): void;
  // addArtboardThunk?(payload: AddArtboardPayload): Promise<em.Artboard>;
  // zoomSelectionThunk?(): void;
  // selectLayer?(payload: SelectLayerPayload): LayerTypes;
}

const CanvasWrap = (props: CanvasWrapProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { ready, matrix, documentImages, updateInViewLayers, paperProject, allArtboardIds, allShapeIds, allTextIds, allImageIds, setReady } = props;

  useEffect(() => {
    // init canvas
    paperMain.setup(document.getElementById('canvas') as HTMLCanvasElement);
    importPaperProject({
      paperProject,
      documentImages: documentImages,
      layers: {
        shape: allShapeIds,
        artboard: allArtboardIds,
        text: allTextIds,
        image: allImageIds
      }
    });
    paperMain.view.viewSize = new paperMain.Size(canvasContainerRef.current.clientWidth, canvasContainerRef.current.clientHeight);
    paperMain.view.matrix.set(matrix);
    // update inview layers
    updateInViewLayers();
    // toggleSelectionToolThunk();
    // add artboard if doc is empty
    // if (allArtboardIds.length === 0) {
    //   const artboardDevice = remote.process.platform === 'darwin' ? APPLE_IPHONE_DEVICES.find((device) => device.type === 'iPhone 11') : ANDROID_MOBILE_DEVICES.find((device) => device.type === 'Galaxy S10e');
    //   addArtboardThunk({
    //     layer: {
    //       parent: 'page',
    //       name: artboardDevice.type,
    //       frame: {
    //         x: paperMain.view.center.x,
    //         y: paperMain.view.center.x,
    //         width: artboardDevice.width,
    //         height: artboardDevice.height,
    //         innerWidth: artboardDevice.width,
    //         innerHeight: artboardDevice.height
    //       }
    //     } as any
    //   }).then((artboard) => {
    //     selectLayer({id: artboard.id, newSelection: true});
    //     zoomSelectionThunk();
    //   });
    // }
    // set app ready
    setReady(true);
  }, []);

  return (
    <div
      id='canvas-container'
      className='c-canvas'
      ref={canvasContainerRef}>
      <Canvas ready={ready} />
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  documentImages: {
    [id: string]: em.DocumentImage;
  };
  paperProject: string;
  allArtboardIds: string[];
  allShapeIds: string[];
  allTextIds: string[];
  allImageIds: string[];
  matrix: number[];
} => {
  const { layer, documentSettings } = state;
  return {
    documentImages: documentSettings.images.byId,
    allArtboardIds: layer.present.allArtboardIds,
    allShapeIds: layer.present.allShapeIds,
    allTextIds: layer.present.allTextIds,
    allImageIds: layer.present.allImageIds,
    paperProject: layer.present.paperProject,
    matrix: documentSettings.matrix
  };
};

export default connect(
  mapStateToProps,
  { updateInViewLayers }
)(CanvasWrap);