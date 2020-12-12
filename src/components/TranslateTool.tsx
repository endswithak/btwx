/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { setCanvasTranslating } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasTranslatingPayload } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { DocumentSettingsTypes, SetCanvasMatrixPayload } from '../store/actionTypes/documentSettings';
import { getAllProjectIndices } from '../store/selectors/layer';

interface TranslateToolProps {
  translateEvent: WheelEvent;
  isEnabled?: boolean;
  allProjectIndices?: number[];
  setCanvasTranslating?(payload: SetCanvasTranslatingPayload): CanvasSettingsTypes;
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
}

const TranslateTool = (props: TranslateToolProps): ReactElement => {
  const { translateEvent, setCanvasTranslating, isEnabled, setCanvasMatrix, allProjectIndices } = props;

  const debounceTranslate = useCallback(
    debounce(() => {
      setCanvasTranslating({translating: false});
      setCanvasMatrix({matrix: uiPaperScope.view.matrix.values});
    }, 100),
    []
  );

  useEffect(() => {
    if (translateEvent) {
      allProjectIndices.forEach((current, index) => {
        const project = uiPaperScope.projects[current];
        project.view.translate(
          new uiPaperScope.Point(
            (translateEvent.deltaX * ( 1 / project.view.zoom)) * -1,
            (translateEvent.deltaY * ( 1 / project.view.zoom)) * -1
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
  allProjectIndices: number[];
} => {
  const { canvasSettings } = state;
  const isEnabled = canvasSettings.translating;
  return {
    isEnabled,
    allProjectIndices: getAllProjectIndices(state)
  };
};

export default connect(
  mapStateToProps,
  { setCanvasTranslating, setCanvasMatrix }
)(TranslateTool);