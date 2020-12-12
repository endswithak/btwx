/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { getArtboardsByPaperScope, importPaperProject } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import { Layer } from 'paper';

interface CanvasArtboardProps {
  // artboards?: string[];
  matrix?: number[];
  paperJSON?: string;
  paperScopeIndex?: number;
}

const CanvasArtboard = (props: CanvasArtboardProps): ReactElement => {
  const { matrix, paperJSON, paperScopeIndex } = props;

  useEffect(() => {
    const canvasWrap = document.getElementById('canvas-container');
    const paperScope = uiPaperScope.projects[paperScopeIndex];
    paperScope.importJSON(paperJSON);
    paperScope.view.viewSize = new uiPaperScope.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
    paperScope.view.matrix.set(matrix);
    return () => {
      paperScope.clear();
    }
  }, [paperScopeIndex]);

  return (
    <></>
  );
}

export default CanvasArtboard;

// const mapStateToProps = (state: RootState, ownProps: CanvasArtboardProps): {
//   documentImages: {
//     [id: string]: Btwx.DocumentImage;
//   };
//   matrix: number[];
//   paperJSON: string;
//   // artboards: string[];
// } => {
//   const { layer, documentSettings } = state;
//   // const artboardsByPaperScope = getArtboardsByPaperScope(state);
//   // const artboards = artboardsByPaperScope[ownProps.id];
//   const paperJSON = layer.present.paperJSON[ownProps.id - 1];
//   // const paperJSON = artboards.reduce((result, current) => {
//   //   const artboardItem = layer.present.byId[current] as Btwx.Artboard;
//   //   return [...result, artboardItem.paperJSON];
//   // }, []);
//   return {
//     documentImages: documentSettings.images.byId,
//     matrix: documentSettings.matrix,
//     paperJSON: paperJSON,
//     // artboards: artboards
//   };
// };

// export default connect(
//   mapStateToProps
// )(CanvasArtboard);