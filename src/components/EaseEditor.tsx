import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeEaseEditor } from '../store/actions/easeEditor';
import { EaseEditorTypes } from '../store/actionTypes/easeEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { setLayerTweenEase, setLayerTweenPower } from '../store/actions/layer';
import { SetLayerTweenEasePayload, SetLayerTweenPowerPayload, LayerTypes } from '../store/actionTypes/layer';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import MotionPathHelper from 'gsap/MotionPathHelper';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';

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
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
}

const EaseEditor = (props: EaseEditorProps): ReactElement => {
  const customPathRef = useRef<SVGPathElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathRevealRef = useRef<SVGPathElement>(null);
  const valueBarRef = useRef<HTMLDivElement>(null);
  const valueHeadRef = useRef<HTMLDivElement>(null);
  const progressTimeRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { tween, easeEditor, closeEaseEditor, setLayerTweenEase, setLayerTweenPower, disableSelectionTool, enableSelectionTool } = props;

  const easeTypes = ['linear', 'power1', 'power2', 'power3', 'power4', 'back', 'bounce', 'circ', 'expo', 'sine', 'custom'];
  const easePowerTypes = ['in', 'inOut', 'out'];

  const handleCloseRequest = () => {
    closeEaseEditor();
  }

  const handleTypePresetClick = (preset: em.TweenEaseTypes) => {
    if (preset === 'custom') {
      const startPath = pathRef.current.getAttribute('d');
      setLayerTweenEase({id: tween.id, ease: preset, custom: startPath});
    } else {
      setLayerTweenEase({id: tween.id, ease: preset});
    }
  }

  const handlePowerPresetClick = (preset: em.TweenEasePowerTypes) => {
    setLayerTweenPower({id: tween.id, power: preset});
  }

  const setAndAnimate = () => {
    gsap.killTweensOf([pathRevealRef.current, valueBarRef.current, valueHeadRef.current]);
    gsap.set(pathRevealRef.current, {clearProps: 'all'});
    gsap.set(valueBarRef.current, {clearProps: 'scale'});
    gsap.set(valueHeadRef.current, {clearProps: 'y'});
    gsap.set(progressBarRef.current, {clearProps: 'scale'});
    if (tween.ease === 'custom') {
      CustomEase.getSVGData(tween.custom, {width: 400, height: 400, path: pathRef.current});
      CustomEase.getSVGData(tween.custom, {width: 400, height: 400, path: pathRevealRef.current});
      gsap.from(valueBarRef.current, {scaleY: 0, duration: tween.duration, ease: tween.custom });
      gsap.from(valueHeadRef.current, {y: 400, duration: tween.duration, ease: tween.custom });
      gsap.from(pathRevealRef.current, {
        duration: tween.duration,
        drawSVG: 0,
        ease: tween.custom,
        onUpdate: function() {
          gsap.set(progressBarRef.current, {scaleX: this.progress()});
          progressTimeRef.current.innerText = this.progress().toFixed(2);
        }
      });
      // const pathHelper = MotionPathHelper.create(customPathRef.current, {
      //   path: tween.custom,
      //   pathWidth: 2,
      //   pathColor: theme.palette.primary,
      //   selected: true
      // });
      // pathHelper.editor._draggable._onMove = null;
      // pathHelper.editor._anchors[0].editor._draggable._onMove = null;
      // pathHelper.editor._anchors[pathHelper.editor._anchors.length - 1].editor._draggable._onMove = null;
    } else {
      CustomEase.getSVGData(`${tween.ease}.${tween.power}`, {width: 400, height: 400, path: pathRef.current});
      CustomEase.getSVGData(`${tween.ease}.${tween.power}`, {width: 400, height: 400, path: pathRevealRef.current});
      gsap.from(valueBarRef.current, {scaleY: 0, duration: tween.duration, ease: `${tween.ease}.${tween.power}` });
      gsap.from(valueHeadRef.current, {y: 400, duration: tween.duration, ease: `${tween.ease}.${tween.power}` });
      gsap.from(pathRevealRef.current, {
        duration: tween.duration,
        drawSVG: 0,
        ease: `${tween.ease}.${tween.power}`,
        onUpdate: function() {
          gsap.set(progressBarRef.current, {scaleX: this.progress()});
          progressTimeRef.current.innerText = this.progress().toFixed(2);
        }
      });
    }
  }

  const handleAfterOpen = () => {
    disableSelectionTool();
    setAndAnimate();
  }

  const handleAfterClose = () => {
    enableSelectionTool();
  }

  useEffect(() => {
    if (tween) {
      setAndAnimate();
    }
  }, [tween]);

  return (
    <Modal
      className='c-ease-editor'
      overlayClassName='c-ease-editor__overlay'
      isOpen={easeEditor.isOpen}
      onAfterOpen={handleAfterOpen}
      onAfterClose={handleAfterClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleCloseRequest}
      style={{
        content: {
          background: theme.background.z4,
          width: 700,
          height: 650,
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
              background: theme.background.z3,
              width: 400,
              height: 512
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
                bottom: 0
              }}>
              <line x1="0" y1="0" x2="400" y2="0" stroke={theme.text.lightest}></line>
              <path ref={pathRef} strokeWidth='1' stroke={theme.text.lightest} fill='none'></path>
              <path ref={pathRevealRef} strokeWidth='1' stroke={theme.text.base} fill='none'></path>
            </svg>
            {
              tween && tween.ease === 'custom'
              ? <svg
                  viewBox='0 0 400 400'
                  preserveAspectRatio='xMidYMid meet'
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    overflow: 'visible',
                    maxHeight: 400,
                    bottom: 0
                  }}>
                  <path ref={customPathRef} />
                </svg>
              : null
            }
          </div>
          <div className='c-ease-editor__value' style={{height: 400}}>
            <div
              className='c-ease-editor-value__bar'
              style={{
                background: theme.background.z6
              }} />
            <div
              ref={valueBarRef}
              className='c-ease-editor-value__progress'
              style={{
                background: theme.palette.primary
              }} />
            <div
              ref={valueHeadRef}
              className='c-ease-editor-value__progress-head'
              style={{
                background: theme.palette.primary
              }} />
          </div>
        </div>
        <div className='c-ease-editor-visualizer__bottom'>
          <div className='c-ease-editor__progress-bar' style={{maxWidth: 400}}>
            <div
              className='c-ease-editor-progress-bar__base'
              style={{
                background: theme.background.z6
              }} />
            <div
              ref={progressBarRef}
              className='c-ease-editor-progress-bar__progress'
              style={{
                background: theme.palette.primary
              }} />
          </div>
          <div
            ref={progressTimeRef}
            className='c-ease-editor__progress-time'
            style={{
              color: theme.text.base
            }}>
            1
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
            Type
          </div>
          {
            easeTypes.map((preset: em.TweenEaseTypes, index) => (
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
            Power
          </div>
          {
            easePowerTypes.map((preset: em.TweenEasePowerTypes, index) => (
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
  { closeEaseEditor, setLayerTweenEase, setLayerTweenPower, enableSelectionTool, disableSelectionTool }
)(EaseEditor);