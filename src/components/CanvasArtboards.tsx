/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import CanvasArtboard from './CanvasArtboard';

interface CanvasArtboardsProps {
  artboards?: string[];
}

const CanvasArtboards = (props: CanvasArtboardsProps): ReactElement => {
  const { artboards } = props;
  return (
    <>
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
    artboards: layer.present.allArtboardIds
  };
};

export default connect(
  mapStateToProps
)(CanvasArtboards);