import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { enableSelectionTool } from '../store/actions/tool';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { importPaperProject } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { SetCanvasMatrixPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/canvasSettings';
import { LayerTypes } from '../store/actionTypes/layer';
import { updateInViewLayers } from '../store/actions/layer';
import { CanvasSettingsState } from '../store/reducers/canvasSettings';
import { debounce, bufferToBase64 } from '../utils';

interface CanvasProps {
  drawing: boolean;
  typing: boolean;
  canvasSettings: CanvasSettingsState;
  enableSelectionTool(): any;
  setCanvasMatrix(payload: SetCanvasMatrixPayload): CanvasSettingsTypes;
  updateInViewLayers(): LayerTypes;
  paperProject?: string;
  allArtboardIds?: string[];
  allShapeIds?: string[];
  allTextIds?: string[];
  allImageIds?: string[];
}

const Canvas = (props: CanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { drawing, typing, canvasSettings, enableSelectionTool, updateInViewLayers, paperProject, allArtboardIds, allShapeIds, allTextIds, allImageIds, setCanvasMatrix } = props;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paperMain.setup(canvasRef.current);
    importPaperProject({
      paperProject,
      canvasImages: canvasSettings.images.byId,
      layers: {
        shape: allShapeIds,
        artboard: allArtboardIds,
        text: allTextIds,
        image: allImageIds
      }
    });
    canvasRef.current.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        e.preventDefault();
        const nextZoom = paperMain.view.zoom - e.deltaY * 0.01;
        if (e.deltaY < 0 && nextZoom < 30) {
          paperMain.view.zoom = nextZoom;
        } else if (e.deltaY > 0 && nextZoom > 0) {
          paperMain.view.zoom = nextZoom;
        } else if (e.deltaY > 0 && nextZoom < 0) {
          paperMain.view.zoom = 0.01;
        }
      } else {
        paperMain.view.translate(new paper.Point((e.deltaX * ( 1 / paperMain.view.zoom)) * -1, (e.deltaY * ( 1 / paperMain.view.zoom)) * -1));
      }
    });
    canvasRef.current.addEventListener('wheel', debounce((e: WheelEvent) => {
      e.preventDefault();
      setCanvasMatrix({matrix: paperMain.view.matrix.values});
      updateInViewLayers();
    }, 150));
    if (canvasSettings.matrix) {
      paperMain.view.matrix.set(canvasSettings.matrix);
    }
    updateInViewLayers();
    enableSelectionTool();
  }, []);

  return (
    <div
      className={`c-canvas ${drawing ? 'c-canvas--drawing' : null} ${typing ? 'c-canvas--typing' : null}`}
      ref={canvasContainerRef}>
      <canvas
        id='canvas-main'
        tabIndex={0}
        ref={canvasRef}
        onMouseDown={() => canvasRef.current.focus()}
        style={{
          background: theme.background.z0
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tool, canvasSettings } = state;
  return {
    drawing: tool.type === 'Shape' || tool.type === 'Artboard',
    typing: tool.type === 'Text',
    allArtboardIds: layer.present.allArtboardIds,
    allShapeIds: layer.present.allShapeIds,
    allTextIds: layer.present.allTextIds,
    allImageIds: layer.present.allImageIds,
    paperProject: layer.present.paperProject,
    canvasSettings: canvasSettings
  };
};

export default connect(
  mapStateToProps,
  { enableSelectionTool, setCanvasMatrix, updateInViewLayers }
)(Canvas);