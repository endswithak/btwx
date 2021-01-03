/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize';
import { RootState } from '../store/reducers';
import { setLayerTweenEase } from '../store/actions/layer';
import { DEFAULT_TWEEN_EASE_OPTIONS } from '../constants';
import SidebarSelect from './SidebarSelect';

const EaseEditorEaseInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const easeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease : null);
  const dispatch = useDispatch();

  const selectorOptions = DEFAULT_TWEEN_EASE_OPTIONS.map((option) => ({
    value: option,
    label: option === 'customBounce'
    ? 'Custom Bounce'
    : option === 'customWiggle'
      ?  'Custom Wiggle'
      : capitalize(option)
  }));

  const [ease, setEase] = useState(easeValue ? selectorOptions.find((option) => option.value === easeValue) : null);

  useEffect(() => {
    setEase(easeValue ? selectorOptions.find((option) => option.value === easeValue) : null);
  }, [easeValue]);

  const handleSelectorChange = (selectedOption: { value: Btwx.CubicBezier; label: string }): void => {
    setEase(selectedOption);
    dispatch(setLayerTweenEase({id: id, ease: selectedOption.value}));
  }

  return (
    <SidebarSelect
      value={ease}
      onChange={handleSelectorChange}
      options={selectorOptions}
      placeholder='multi'
      bottomLabel='Ease' />
  );
}

export default EaseEditorEaseInput;