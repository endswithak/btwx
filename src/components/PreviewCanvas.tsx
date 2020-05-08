import paper from 'paper';
import { connect } from 'react-redux';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';

interface PreviewCanvasProps {
  layer?: any;
  paperProject?: string;
  activeArtboard?: string;
  page?: string;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { paperProject, activeArtboard, page } = props;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paperPreview.setup(canvasRef.current);
    paperPreview.activate();
  }, []);

  useEffect(() => {
    paperPreview.project.clear();
    paperPreview.project.importJSON(paperProject);
    const activeArtboardPaperLayer = paperPreview.project.getItem({ data: { id: activeArtboard } });
    paperPreview.project.clear();
    const rootLayer = new paper.Layer();
    paperPreview.project.addLayer(rootLayer);
    activeArtboardPaperLayer.parent = rootLayer;
    activeArtboardPaperLayer.position = paperPreview.view.center;
  }, [paperProject]);

  return (
    <div
      className={`c-canvas`}
      ref={canvasContainerRef}>
      <canvas
        id='canvas-preview'
        ref={canvasRef}
        onClick={() => (document.activeElement as HTMLElement).blur()}
        style={{
          background: theme.background.z0
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  return {
    paperProject: layer.present.paperProject,
    activeArtboard: layer.present.activeArtboard,
    page: layer.present.page
  };
};

export default connect(
  mapStateToProps
)(PreviewCanvas);