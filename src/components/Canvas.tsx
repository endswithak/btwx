import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { selectLayer } from '../store/actions/layer';
import { enableSelectionTool } from '../store/actions/tool';
import { ThemeContext } from './ThemeProvider';
import { SelectLayerPayload, LayerTypes } from '../store/actionTypes/layer';
import { RootState } from '../store/reducers';
import { updateActiveArtboardFrame } from '../store/utils/layer';
import { paperMain } from '../canvas';

interface CanvasProps {
  selectLayer(payload: SelectLayerPayload): LayerTypes;
  enableSelectionTool(): any;
  activeArtboard?: string;
  paperProject?: string;
}

const Canvas = ({selectLayer, enableSelectionTool, activeArtboard, paperProject}: CanvasProps): ReactElement => {
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
      } else {
        paperMain.view.translate(new paper.Point(e.deltaX * -1, e.deltaY * -1));
      }
    });
  }, []);

  const handleClick = (e) => {
    (document.activeElement as HTMLElement).blur();
    // canvasRef.current.tabIndex = 0;
    // canvasRef.current.focus();
    // paper.projects[0].activate();
    // //enableSelectionTool();
    // console.log(paper);
  }

  useEffect(() => {
    if (paperMain.project.getItem({data: { id: activeArtboard }})) {
      if (paperMain.project.getItem({data: { id: 'activeArtboardFrame' }}) && paperMain.project.getItem({data: { id: 'activeArtboardFrame' }}).data.artboard !== activeArtboard) {
        selectLayer({id: activeArtboard, newSelection: true});
      }
    }
  }, [activeArtboard]);

  return (
    <div
      className={`c-canvas`}
      ref={canvasContainerRef}>
      <canvas
        id='canvas-main'
        ref={canvasRef}
        onClick={handleClick}
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
    paperProject: layer.present.paperProject
  };
};

export default connect(
  mapStateToProps,
  { selectLayer, enableSelectionTool }
)(Canvas);