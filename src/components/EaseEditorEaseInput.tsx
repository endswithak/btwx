/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize';
import { RootState } from '../store/reducers';
import { setLayerTweenEase } from '../store/actions/layer';
import { DEFAULT_EASE_CURVES } from '../constants';
import EaseEditorSelector from './EaseEditorSelector';

gsap.registerPlugin(CustomEase);

const EaseEditorEaseInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const easeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease : null);
  const dispatch = useDispatch();

  const selectorOptions = Object.keys(DEFAULT_EASE_CURVES).map((key, index) => {
    return {
      value: key,
      label: key === 'customBounce'
      ? 'Custom Bounce'
        : capitalize(key),
      icon: `ease-${key}-out`,
      onClick: () => {
        dispatch(setLayerTweenEase({id: id, ease: key as any}));
      }
    }
  });

  const [ease, setEase] = useState(easeValue ? selectorOptions.find((option) => option.value === easeValue) : null);

  useEffect(() => {
    setEase(easeValue ? selectorOptions.find((option) => option.value === easeValue) : null);
  }, [easeValue]);

  return (
    <EaseEditorSelector
      items={selectorOptions}
      selectedItem={ease} />
  );
}

export default EaseEditorEaseInput;