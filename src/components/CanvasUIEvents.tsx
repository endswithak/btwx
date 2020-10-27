// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { importPaperProject } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { LayerTypes } from '../store/actionTypes/layer';
import { updateInViewLayers } from '../store/actions/layer';
import Canvas from './Canvas';

interface CanvasUIEventsProps {
  uiEvent: {
    hitResult: paper.HitResult;
    empty: boolean;
    eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu';
    event: any;
  };
}

const CanvasUIEvents = (props: CanvasUIEventsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { uiEvent } = props;

  return (
    <></>
  );
}

export default CanvasUIEvents;

// const mapStateToProps = (state: RootState): {
//   documentImages: {
//     [id: string]: em.DocumentImage;
//   };
//   paperProject: string;
//   matrix: number[];
// } => {
//   const { layer, documentSettings } = state;
//   return {
//     documentImages: documentSettings.images.byId,
//     paperProject: layer.present.paperProject,
//     matrix: documentSettings.matrix
//   };
// };

// export default connect(
//   mapStateToProps,
//   { updateInViewLayers }
// )(CanvasUIEvents);