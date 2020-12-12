/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { getLayerPaperScopes } from '../store/selectors/layer';
import CanvasArtboard from './CanvasArtboard';

interface CanvasArtboardsProps {
  ready?: boolean;
  layerPaperJSON?: string[];
  matrix?: number[];
}

const CanvasArtboards = (props: CanvasArtboardsProps): ReactElement => {
  const { ready, layerPaperJSON, matrix } = props;
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    [...Array(11).keys()].forEach((scope, index) => {
      new uiPaperScope.Project(document.getElementById(`canvas-artboard-${index}`) as HTMLCanvasElement);
      new uiPaperScope.Layer();
    });
    uiPaperScope.projects[0].activate();
  }, []);

  // useEffect(() => {
  //   const canvasWrap = document.getElementById('canvas-container');
  //   [...Array(11).keys()].forEach((scope, index) => {
  //     if (index !== 0) {
  //       const paperScope = uiPaperScope.projects[index];
  //       paperScope.clear();
  //       if (layerPaperJSON.length > 0 && layerPaperJSON[index - 1]) {
  //         paperScope.importJSON(layerPaperJSON[index - 1]);
  //         paperScope.view.viewSize = new uiPaperScope.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
  //         paperScope.view.matrix.set(matrix);
  //       }
  //     }
  //   });
  // }, [layerPaperJSON]);

  return (
    <>
      {
        [...Array(11).keys()].map((key, index) => (
          <canvas
            key={index}
            id={`canvas-artboard-${index}`}
            className='c-canvas__layer c-canvas__layer--artboard' />
        ))
      }
      <>
        {
          layerPaperJSON.map((paperJSON, index) => (
            <CanvasArtboard
              key={index}
              paperJSON={paperJSON}
              paperScopeIndex={index + 1} />
          ))
        }
      </>
    </>
  );
}

const mapStateToProps = (state: RootState): {
  layerPaperJSON: string[];
  matrix: number[];
} => {
  const { layer, documentSettings } = state;
  return {
    layerPaperJSON: layer.present.paperJSON,
    matrix: documentSettings.matrix
  };
};

export default connect(
  mapStateToProps
)(CanvasArtboards);