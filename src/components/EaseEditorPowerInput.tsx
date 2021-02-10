/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerTweenPower } from '../store/actions/layer';
import { DEFAULT_EASE_CURVES } from '../constants';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

gsap.registerPlugin(CustomEase);

const EaseEditorPowerInput = (): ReactElement => {
  const easeId = useSelector((state: RootState) => state.easeEditor.tween ? state.easeEditor.tween : null);
  const easeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease : null);
  const powerValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].power : null);
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    dispatch(setLayerTweenPower({id: easeId, power: e.target.value}));
  }

  const options = Object.keys((DEFAULT_EASE_CURVES as any)[easeValue]).map((key, index) => (
    <ToggleButtonGroup.Button
      key={key}
      value={key}
      square>
      <Icon
        path={CustomEase.getSVGData((DEFAULT_EASE_CURVES as any)[easeValue][key], {width: 24, height: 24})}
        size='large'
        outline />
    </ToggleButtonGroup.Button>
  ));

  return (
    <div className='c-ease-editor-body__powers'>
      <ToggleButtonGroup
        type='radio'
        name='ease-editor-power'
        size='large'
        block
        value={powerValue}
        onChange={handleChange}>
        { options }
      </ToggleButtonGroup>
    </div>
  );
}

export default EaseEditorPowerInput;