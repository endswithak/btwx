import paper from 'paper';
import { connect } from 'react-redux';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import { getPaperLayer } from '../store/selectors/layer';
import { RootState } from '../store/reducers';

interface PreviewCanvasProps {
  layer: any;
  paperProject: string;
  activeArtboard: string;
  page: string;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { paperProject, activeArtboard, page } = props;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paper.setup(canvasRef.current);
  }, []);

  useEffect(() => {
    paper.project.clear();
    paper.project.importJSON(paperProject);
    const pagePaperLayer = getPaperLayer(page);
    const activeArtboardPaperLayer = getPaperLayer(activeArtboard);
    //const activeArtboardJSON = activeArtboardPaperLayer.exportJSON();
    pagePaperLayer.removeChildren();
    pagePaperLayer.addChild(activeArtboardPaperLayer);
    pagePaperLayer.position = paper.view.center;
    //const pagePaperLayerJSON = pagePaperLayer.exportJSON();
    // paper.project.clear();
    // const rootLayer = new paper.Layer();
    // paper.project.addLayer(rootLayer);
    // test.parent = rootLayer;
    // test.position = paper.view.center;
    console.log(paper);
  }, [paperProject]);

  return (
    <div
      className={`c-canvas`}
      ref={canvasContainerRef}>
      <canvas
        id='canvas-main'
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