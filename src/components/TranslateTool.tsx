/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getDeepSelectItem, getNearestScopeAncestor, getSelectionBounds, getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasActiveTool, setCanvasTranslating } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasActiveToolPayload, SetCanvasTranslatingPayload } from '../store/actionTypes/canvasSettings';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers } from '../store/actions/layer';
import { LayerTypes, MoveLayersByPayload, DuplicateLayersPayload, RemoveDuplicatedLayersPayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface TranslateToolProps {
  translateEvent: WheelEvent;
  isEnabled?: boolean;
  setCanvasTranslating?(payload: SetCanvasTranslatingPayload): CanvasSettingsTypes;
}

const TranslateTool = (props: TranslateToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { translateEvent, setCanvasTranslating, isEnabled } = props;

  const debounceTranslate = useCallback(
    debounce(() => {
      setCanvasTranslating({translating: false});
    }, 100),
    []
  );

  useEffect(() => {
    if (translateEvent) {
      if (!isEnabled) {
        setCanvasTranslating({translating: true});
      }
      paperMain.view.translate(
        new paperMain.Point(
          (translateEvent.deltaX * ( 1 / paperMain.view.zoom)) * -1,
          (translateEvent.deltaY * ( 1 / paperMain.view.zoom)) * -1
        )
      );
      debounceTranslate();
    }
  }, [translateEvent]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: TranslateToolProps): {
  isEnabled: boolean;
} => {
  const { canvasSettings } = state;
  const isEnabled = canvasSettings.translating;
  return {
    isEnabled
  };
};

export default connect(
  mapStateToProps,
  { setCanvasTranslating }
)(TranslateTool);