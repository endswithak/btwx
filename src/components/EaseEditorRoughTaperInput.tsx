/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize'
import { RootState } from '../store/reducers';
import { setLayerRoughTweenTaper } from '../store/actions/layer';
import { DEFAULT_ROUGH_TWEEN_TAPER_TYPES } from '../constants';
import SidebarSelect from './SidebarSelect';

interface EaseEditorRoughTaperInputProps {
  setInputInfo(inputInfo: { type: string; description: string }): void;
}

const EaseEditorRoughTaperInput = (props: EaseEditorRoughTaperInputProps): ReactElement => {
  const { setInputInfo } = props;
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

  const handleFocus = () => {
    setInputInfo({
      type: 'String',
      description: 'To make the strength of the roughness taper towards the end or beginning or both, use "out", "in", or "both" respectively.'
    });
  }

  const handleBlur = () => {
    setInputInfo(null);
  }

  return (
    <SidebarSelect
      value={taper}
      onChange={handleSelectorChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      options={taperOptions}
      placeholder='multi'
      bottomLabel='Taper' />
  );
}

export default EaseEditorRoughTaperInput;