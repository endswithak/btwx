import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize';
import { RootState } from '../store/reducers';
import { setLayerCustomWiggleTweenType } from '../store/actions/layer';
import { DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPES } from '../constants';
import SidebarSelect from './SidebarSelect';

const EaseEditorWiggleTypeInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const typeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].customWiggle.type : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'customWiggle' : true);
  const dispatch = useDispatch();

  const selectorOptions = DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPES.map((option) => {
    switch(option) {
      case 'easeInOut':
        return { value: option, label: 'In Out' };
      case 'easeOut':
        return { value: option, label: 'Out' };
      default:
        return { value: option, label: capitalize(option) }
    }
  });

  const [type, setType] = useState(typeValue ? selectorOptions.find((option) => option.value === typeValue) : null);

  useEffect(() => {
    setType(typeValue ? selectorOptions.find((option) => option.value === typeValue) : null);
  }, [typeValue]);

  const handleSelectorChange = (selectedOption: { value: Btwx.CustomWiggleTweenType; label: string }): void => {
    setType(selectedOption);
    dispatch(setLayerCustomWiggleTweenType({id: id, type: selectedOption.value}));
  }

  return (
    <SidebarSelect
      value={type}
      disabled={disabled}
      onChange={handleSelectorChange}
      options={selectorOptions}
      placeholder='multi'
      bottomLabel='Type' />
  );
}

export default EaseEditorWiggleTypeInput;