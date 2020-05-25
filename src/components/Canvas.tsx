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
import { applyArtboardMethods } from '../canvas/artboardUtils';
import { paperMain } from '../canvas';

interface CanvasProps {
  selectLayer(payload: SelectLayerPayload): LayerTypes;
  enableSelectionTool(): any;
  activeArtboard?: string;
  paperProject?: string;
  layerById?: {
    [id: string]: em.Layer;
  };
}

const Canvas = ({selectLayer, enableSelectionTool, activeArtboard, paperProject, layerById}: CanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);

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
          });
          selectionFrameBase.strokeWidth = scale;
        }
      } else {
        paperMain.view.translate(new paper.Point(e.deltaX * -1, e.deltaY * -1));
      }
    });
    Object.keys(layerById).forEach((key) => {
      if (layerById[key].type === 'Shape') {
        applyShapeMethods(getPaperLayer(key));
      }
      if (layerById[key].type === 'Artboard') {
        applyArtboardMethods(getPaperLayer(key).getItem({data: {id: 'ArtboardBackground'}}));
      }
    });
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
      className={`c-canvas`}
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
  const { layer } = state;
  return {
    activeArtboard: layer.present.activeArtboard,
    paperProject: layer.present.paperProject,
    layerById: layer.present.byId
  };
};

export default connect(
  mapStateToProps,
  { selectLayer, enableSelectionTool }
)(Canvas);