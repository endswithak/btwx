/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize'
import { RootState } from '../store/reducers';
import { setLayerTweenPower } from '../store/actions/layer';
import { DEFAULT_TWEEN_POWER_OPTIONS } from '../constants';
import SidebarSelect from './SidebarSelect';

const EaseEditorPowerInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const powerValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].power : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease === 'customBounce' || state.layer.present.tweens.byId[state.easeEditor.tween].ease === 'customWiggle' : true);
  const dispatch = useDispatch();

  const powerOptions = DEFAULT_TWEEN_POWER_OPTIONS.map((option) => ({
    value: option,
    label: option === 'inOut'
    ? 'In Out'
    : capitalize(option)
  }));

  const [power, setPower] = useState(powerValue ? powerOptions.find((option) => option.value === powerValue) : null);

  useEffect(() => {
    setPower(powerValue ? powerOptions.find((option) => option.value === powerValue) : null);
  }, [powerValue]);

  const handleSelectorChange = (selectedOption: { value: Btwx.CubicBezierType; label: string }): void => {
    setPower(selectedOption);
    dispatch(setLayerTweenPower({id: id, power: selectedOption.value}));
  }

  return (
    <SidebarSelect
      value={power}
      onChange={handleSelectorChange}
      disabled={disabled}
      options={powerOptions}
      placeholder='multi'
      bottomLabel='Power' />
  );
}

export default EaseEditorPowerInput;