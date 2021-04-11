/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
// import { setCanvasTranslating } from '../store/actions/canvasSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { getAllProjectIndices } from '../store/selectors/layer';

interface TranslateToolProps {
  translateEvent: WheelEvent;
}

const TranslateTool = (props: TranslateToolProps): ReactElement => {
  const { translateEvent } = props;
  // const isEnabled = useSelector((state: RootState) => state.canvasSettings.translating);
  const allProjectIndices = useSelector((state: RootState) => getAllProjectIndices(state));
  const dispatch = useDispatch();

  const debounceTranslate = useCallback(
    debounce(() => {
      // dispatch(setCanvasTranslating({translating: false}));
      dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
    }, 100),
    []
  );

  useEffect(() => {
    if (translateEvent) {
      allProjectIndices.forEach((current, index) => {
        const project = paperMain.projects[current];
        if (index === 0) {
          project.view.translate(
            new paperMain.Point(
              (translateEvent.deltaX * ( 1 / project.view.zoom)) * -1,
              (translateEvent.deltaY * ( 1 / project.view.zoom)) * -1
            )
          )
        } else {
          project.view.matrix = paperMain.projects[0].view.matrix;
        }
      });
      debounceTranslate();
    }
  }, [translateEvent]);

  return null;
}

export default TranslateTool;