import React, { ReactElement } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase, SlowMo } from 'gsap/EasePack';
import { CustomBounce } from 'gsap/CustomBounce';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { closeEaseEditor } from '../store/actions/easeEditor';
import Icon from './Icon';
import IconButton from './IconButton';
import ToggleButtonGroup from './ToggleButtonGroup';

gsap.registerPlugin(CustomEase, RoughEase, SlowMo, CustomBounce);

interface EaseEditorMainHeadProps {
  tab: Btwx.EaseEditorTab;
  setTab(tab: Btwx.EaseEditorTab): void;
}

const EaseEditorMainHead = (props: EaseEditorMainHeadProps): ReactElement => {
  const { tab, setTab } = props;
  const isTextTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].prop === 'text' : null);
  const easeIcon = useSelector((state: RootState) => {
    const tween = state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween] : null;
    let ease;
    if (tween) {
      switch(tween.ease) {
        case 'customBounce':
          ease = `bounce({strength: ${tween.customBounce.strength}, endAtStart: ${tween.customBounce.endAtStart}, squash: ${tween.customBounce.squash}})`;
          break;
        case 'slow':
          ease = `slow(${tween.slow.linearRatio}, ${tween.slow.power}, ${tween.slow.yoyoMode})`;
          break;
        case 'rough':
          ease = tween.rough.ref; // `rough({clamp: ${tween.rough.clamp}, points: ${tween.rough.points}, randomize: ${tween.rough.randomize}, strength: ${tween.rough.strength}, taper: ${tween.rough.taper}, template: ${tween.rough.template}})`;
          break;
        case 'steps':
          ease = `steps(${tween.steps.steps})`;
          break;
        default:
          ease = `${tween.ease}.${tween.power}`;
          break;
      }
      return CustomEase.getSVGData(ease, {width: 24, height: 24});
    } else {
      return null;
    }
  });
  const handleChange = (e: any) => {
    setTab(e.target.value);
  }
  const dispatch = useDispatch();

  return (
    <div className='c-ease-editor-main__section c-ease-editor-main__section--head'>
      <div className='c-ease-editor__tabs'>
        {
          isTextTween
          ? <ToggleButtonGroup
              type='radio'
              name='ease-editor-tab'
              value={tab}
              size='large'
              onChange={handleChange}>
              <ToggleButtonGroup.Button value='ease'>
                <Icon
                  path={easeIcon}
                  size='small'
                  outline />
              </ToggleButtonGroup.Button>
              <ToggleButtonGroup.Button value='text'>
                <Icon name='ease-editor-text-tab' />
              </ToggleButtonGroup.Button>
            </ToggleButtonGroup>
          : null
        }
      </div>
      <IconButton
        iconName='close'
        onClick={() => dispatch(closeEaseEditor())}
        label='close' />
    </div>
  );
}

export default EaseEditorMainHead;