import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { selectLayer } from '../store/actions/layer';
import { enableSelectionTool } from '../store/actions/tool';
import { ThemeContext } from './ThemeProvider';
import { SelectLayerPayload, LayerTypes } from '../store/actionTypes/layer';
import { RootState } from '../store/reducers';
import { getPaperLayer } from '../store/selectors/layer';
import { updateActiveArtboardFrame } from '../store/utils/layer';
import { applyShapeMethods } from '../canvas/shapeUtils';
import { applyTextMethods } from '../canvas/textUtils';
import { applyArtboardMethods } from '../canvas/artboardUtils';
import { paperMain } from '../canvas';
import { SetCanvasZoomPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasZoom } from '../store/actions/canvasSettings';

interface CanvasProps {
  drawing: boolean;
  typing: boolean;
  zoom: number;
  selectLayer(payload: SelectLayerPayload): LayerTypes;
  enableSelectionTool(): any;
  setCanvasZoom(payload: SetCanvasZoomPayload): CanvasSettingsTypes;
  activeArtboard?: string;
  paperProject?: string;
  layerById?: {
    [id: string]: em.Layer;
  };
}

const Canvas = (props: CanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { drawing, typing, zoom, selectLayer, enableSelectionTool, activeArtboard, paperProject, layerById, setCanvasZoom } = props;

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
        // paper.view.center.x = e.clientX;
        // paper.view.center.y = e.clientY;
        if (e.deltaY < 0 && nextZoom < 30) {
          setCanvasZoom({zoom: nextZoom});
          //paperMain.view.zoom = nextZoom;
        } else if (e.deltaY > 0 && nextZoom > 0) {
          //paperMain.view.zoom = nextZoom;
          setCanvasZoom({zoom: nextZoom});
        } else if (e.deltaY > 0 && nextZoom < 0) {
          //paperMain.view.zoom = 0.001;
          setCanvasZoom({zoom: 0.001});
        }
        const zoomDiff = paperMain.view.zoom - prevZoom;
        const scale = 1 / paperMain.view.zoom;
        if (paperMain.project.getItem({data: {id: 'selectionFrame'}})) {
          const selectionFrameHandles = paperMain.project.getItems({data: {id: 'selectionFrameHandle'}});
          const selectionFrameBase = paperMain.project.getItem({data: {id: 'selectionFrameBase'}});
          selectionFrameHandles.forEach((handle) => {
            handle.scale(1 - scale * zoomDiff);
            handle.strokeWidth = scale;
          });
          selectionFrameBase.strokeWidth = scale;
        }
      } else {
        paperMain.view.translate(new paper.Point((e.deltaX * ( 1 / paperMain.view.zoom)) * -1, (e.deltaY * ( 1 / paperMain.view.zoom)) * -1));
      }
    });
    Object.keys(layerById).forEach((key) => {
      if (layerById[key].type === 'Shape') {
        applyShapeMethods(getPaperLayer(key));
      }
      if (layerById[key].type === 'Text') {
        applyTextMethods(getPaperLayer(key));
      }
      if (layerById[key].type === 'Artboard') {
        applyArtboardMethods(getPaperLayer(key).getItem({data: {id: 'ArtboardBackground'}}));
      }
    });
    paperMain.view.zoom = zoom;
  }, []);

  // const handleClick = (e) => {
  //   (document.activeElement as HTMLElement).blur();
  //   // canvasRef.current.tabIndex = 0;
  //   // canvasRef.current.focus();
  //   // paper.projects[0].activate();
  //   // //enableSelectionTool();
  //   // console.log(paper);
  // }

  // useEffect(() => {
  //   if (paperMain.project.getItem({data: { id: activeArtboard }})) {
  //     const activeArtboardFrames = paperMain.project.getItems({ data: { id: 'ArtboardFrame' } });
  //     if (activeArtboardFrames && activeArtboardFrames.length > 0) {
  //       activeArtboardFrames.forEach((item) => item.visible = false);
  //     }
  //     const paperActiveArtboardLayer = getPaperLayer(activeArtboard);
  //     paperActiveArtboardLayer.getItem({ data: { id: 'ArtboardFrame' } }).visible = true;
  //   }
  // }, [activeArtboard]);

  return (
    <div
      className={`c-canvas ${drawing ? 'c-canvas--drawing' : null} ${typing ? 'c-canvas--typing' : null}`}
      ref={canvasContainerRef}>
      <canvas
        id='canvas-main'
        ref={canvasRef}
        //onClick={handleClick}
        style={{
          background: theme.background.z0
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tool, canvasSettings } = state;
  return {
    activeArtboard: layer.present.activeArtboard,
    paperProject: layer.present.paperProject,
    layerById: layer.present.byId,
    drawing: tool.drawing,
    typing: tool.typing,
    zoom: canvasSettings.zoom
  };
};

export default connect(
  mapStateToProps,
  { selectLayer, enableSelectionTool, setCanvasZoom }
)(Canvas);