import React, { ReactElement, useContext } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase, SlowMo } from 'gsap/EasePack';
import { CustomBounce } from 'gsap/CustomBounce';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { closeEaseEditor } from '../store/actions/easeEditor';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

gsap.registerPlugin(CustomEase, RoughEase, SlowMo, CustomBounce);

interface ButtonProps {
  isActive: boolean;
  lineIcon?: boolean;
}

const Button = styled.button<ButtonProps>`
  background: ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
  svg {
    stroke: ${props => props.lineIcon ? props.isActive ? props.theme.text.onPrimary : props.theme.text.lighter : 'none'};
    fill: ${props => !props.lineIcon ? props.isActive ? props.theme.text.onPrimary : props.theme.text.lighter : 'none'};
  }
  :hover {
    box-shadow: 0 0 0 1px${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
    svg {
      stroke: ${props => props.lineIcon ? props.isActive ? props.theme.text.onPrimary : props.theme.text.base : 'none'};
      fill: ${props => !props.lineIcon ? props.isActive ? props.theme.text.onPrimary : props.theme.text.base : 'none'};
    }
  }
`;

interface EaseEditorMainHeadProps {
  tab: 'ease' | 'text';
  setTab(tab: 'ease' | 'text'): void;
}

const EaseEditorMainHead = (props: EaseEditorMainHeadProps): ReactElement => {
  const theme = useContext(ThemeContext);
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
          ease = `rough({clamp: ${tween.rough.clamp}, points: ${tween.rough.points}, randomize: ${tween.rough.randomize}, strength: ${tween.rough.strength}, taper: ${tween.rough.taper}, template: ${tween.rough.template}})`;
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
  const dispatch = useDispatch();

  return (
    <div className='c-ease-editor-main__section c-ease-editor-main__section--head'>
      <div className='c-ease-editor__tabs'>
        {
          isTextTween
          ? <>
              <Button
                className='c-ease-editor__tab'
                isActive={tab === 'ease'}
                lineIcon={true}
                theme={theme}
                onClick={() => setTab('ease')}>
                <svg
                  viewBox='0 0 24 24'
                  width='24px'
                  height='24px'
                  style={{
                    strokeWidth: 1,
                    transform: `scale(0.75)`,
                    overflow: 'visible'
                  }}>
                  <path d={easeIcon} />
                </svg>
              </Button>
              <Button
                className='c-ease-editor__tab'
                isActive={tab === 'text'}
                lineIcon={false}
                theme={theme}
                onClick={() => setTab('text')}>
                <Icon
                  name='ease-editor-text-tab' />
              </Button>
            </>
          : null
        }
      </div>
      <Button
        className='c-ease-editor__tab c-ease-editor__tab--close'
        isActive={false}
        lineIcon={false}
        theme={theme}
        onClick={() => dispatch(closeEaseEditor())}>
        <Icon
          name='close' />
      </Button>
    </div>
  );
}

export default EaseEditorMainHead;