import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { enableSelectionTool } from '../store/actions/tool';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getPaperLayer } from '../store/selectors/layer';
import { updateActiveArtboardFrame } from '../store/utils/layer';
import { getPagePaperLayer } from '../store/selectors/layer';
import { applyShapeMethods } from '../canvas/shapeUtils';
import { applyTextMethods } from '../canvas/textUtils';
import { applyImageMethods } from '../canvas/imageUtils';
import { applyArtboardMethods } from '../canvas/artboardUtils';
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
  activeArtboard?: string;
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
  const { drawing, typing, canvasSettings, enableSelectionTool, updateInViewLayers, activeArtboard, paperProject, allArtboardIds, allShapeIds, allTextIds, allImageIds, setCanvasMatrix } = props;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paperMain.setup(canvasRef.current);
    paperMain.project.clear();
    paperMain.project.importJSON(paperProject);
    enableSelectionTool();
    canvasRef.current.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        e.preventDefault();
        const prevZoom = paperMain.view.zoom;
        const nextZoom = paperMain.view.zoom - e.deltaY * 0.01;
        if (e.deltaY < 0 && nextZoom < 30) {
          paperMain.view.zoom = nextZoom;
        } else if (e.deltaY > 0 && nextZoom > 0) {
          paperMain.view.zoom = nextZoom;
        } else if (e.deltaY > 0 && nextZoom < 0) {
          paperMain.view.zoom = 0.001;
        }
        const zoomDiff = paperMain.view.zoom - prevZoom;
        const scale = 1 / paperMain.view.zoom;
        if (paperMain.project.getItem({data: {id: 'selectionFrame'}})) {
          const selectionFrameHandles = paperMain.project.getItems({data: {id: 'selectionFrameHandle'}});
          const selectionFrameBase = paperMain.project.getItem({data: {id: 'selectionFrameBase'}});
          selectionFrameHandles.forEach((handle) => {
            handle.scale(1 - scale * zoomDiff);
            handle.strokeWidth = scale;
            if (handle.data.handle === 'move') {
              handle.position.y = selectionFrameBase.bounds.topCenter.y - (scale * 24);
            }
          });
          selectionFrameBase.strokeWidth = scale;
        }
        if (paperMain.project.getItem({data: {id: 'hoverFrame'}})) {
          const hoverFrame = paperMain.project.getItem({data: {id: 'hoverFrame'}});
          hoverFrame.strokeWidth = scale;
        }
        if (paperMain.project.getItem({data: {id: 'gradientEditor'}})) {
          const gradientEditorHandles = paperMain.project.getItems({data: {id: 'gradientEditorHandle'}});
          const gradientEditorLines = paperMain.project.getItems({data: {id: 'gradientEditorLine'}});
          gradientEditorHandles.forEach((handle) => {
            handle.scale(1 - scale * zoomDiff);
          });
          gradientEditorLines.forEach((line) => {
            if (line.data.line === 'dark') {
              line.strokeWidth = scale * 3;
            } else {
              line.strokeWidth = scale;
            }
          });
        }
      } else {
        paperMain.view.translate(new paper.Point((e.deltaX * ( 1 / paperMain.view.zoom)) * -1, (e.deltaY * ( 1 / paperMain.view.zoom)) * -1));
      }
    });
    canvasRef.current.addEventListener('wheel', debounce((e: WheelEvent) => {
      e.preventDefault();
      setCanvasMatrix({matrix: paperMain.view.matrix.values});
      updateInViewLayers();
    }, 250));
    allShapeIds.forEach((shapeId) => {
      applyShapeMethods(getPaperLayer(shapeId));
    });
    allArtboardIds.forEach((artboardId) => {
      const artboardBackground = getPaperLayer(artboardId).getItem({data: {id: 'ArtboardBackground'}});
      applyArtboardMethods(artboardBackground);
    });
    allTextIds.forEach((textId) => {
      applyTextMethods(getPaperLayer(textId));
    });
    allImageIds.forEach((imageId) => {
      const raster = getPaperLayer(imageId).getItem({data: {id: 'Raster'}}) as paper.Raster;
      applyImageMethods(raster);
    });
    if (canvasSettings.matrix) {
      paperMain.view.matrix.set(canvasSettings.matrix);
    }
    updateInViewLayers();
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
  const paperProject = canvasSettings.allImageIds.reduce((result, current) => {
    const rasterBase64 = bufferToBase64(Buffer.from(canvasSettings.imageById[current].buffer));
    const base64 = `data:image/webp;base64,${rasterBase64}`;
    return result.replace(`"source":"${current}"`, `"source":"${base64}"`);
  }, layer.present.paperProject);
  return {
    activeArtboard: layer.present.activeArtboard,
    drawing: tool.type === 'Shape' || tool.type === 'Artboard',
    typing: tool.type === 'Text',
    allArtboardIds: layer.present.allArtboardIds,
    allShapeIds: layer.present.allShapeIds,
    allTextIds: layer.present.allTextIds,
    allImageIds: layer.present.allImageIds,
    canvasSettings,
    paperProject
  };
};

export default connect(
  mapStateToProps,
  { enableSelectionTool, setCanvasMatrix, updateInViewLayers }
)(Canvas);