/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize'
import { RootState } from '../store/reducers';
import { setLayerRoughTweenTaper } from '../store/actions/layer';
import { DEFAULT_ROUGH_TWEEN_TAPER_TYPES } from '../constants';
import SidebarSelect from './SidebarSelect';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughTaperInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughTaperInput = (props: EaseEditorRoughTaperInputProps): ReactElement => {
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const taperValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.taper : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const roughTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough : null);
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
    const ref = CustomEase.getSVGData(`rough({clamp: ${roughTween.clamp}, points: ${roughTween.points}, randomize: ${roughTween.randomize}, strength: ${roughTween.strength}, taper: ${selectedOption.value}, template: ${roughTween.template}})`, {width: 400, height: 400});
    dispatch(setLayerRoughTweenTaper({id: id, taper: selectedOption.value, ref: ref}));
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'String',
      description: 'To make the strength of the roughness taper towards the end or beginning or both, use "out", "in", or "both" respectively.'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
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