/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect } from 'react';
import gsap from 'gsap';
import capitalize from 'lodash.capitalize';
import { clearTouchbar } from '../utils';
import { CustomEase } from 'gsap/CustomEase';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersTweenPower } from '../store/actions/layer';
import { getSelectedTweensEase, getSelectedTweensPower } from '../store/selectors/layer';
import { DEFAULT_EASE_CURVES } from '../constants';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

gsap.registerPlugin(CustomEase);

const EaseEditorPowerInput = (): ReactElement => {
  // const isMac = remote.process.platform === 'darwin';
  // const easeId = useSelector((state: RootState) => state.easeEditor.tween ? state.easeEditor.tween : null);
  // const easeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease : null);
  // const powerValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].power : null);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const easeValue = useSelector((state: RootState) => getSelectedTweensEase(state));
  const powerValue = useSelector((state: RootState) => getSelectedTweensPower(state));
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    dispatch(setLayersTweenPower({
      tweens: selectedTweens,
      power: e.target.value
    }));
  }

  // const buildTouchbar = (): void => {
  //   const { TouchBar } = remote;
  //   const { TouchBarLabel, TouchBarSegmentedControl } = TouchBar;
  //   const leftLabel = new TouchBarLabel({
  //     label: `${capitalize(easeValue)}: `
  //   });
  //   const control = new TouchBarSegmentedControl({
  //     segments: ['out', 'inOut', 'in'].map((key, index) => {
  //       const image = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-ease-${easeValue}-${key}.png`);
  //       return {
  //         label: key,
  //         icon: image
  //       }
  //     }),
  //     selectedIndex: ['out', 'inOut', 'in'].indexOf(powerValue),
  //     change: (index) => {
  //       dispatch(setLayerTweenPower({id: easeId, power: ['out', 'inOut', 'in'][index] as Btwx.CubicBezierType}));
  //     }
  //   });
  //   const touchbar = new TouchBar({
  //     items: [leftLabel, control]
  //   });
  //   remote.getCurrentWindow().setTouchBar(touchbar);
  // }

  const options = ['out', 'inOut', 'in'].map((key, index) => (
    <ToggleButtonGroup.Button
      key={key}
      value={key}
      aspectRatio='1x1'>
      <Icon
        name={`ease-${easeValue}-${key}`}
        size='large' />
    </ToggleButtonGroup.Button>
  ));

  // useEffect(() => {
  //   if (isMac) {
  //     buildTouchbar();
  //   }
  // }, [powerValue, easeValue]);

  // useEffect(() => {
  //   return () => {
  //     if (isMac) {
  //       clearTouchbar();
  //     }
  //   }
  // }, []);

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