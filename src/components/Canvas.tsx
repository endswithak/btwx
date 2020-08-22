import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { enableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { importPaperProject } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { SetCanvasMatrixPayload, SetCanvasZoomingPayload, SetCanvasZoomingTypePayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix, setCanvasZooming, setCanvasZoomingType } from '../store/actions/canvasSettings';
import { LayerTypes } from '../store/actionTypes/layer';
import { updateInViewLayers } from '../store/actions/layer';
import { CanvasSettingsState } from '../store/reducers/canvasSettings';
import { debounce } from '../utils';
import { DocumentSettingsState } from '../store/reducers/documentSettings';

interface CanvasProps {
  drawing: boolean;
  typing: boolean;
  canvasSettings: CanvasSettingsState;
  documentSettings: DocumentSettingsState;
  paperProject?: string;
  allArtboardIds?: string[];
  allShapeIds?: string[];
  allTextIds?: string[];
  allImageIds?: string[];
  isInsertKnobActive?: boolean;
  zooming?: boolean;
  enableSelectionTool(): ToolTypes;
  setCanvasMatrix(payload: SetCanvasMatrixPayload): CanvasSettingsTypes;
  setCanvasZooming(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
  setCanvasZoomingType(payload: SetCanvasZoomingTypePayload): CanvasSettingsTypes;
  updateInViewLayers(): LayerTypes;
  setReady(ready: boolean): void;
}

let canvasZooming = false;
let insertKnobActive = false;
let canvasZoomingType: em.ZoomingType = null;

const Canvas = (props: CanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { drawing, typing, canvasSettings, documentSettings, enableSelectionTool, updateInViewLayers, paperProject, allArtboardIds, allShapeIds, allTextIds, allImageIds, setCanvasMatrix, setReady, isInsertKnobActive, setCanvasZooming, zooming, setCanvasZoomingType } = props;

  const handleWheel = (e: WheelEvent): void => {
    e.preventDefault();
    if (!insertKnobActive) {
      if (e.ctrlKey) {
        e.preventDefault();
        const nextZoom = paperMain.view.zoom - e.deltaY * 0.01;
        if (!canvasZooming) {
          canvasZooming = true;
          setCanvasZooming({zooming: true});
        }
        if (e.deltaY < 0 && nextZoom < 30) {
          if (canvasZoomingType !== 'in') {
            canvasZoomingType = 'in';
            setCanvasZoomingType({zoomingType: 'in'});
          }
          paperMain.view.zoom = nextZoom;
        } else if (e.deltaY > 0 && nextZoom > 0) {
          if (canvasZoomingType !== 'out') {
            canvasZoomingType = 'out';
            setCanvasZoomingType({zoomingType: 'out'});
          }
          paperMain.view.zoom = nextZoom;
        } else if (e.deltaY > 0 && nextZoom < 0) {
          paperMain.view.zoom = 0.01;
        }
      } else {
        paperMain.view.translate(
          new paper.Point(
            (e.deltaX * ( 1 / paperMain.view.zoom)) * -1,
            (e.deltaY * ( 1 / paperMain.view.zoom)) * -1
          )
        );
      }
    }
  }

  const handleResize = (): void => {
    paperMain.view.viewSize = new paperMain.Size(
      canvasContainerRef.current.clientWidth,
      canvasContainerRef.current.clientHeight
    );
  }

  const handleWheelDebounce = debounce((e: WheelEvent) => {
    e.preventDefault();
    if (canvasZooming) {
      canvasZooming = false;
      setCanvasZooming({zooming: false});
    }
    setCanvasMatrix({matrix: paperMain.view.matrix.values});
    updateInViewLayers();
  }, 150);

  const initCanvas = (): void => {
    paperMain.setup(canvasRef.current);
    importPaperProject({
      paperProject,
      documentImages: documentSettings.images.byId,
      layers: {
        shape: allShapeIds,
        artboard: allArtboardIds,
        text: allTextIds,
        image: allImageIds
      }
    });
    paperMain.view.viewSize = new paperMain.Size(canvasContainerRef.current.clientWidth, canvasContainerRef.current.clientHeight);
    paperMain.view.matrix.set(canvasSettings.matrix);
  }

  useEffect(() => {
    initCanvas();
    canvasRef.current.addEventListener('wheel', handleWheel);
    canvasRef.current.addEventListener('wheel', handleWheelDebounce);
    window.addEventListener('resize', handleResize);
    updateInViewLayers();
    enableSelectionTool();
    setReady(true);
  }, []);

  useEffect(() => {
    insertKnobActive = isInsertKnobActive;
  }, [isInsertKnobActive]);

  return (
    <div
      id='canvas-container'
      className='c-canvas'
      ref={canvasContainerRef}
      style={{
        cursor: (() => {
          if (drawing) {
            return 'crosshair';
          }
          if (typing) {
            return 'text'
          }
          if (canvasSettings.resizing) {
            return `${canvasSettings.resizingType}-resize`;
          }
          if (canvasSettings.dragging) {
            return 'move';
          }
          if (canvasSettings.zooming) {
            return `zoom-${canvasZoomingType}`;
          }
        })()
      }}>
      <canvas
        id='canvas'
        tabIndex={0}
        ref={canvasRef}
        onMouseDown={(): void => canvasRef.current.focus()}
        style={{
          background: theme.background.z0
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  drawing: boolean;
  typing: boolean;
  canvasSettings: CanvasSettingsState;
  documentSettings: DocumentSettingsState;
  paperProject: string;
  allArtboardIds: string[];
  allShapeIds: string[];
  allTextIds: string[];
  allImageIds: string[];
  isInsertKnobActive: boolean;
  zooming: boolean;
} => {
  const { layer, tool, canvasSettings, documentSettings, insertKnob } = state;
  return {
    drawing: tool.type === 'Shape' || tool.type === 'Artboard',
    typing: tool.type === 'Text',
    allArtboardIds: layer.present.allArtboardIds,
    allShapeIds: layer.present.allShapeIds,
    allTextIds: layer.present.allTextIds,
    allImageIds: layer.present.allImageIds,
    paperProject: layer.present.paperProject,
    isInsertKnobActive: insertKnob.isActive,
    zooming: canvasSettings.zooming,
    canvasSettings,
    documentSettings
  };
};

export default connect(
  mapStateToProps,
  { enableSelectionTool, setCanvasMatrix, updateInViewLayers, setCanvasZooming, setCanvasZoomingType }
)(Canvas);