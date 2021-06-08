/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize';
import { RootState } from '../store/reducers';
import { setLayersTweenEase } from '../store/actions/layer';
import { getSelectedTweensEase } from '../store/selectors/layer';
import { DEFAULT_EASE_CURVES } from '../constants';
import EaseEditorSelector from './EaseEditorSelector';

gsap.registerPlugin(CustomEase);

const EaseEditorEaseInput = (): ReactElement => {
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const easeValue = useSelector((state: RootState) => getSelectedTweensEase(state));
  const dispatch = useDispatch();

  const selectorOptions = easeValue !== 'customWiggle' ? [
    ...(easeValue === 'multi' ? [{ value: 'multi', label: 'multi', icon: 'ease-power1-out', onClick: () => { return; } }] : []),
    ...Object.keys(DEFAULT_EASE_CURVES).map((key, index) => {
      return {
        value: key,
        label: key === 'customBounce'
        ? 'Custom Bounce'
          : capitalize(key),
        icon: `ease-${key}-out`,
        onClick: () => {
          dispatch(setLayersTweenEase({
            tweens: selectedTweens,
            ease: key as any
          }));
        }
      }
    })
  ] : [{
    value: 'customWiggle',
    label: 'Custom Wiggle',
    icon: 'ease-customWiggle-out',
    onClick: () => {
      return;
    }
  }];

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