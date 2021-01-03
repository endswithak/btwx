/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize'
import { RootState } from '../store/reducers';
import { setLayerRoughTweenTaper } from '../store/actions/layer';
import { DEFAULT_ROUGH_TWEEN_TAPER_TYPES } from '../constants';
import SidebarSelect from './SidebarSelect';

const EaseEditorRoughTaperInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const taperValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.taper : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const dispatch = useDispatch();

  const taperOptions = DEFAULT_ROUGH_TWEEN_TAPER_TYPES.map((option) => ({
    value: option,
    label: capitalize(option)
  }));

  const [taper, setTaper] = useState(taperValue ? taperOptions.find((option) => option.value === taperValue) : null);

  useEffect(() => {
    setTaper(taperValue ? taperOptions.find((option) => option.value === taperValue) : null);
  }, [taperValue]);

  const handleSelectorChange = (selectedOption: { value: Btwx.RoughTweenTaper; label: string }): void => {
    setTaper(selectedOption);
    dispatch(setLayerRoughTweenTaper({id: id, taper: selectedOption.value}));
  }

  return (
    <SidebarSelect
      value={taper}
      onChange={handleSelectorChange}
      disabled={disabled}
      options={taperOptions}
      placeholder='multi'
      bottomLabel='Taper' />
  );
}

export default EaseEditorRoughTaperInput;