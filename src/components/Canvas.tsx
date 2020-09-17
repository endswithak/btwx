import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { enableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { importPaperProject } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { SetCanvasMatrixPayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { SetCanvasZoomingPayload, SetCanvasZoomingTypePayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasZooming, setCanvasZoomingType } from '../store/actions/canvasSettings';
import { LayerTypes } from '../store/actionTypes/layer';
import { updateInViewLayers } from '../store/actions/layer';
import { debounce } from '../utils';

interface CanvasProps {
  documentImages: {
    [id: string]: em.DocumentImage;
  };
  paperProject?: string;
  allArtboardIds?: string[];
  allShapeIds?: string[];
  allTextIds?: string[];
  allImageIds?: string[];
  isInsertKnobActive?: boolean;
  cursor: string;
  matrix?: number[];
  enableSelectionTool(): ToolTypes;
  setCanvasMatrix(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
  setCanvasZooming(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
  setCanvasZoomingType(payload: SetCanvasZoomingTypePayload): CanvasSettingsTypes;
  updateInViewLayers(): LayerTypes;
  setReady(ready: boolean): void;
}

let canvasZooming = false;
let canvasZoomingType: em.ZoomingType = null;

const Canvas = (props: CanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { cursor, matrix, documentImages, enableSelectionTool, updateInViewLayers, paperProject, allArtboardIds, allShapeIds, allTextIds, allImageIds, setCanvasMatrix, setReady, setCanvasZooming, setCanvasZoomingType } = props;

  const handleWheel = (e: WheelEvent): void => {
    e.preventDefault();
    if (e.ctrlKey) {
      e.preventDefault();
      const cursorPoint = paperMain.view.getEventPoint(e as any);
      const pointDiff = new paperMain.Point(cursorPoint.x - paperMain.view.center.x, cursorPoint.y - paperMain.view.center.y);
      const prevZoom = paperMain.view.zoom;
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
      const zoomDiff = paperMain.view.zoom - prevZoom;
      paperMain.view.translate(
        new paper.Point(
          ((zoomDiff * pointDiff.x) * ( 1 / paperMain.view.zoom)) * -1,
          ((zoomDiff * pointDiff.y) * ( 1 / paperMain.view.zoom)) * -1
        )
      );
    } else {
      paperMain.view.translate(
        new paper.Point(
          (e.deltaX * ( 1 / paperMain.view.zoom)) * -1,
          (e.deltaY * ( 1 / paperMain.view.zoom)) * -1
        )
      );
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

  useEffect(() => {
    // init canvas
    paperMain.setup(canvasRef.current);
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
    // add listeners
    canvasRef.current.addEventListener('wheel', handleWheel);
    canvasRef.current.addEventListener('wheel', handleWheelDebounce);
    window.addEventListener('resize', handleResize);
    // update inview layers
    updateInViewLayers();
    enableSelectionTool();
    // set app ready
    setReady(true);
  }, []);

  return (
    <div
      id='canvas-container'
      className='c-canvas'
      ref={canvasContainerRef}
      style={{cursor}}>
      <canvas
        id='canvas'
        tabIndex={0}
        ref={canvasRef}
        style={{
          background: theme.background.z0
        }} />
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
  focusing: boolean;
  cursor: string;
  matrix: number[];
} => {
  const { layer, tool, canvasSettings, documentSettings } = state;
  const cursor = (() => {
    if (tool.type === 'Shape' || tool.type === 'Artboard') {
      return 'crosshair';
    }
    if (tool.type === 'Text') {
      return 'text'
    }
    if (canvasSettings.selecting) {
      return 'default';
    }
    if (canvasSettings.resizing) {
      return `${canvasSettings.resizingType}-resize`;
    }
    if (canvasSettings.dragging) {
      return 'move';
    }
    if (canvasSettings.zooming) {
      return `zoom-${canvasSettings.zoomingType}`;
    }
  })();
  return {
    documentImages: documentSettings.images.byId,
    allArtboardIds: layer.present.allArtboardIds,
    allShapeIds: layer.present.allShapeIds,
    allTextIds: layer.present.allTextIds,
    allImageIds: layer.present.allImageIds,
    paperProject: layer.present.paperProject,
    focusing: canvasSettings.focusing,
    matrix: documentSettings.matrix,
    cursor
  };
};

export default connect(
  mapStateToProps,
  { enableSelectionTool, setCanvasMatrix, updateInViewLayers, setCanvasZooming, setCanvasZoomingType }
)(Canvas);