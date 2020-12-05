/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope, pagePaperScope } from '../canvas';
import { getAllPaperScopes } from '../store/selectors/layer';
import { setCanvasTranslating } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasTranslatingPayload } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { DocumentSettingsTypes, SetCanvasMatrixPayload } from '../store/actionTypes/documentSettings';

interface TranslateToolProps {
  translateEvent: WheelEvent;
  isEnabled?: boolean;
  artboards?: string[];
  setCanvasTranslating?(payload: SetCanvasTranslatingPayload): CanvasSettingsTypes;
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
}

const TranslateTool = (props: TranslateToolProps): ReactElement => {
  const { translateEvent, setCanvasTranslating, isEnabled, setCanvasMatrix, artboards } = props;

  const debounceTranslate = useCallback(
    debounce(() => {
      setCanvasTranslating({translating: false});
      setCanvasMatrix({matrix: uiPaperScope.view.matrix.values});
    }, 100),
    []
  );

  useEffect(() => {
    if (translateEvent) {
      artboards.forEach((key, index) => {
        uiPaperScope.projects[index].view.translate(
          new uiPaperScope.Point(
            (translateEvent.deltaX * ( 1 / uiPaperScope.view.zoom)) * -1,
            (translateEvent.deltaY * ( 1 / uiPaperScope.view.zoom)) * -1
          )
        )
      });
      debounceTranslate();
    }
  }, [translateEvent]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
  artboards: string[];
} => {
  const { canvasSettings, layer } = state;
  const isEnabled = canvasSettings.translating;
  return {
    isEnabled,
    artboards: ['ui', ...layer.present.childrenById.root]
    // paperScopes: getAllPaperScopes(state)
  };
};

export default connect(
  mapStateToProps,
  { setCanvasTranslating, setCanvasMatrix }
)(TranslateTool);