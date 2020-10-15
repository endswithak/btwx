// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { importPaperProject } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { LayerTypes } from '../store/actionTypes/layer';
import { updateInViewLayers } from '../store/actions/layer';
import Canvas from './Canvas';

interface CanvasWrapProps {
  ready: boolean;
  documentImages: {
    [id: string]: em.DocumentImage;
  };
  paperProject?: string;
  matrix?: number[];
  updateInViewLayers(): LayerTypes;
  setReady(ready: boolean): void;
}

const CanvasWrap = (props: CanvasWrapProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { ready, matrix, documentImages, updateInViewLayers, paperProject, setReady } = props;

  useEffect(() => {
    paperMain.setup(document.getElementById('canvas') as HTMLCanvasElement);
    importPaperProject({
      paperProject,
      documentImages: documentImages
    });
    paperMain.view.viewSize = new paperMain.Size(canvasContainerRef.current.clientWidth, canvasContainerRef.current.clientHeight);
    paperMain.view.matrix.set(matrix);
    updateInViewLayers();
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
  matrix: number[];
} => {
  const { layer, documentSettings } = state;
  return {
    documentImages: documentSettings.images.byId,
    paperProject: layer.present.paperProject,
    matrix: documentSettings.matrix
  };
};

export default connect(
  mapStateToProps,
  { updateInViewLayers }
)(CanvasWrap);