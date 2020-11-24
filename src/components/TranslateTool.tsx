/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasTranslating } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasTranslatingPayload } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { DocumentSettingsTypes, SetCanvasMatrixPayload } from '../store/actionTypes/documentSettings';

interface TranslateToolProps {
  translateEvent: WheelEvent;
  isEnabled?: boolean;
  setCanvasTranslating?(payload: SetCanvasTranslatingPayload): CanvasSettingsTypes;
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
}

const TranslateTool = (props: TranslateToolProps): ReactElement => {
  const { translateEvent, setCanvasTranslating, isEnabled, setCanvasMatrix } = props;

  const debounceTranslate = useCallback(
    debounce(() => {
      setCanvasTranslating({translating: false});
      setCanvasMatrix({matrix: paperMain.projects[0].view.matrix.values});
    }, 100),
    []
  );

  useEffect(() => {
    if (translateEvent) {
      // if (!isEnabled) {
      //   setCanvasTranslating({translating: true});
      // }
      paperMain.projects.forEach((project, index) => {
        // const scope = paperScopes[index];
        project.view.translate(
          new paperMain.Point(
            (translateEvent.deltaX * ( 1 / paperMain.projects[0].view.zoom)) * -1,
            (translateEvent.deltaY * ( 1 / paperMain.projects[0].view.zoom)) * -1
          )
        );
      });
      // paperMain.view.translate(
      //   new paperMain.Point(
      //     (translateEvent.deltaX * ( 1 / paperMain.view.zoom)) * -1,
      //     (translateEvent.deltaY * ( 1 / paperMain.view.zoom)) * -1
      //   )
      // );
      debounceTranslate();
    }
  }, [translateEvent]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
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
  { setCanvasTranslating, setCanvasMatrix }
)(TranslateTool);