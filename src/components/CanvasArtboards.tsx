/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import CanvasArtboard from './CanvasArtboard';

interface CanvasArtboardsProps {
  artboards?: string[];
}

const CanvasArtboards = (props: CanvasArtboardsProps): ReactElement => {
  const { artboards } = props;

  useEffect(() => {
    [...Array(33).keys()].forEach((scope, index) => {
      new uiPaperScope.Project(document.getElementById(`canvas-artboard-${index}`) as HTMLCanvasElement);
    });
    uiPaperScope.projects[0].activate();
  }, []);

  return (
    <>
      {
        [...Array(33).keys()].map((key, index) => (
          <canvas
            key={index}
            id={`canvas-artboard-${index}`}
            className='c-canvas__layer c-canvas__layer--artboard' />
        ))
      }
      {
        artboards.map((id, index) => (
          <CanvasArtboard
            key={index}
            id={id} />
        ))
      }
    </>
  );
}

const mapStateToProps = (state: RootState): {
  artboards: string[];
} => {
  const { layer } = state;
  return {
    artboards: layer.present.childrenById.root
  };
};

export default connect(
  mapStateToProps
)(CanvasArtboards);