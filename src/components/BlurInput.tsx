/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersBlur } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices, getSelectedBlurValue, getSelectedBlurEnabled, getSelectedById } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import MathFormGroup from './MathFormGroup';
import Form from './Form';

const BlurInput = (): ReactElement => {
  const minBlur = 0;
  const maxBlur = 50;
  const formControlRef = useRef(null);
  const formControlSliderRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const blurValue = useSelector((state: RootState) => getSelectedBlurValue(state));
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const enabledValue = useSelector((state: RootState) => getSelectedBlurEnabled(state));
  const [enabled, setEnabled] = useState<boolean | 'multi'>(enabledValue);
  const [blur, setBlur] = useState(blurValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setBlur(blurValue);
    setEnabled(enabledValue);
  }, [blurValue, selected, enabledValue]);

  const handleSliderChange = (e: any): void => {
    setBlur(e.target.value);
    Object.keys(selectedById).forEach((key) => {
      const layerItem = selectedById[key];
      const paperLayer = getPaperLayer(layerItem.id, selectedProjectIndices[layerItem.id]) as paper.CompoundPath;
      paperLayer.style.blur = e.target.value;
    });
  };

  const handleSliderSubmit = (e: any): void => {
    if (e.target.value !== blurValue) {
      dispatch(setLayersBlur({layers: selected, blur: e.target.value}));
    }
  }

  const handleControlSubmitSuccess = (nextBlur: any): void => {
    dispatch(setLayersBlur({layers: selected, blur: nextBlur}));
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'66.66%'}>
        <Form inline>
          <Form.Group controlId='control-blur-slider'>
            <Form.Control
              ref={formControlSliderRef}
              as='input'
              value={blur !== 'multi' ? blur : 0}
              type='range'
              step={1}
              min={minBlur}
              max={maxBlur}
              size='small'
              onChange={handleSliderChange}
              onMouseUp={handleSliderSubmit}
              disabled={!enabled || enabled === 'multi'}
              // onFocus={handleSliderFocus}
              required />
          </Form.Group>
        </Form>
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <MathFormGroup
          ref={formControlRef}
          controlId='control-blur'
          value={blur}
          min={minBlur}
          max={maxBlur}
          size='small'
          label='Blur'
          disabled={!enabled || enabled === 'multi'}
          onSubmitSuccess={handleControlSubmitSuccess}
          submitOnBlur
          canvasAutoFocus />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default BlurInput;