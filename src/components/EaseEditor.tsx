import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import mexp from 'math-expression-evaluator';
import { connect } from 'react-redux';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import MotionPathHelper from 'gsap/MotionPathHelper';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeEaseEditor } from '../store/actions/easeEditor';
import { EaseEditorTypes } from '../store/actionTypes/easeEditor';
import { setLayerTweenEase, setLayerTweenPower, setLayerTweenDuration, setLayerTweenDelay } from '../store/actions/layer';
import { SetLayerTweenEasePayload, SetLayerTweenPowerPayload, SetLayerTweenDurationPayload, SetLayerTweenDelayPayload, LayerTypes } from '../store/actionTypes/layer';
import { setTweenDrawerTweenEditing } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenEditingPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasFocusingPayload } from '../store/actionTypes/canvasSettings';
import SidebarInput from './SidebarInput';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionRow from './SidebarSectionRow';

gsap.registerPlugin(CustomEase, MotionPathPlugin, MotionPathHelper, DrawSVGPlugin);

interface EaseEditorProps {
  tween?: em.Tween;
  easeEditor?: {
    isOpen: boolean;
    tween: string;
  };
  canvasFocusing?: boolean;
  closeEaseEditor?(): EaseEditorTypes;
  setLayerTweenEase?(payload: SetLayerTweenEasePayload): LayerTypes;
  setLayerTweenPower?(payload: SetLayerTweenPowerPayload): LayerTypes;
  setLayerTweenDuration?(payload: SetLayerTweenDurationPayload): LayerTypes;
  setLayerTweenDelay?(payload: SetLayerTweenDelayPayload): LayerTypes;
  setTweenDrawerTweenEditing?(payload: SetTweenDrawerTweenEditingPayload): TweenDrawerTypes;
  setCanvasFocusing?(payload: SetCanvasFocusingPayload): CanvasSettingsTypes;
}

const EaseEditor = (props: EaseEditorProps): ReactElement => {
  const editorRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathRevealRef = useRef<SVGPathElement>(null);
  const valueBarRef = useRef<HTMLDivElement>(null);
  const valueHeadRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { tween, easeEditor, closeEaseEditor, setLayerTweenEase, setLayerTweenPower, canvasFocusing, setCanvasFocusing, setLayerTweenDuration, setLayerTweenDelay, setTweenDrawerTweenEditing } = props;
  const [duration, setDuration] = useState(tween.duration);
  const [delay, setDelay] = useState(tween.delay);

  const easeTypes = ['linear', 'power1', 'power2', 'power3', 'power4', 'back', 'bounce', 'circ', 'expo', 'sine'];
  const easePowerTypes = ['in', 'inOut', 'out'];

  const handleTypePresetClick = (preset: em.CubicBezier) => {
    setLayerTweenEase({id: tween.id, ease: preset});
  }

  const handlePowerPresetClick = (preset: em.CubicBezierType) => {
    setLayerTweenPower({id: tween.id, power: preset});
  }

  const setAndAnimate = () => {
    gsap.killTweensOf([pathRevealRef.current, valueBarRef.current, valueHeadRef.current]);
    gsap.set(pathRevealRef.current, {clearProps: 'all'});
    gsap.set(valueBarRef.current, {clearProps: 'scale'});
    gsap.set(valueHeadRef.current, {clearProps: 'y'});
    CustomEase.getSVGData(`${tween.ease}.${tween.power}`, {width: 400, height: 400, path: pathRef.current});
    CustomEase.getSVGData(`${tween.ease}.${tween.power}`, {width: 400, height: 400, path: pathRevealRef.current});
    gsap.from(valueBarRef.current, {scaleY: 0, duration: tween.duration, ease: `${tween.ease}.${tween.power}` });
    gsap.to(valueHeadRef.current, {y: `-=400`, duration: tween.duration, ease: `${tween.ease}.${tween.power}` });
    gsap.from(pathRevealRef.current, {
      duration: tween.duration,
      drawSVG: 0,
      ease: `${tween.ease}.${tween.power}`
    });
  }

  const onMouseDown = (event: any): void => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      setTweenDrawerTweenEditing({id: null});
      closeEaseEditor();
    }
  }

  const handleDurationChange = (e: any) => {
    const target = e.target;
    setDuration(target.value);
  };

  const handleDurationSubmit = (e: any) => {
    try {
      const durationRounded = Math.round((mexp.eval(`${duration}`) as any + Number.EPSILON) * 100) / 100
      if (durationRounded !== tween.duration) {
        let newDuration = durationRounded;
        if (durationRounded + tween.delay > 10) {
          const diff = (durationRounded + tween.delay) - 10;
          newDuration = durationRounded - diff;
        }
        if (durationRounded < 0.04) {
          newDuration = 0.04;
        }
        setLayerTweenDuration({id: tween.id, duration: newDuration});
        setDuration(newDuration);
      } else {
        setDuration(tween.duration);
        setAndAnimate();
      }
    } catch(error) {
      setDuration(tween.duration);
      setAndAnimate();
    }
  }

  const handleDelayChange = (e: any) => {
    const target = e.target;
    setDelay(target.value);
  };

  const handleDelaySubmit = (e: any) => {
    try {
      const delayRounded = Math.round((mexp.eval(`${delay}`) as any + Number.EPSILON) * 100) / 100
      if (delayRounded !== tween.delay) {
        let newDelay = delayRounded;
        if (delayRounded + tween.duration > 10) {
          const diff = (delayRounded + tween.duration) - 10;
          newDelay = delayRounded - diff;
        }
        if (delayRounded < 0) {
          newDelay = 0;
        }
        setLayerTweenDelay({id: tween.id, delay: newDelay});
        setDelay(newDelay);
      } else {
        setDelay(tween.delay);
        setAndAnimate();
      }
    } catch(error) {
      setDelay(tween.delay);
      setAndAnimate();
    }
  }

  useEffect(() => {
    if (canvasFocusing) {
      setCanvasFocusing({focusing: false});
    }
    document.addEventListener('mousedown', onMouseDown, false);
    setTweenDrawerTweenEditing({id: tween.id});
    return (): void => {
      if (easeEditor.isOpen) {
        closeEaseEditor();
      }
      setCanvasFocusing({focusing: true});
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  useEffect(() => {
    if (tween) {
      setDuration(tween.duration);
      setDelay(tween.delay);
      setAndAnimate();
    }
  }, [tween]);

  return (
    <div className='c-ease-editor'>
      <div
        className='c-ease-editor__content'
        ref={editorRef}
        style={{
          background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString(),
          width: 700,
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16)`,
          borderRadius: theme.unit,
          backdropFilter: 'blur(17px)'
        }}>
        <div className='c-ease-editor__presets'>
          <div className='c-ease-editor__preset-group'>
            <div
              className='c-ease-editor__preset c-ease-editor__preset--label'
              style={{
                color: theme.text.lighter
              }}>
              Ease Curve
            </div>
            {
              easeTypes.map((preset: em.CubicBezier, index) => (
                <button
                  className='c-ease-editor__preset'
                  onClick={() => handleTypePresetClick(preset)}
                  key={index}
                  style={{
                    background: tween && preset === tween.ease
                    ? theme.palette.primary
                    : 'none',
                    color: tween && preset === tween.ease
                    ? theme.text.onPrimary
                    : theme.text.base
                  }}>
                  { preset }
                </button>
              ))
            }
          </div>
          <div className='c-ease-editor__preset-group'>
            {/* <div
              className='c-ease-editor__preset c-ease-editor__preset--label'
              style={{
                color: theme.text.lighter
              }}>
              Type
            </div> */}
            {
              easePowerTypes.map((preset: em.CubicBezierType, index) => (
                <button
                  className='c-ease-editor__preset'
                  onClick={() => handlePowerPresetClick(preset)}
                  key={index}
                  style={{
                    background: tween && preset === tween.power
                    ? theme.palette.primary
                    : 'none',
                    color: tween && preset === tween.power
                    ? theme.text.onPrimary
                    : theme.text.base
                  }}>
                  { preset }
                </button>
              ))
            }
          </div>
          <div className='c-ease-editor__preset-group'>
            <div
              className='c-ease-editor__preset c-ease-editor__preset--label'
              style={{
                color: theme.text.lighter
              }}>
              Timing
            </div>
            <SidebarSectionRow>
              <SidebarSectionColumn width='50%'>
                <SidebarInput
                  value={duration}
                  onChange={handleDurationChange}
                  onSubmit={handleDurationSubmit}
                  submitOnBlur
                  bottomLabel='Duration' />
              </SidebarSectionColumn>
              <SidebarSectionColumn width='50%'>
                <SidebarInput
                  value={delay}
                  onChange={handleDelayChange}
                  onSubmit={handleDelaySubmit}
                  submitOnBlur
                  bottomLabel='Delay' />
              </SidebarSectionColumn>
            </SidebarSectionRow>
          </div>
        </div>
        <div
          ref={visualizerRef}
          className='c-ease-editor__visualizer'
          style={{
            background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
            boxShadow: `-1px 0 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
          }}>
          <div className='c-ease-editor-visualizer__top'>
            <div
              className='c-ease-editor__graph'
              style={{
                position: 'relative',
                //background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
                width: 400,
                height: 536
              }}>
              <svg
                viewBox='0 0 400 400'
                preserveAspectRatio='xMidYMid meet'
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  overflow: 'visible',
                  maxHeight: 400,
                  bottom: 72
                }}>
                <line x1="0" y1="0" x2="400" y2="0" stroke={theme.text.lightest} opacity='0.5'></line>
                <path ref={pathRef} strokeWidth='1' stroke={theme.text.lightest} opacity='0.5' fill='none'></path>
                <path ref={pathRevealRef} strokeWidth='1' stroke={theme.text.base} fill='none'></path>
                <line x1="0" y1="400" x2="400" y2="400" stroke={theme.text.lightest} opacity='0.5'></line>
              </svg>
            </div>
            <div
              className='c-ease-editor__value'
              style={{
                height: 536
              }}>
              <div
                className='c-ease-editor-value__bar'
                style={{
                  background: theme.text.lightest,
                  opacity: 0.5,
                  height: 536
                }} />
              <div
                ref={valueBarRef}
                className='c-ease-editor-value__progress'
                style={{
                  background: theme.palette.primary,
                  height: 400,
                  bottom: 72
                }} />
              <div
                ref={valueHeadRef}
                className='c-ease-editor-value__progress-head'
                style={{
                  background: theme.palette.primary,
                  bottom: 72
                }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, easeEditor, canvasSettings } = state;
  const tween = layer.present.tweenById[easeEditor.tween];
  const canvasFocusing = canvasSettings.focusing;
  return { tween, easeEditor, canvasFocusing };
};

export default connect(
  mapStateToProps,
  { closeEaseEditor, setLayerTweenEase, setLayerTweenPower, setLayerTweenDuration, setLayerTweenDelay, setTweenDrawerTweenEditing, setCanvasFocusing }
)(EaseEditor);