import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { evaluate } from 'mathjs';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeEaseEditor } from '../store/actions/easeEditor';
import { EaseEditorTypes } from '../store/actionTypes/easeEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { setLayerTweenEase, setLayerTweenPower, setLayerTweenDuration } from '../store/actions/layer';
import { SetLayerTweenEasePayload, SetLayerTweenPowerPayload, SetLayerTweenDurationPayload, LayerTypes } from '../store/actionTypes/layer';
import { setTweenDrawerTweenEditing } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenEditingPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import SidebarInput from './SidebarInput';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import MotionPathHelper from 'gsap/MotionPathHelper';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import tinyColor from 'tinycolor2';

gsap.registerPlugin(CustomEase, MotionPathPlugin, MotionPathHelper, DrawSVGPlugin);

Modal.setAppElement('#root');

interface EaseEditorProps {
  tween?: em.Tween;
  easeEditor?: {
    isOpen: boolean;
    tween: string;
  };
  closeEaseEditor?(): EaseEditorTypes;
  setLayerTweenEase?(payload: SetLayerTweenEasePayload): LayerTypes;
  setLayerTweenPower?(payload: SetLayerTweenPowerPayload): LayerTypes;
  setLayerTweenDuration?(payload: SetLayerTweenDurationPayload): LayerTypes;
  setTweenDrawerTweenEditing?(payload: SetTweenDrawerTweenEditingPayload): TweenDrawerTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
}

const EaseEditor = (props: EaseEditorProps): ReactElement => {
  const pathRef = useRef<SVGPathElement>(null);
  const pathRevealRef = useRef<SVGPathElement>(null);
  const valueBarRef = useRef<HTMLDivElement>(null);
  const valueHeadRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { tween, easeEditor, closeEaseEditor, setLayerTweenEase, setLayerTweenPower, disableSelectionTool, enableSelectionTool, setLayerTweenDuration, setTweenDrawerTweenEditing } = props;
  const [duration, setDuration] = useState<string | number>(null);

  const easeTypes = ['linear', 'power1', 'power2', 'power3', 'power4', 'back', 'bounce', 'circ', 'expo', 'sine'];
  const easePowerTypes = ['in', 'inOut', 'out'];

  const handleCloseRequest = () => {
    closeEaseEditor();
  }

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

  const handleAfterOpen = () => {
    disableSelectionTool();
    setAndAnimate();
    setDuration(tween.duration);
    setTweenDrawerTweenEditing({id: tween.id});
  }

  const handleAfterClose = () => {
    setTweenDrawerTweenEditing({id: null});
    enableSelectionTool();
  }

  useEffect(() => {
    if (tween) {
      setAndAnimate();
    }
  }, [tween]);

  const handleDurationChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setDuration(target.value);
  };

  const handleDurationSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      const durationRounded = Math.round((evaluate(`${duration}`) + Number.EPSILON) * 100) / 100
      if (durationRounded <= 10 && durationRounded >= 0 && durationRounded !== tween.duration) {
        setLayerTweenDuration({id: tween.id, duration: durationRounded});
        setDuration(durationRounded);
      } else {
        setDuration(tween.duration);
        setAndAnimate();
      }
    } catch(error) {
      setDuration(tween.duration);
      setAndAnimate();
    }
  }

  return (
    <Modal
      className='c-ease-editor'
      overlayClassName='c-ease-editor-wrap'
      isOpen={easeEditor.isOpen}
      onAfterOpen={handleAfterOpen}
      onAfterClose={handleAfterClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleCloseRequest}
      style={{
        content: {
          background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString(),
          width: 700,
          height: 576,
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset, 0 4px 16px 0 rgba(0,0,0,0.16)`,
          borderRadius: theme.unit,
          backdropFilter: 'blur(17px)'
        }
      }}
      contentLabel='ease-editor'>
      <div
        ref={visualizerRef}
        className='c-ease-editor__visualizer'>
        <div className='c-ease-editor-visualizer__top'>
          <div
            className='c-ease-editor__graph'
            style={{
              position: 'relative',
              //background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
              width: 400,
              height: 544
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
              height: 544
            }}>
            <div
              className='c-ease-editor-value__bar'
              style={{
                background: theme.text.lightest,
                opacity: 0.5,
                height: 544
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
      <div className='c-ease-editor__presets'>
        <div className='c-ease-editor__preset-group'>
          <div
            className='c-ease-editor__preset c-ease-editor__preset--label'
            style={{
              color: theme.text.lighter
            }}>
            Cubic Bezier
          </div>
          {
            easeTypes.map((preset: em.CubicBezier, index) => (
              <div
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
              </div>
            ))
          }
        </div>
        <div className='c-ease-editor__preset-group'>
          <div
            className='c-ease-editor__preset c-ease-editor__preset--label'
            style={{
              color: theme.text.lighter
            }}>
            Type
          </div>
          {
            easePowerTypes.map((preset: em.CubicBezierType, index) => (
              <div
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
              </div>
            ))
          }
        </div>
        <div className='c-ease-editor__preset-group'>
          <div
            className='c-ease-editor__preset c-ease-editor__preset--label'
            style={{
              color: theme.text.lighter
            }}>
            Duration
          </div>
          <SidebarInput
            value={duration}
            onChange={handleDurationChange}
            onSubmit={handleDurationSubmit}
            submitOnBlur
            disabled={!easeEditor.isOpen} />
        </div>
      </div>
    </Modal>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, easeEditor } = state;
  const tween = layer.present.tweenById[easeEditor.tween];
  return { tween, easeEditor };
};

export default connect(
  mapStateToProps,
  { closeEaseEditor, setLayerTweenEase, setLayerTweenPower, enableSelectionTool, disableSelectionTool, setLayerTweenDuration, setTweenDrawerTweenEditing }
)(EaseEditor);