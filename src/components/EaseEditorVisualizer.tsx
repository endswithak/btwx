import React, { ReactElement, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase, SlowMo } from 'gsap/EasePack';
import { CustomBounce } from 'gsap/CustomBounce';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MotionPathHelper } from 'gsap/MotionPathHelper';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import {
  getSelectedTweensDuration, getSelectedTweensEase, getSelectedTweensPower, getSelectedCustomBounceTweensStrength,
  getSelectedCustomBounceTweensSquash, getSelectedCustomBounceTweensEndAtStart,
  getSelectedCustomWiggleTweensStrength, getSelectedCustomWiggleTweensWiggles,
  getSelectedStepTweensSteps, getSelectedSlowTweensLinearRatio, getSelectedSlowTweensPower,
  getSelectedSlowTweensYoyoMode, selectedTweensEaseCurvesMatch, getSelectedCustomWiggleTweensType
} from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import EaseEditorCopyPathButton from './EaseEditorCopyPathButton';

gsap.registerPlugin(CustomEase, RoughEase, SlowMo, MotionPathPlugin, MotionPathHelper, DrawSVGPlugin, CustomBounce, CustomWiggle);

const EaseEditorVisualizer = (): ReactElement => {
  const pathRef = useRef<SVGPathElement>(null);
  const pathRevealRef = useRef<SVGPathElement>(null);
  const valueBarRef = useRef<HTMLDivElement>(null);
  const valueHeadRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const selectedTweensMatch = useSelector((state: RootState) => selectedTweensEaseCurvesMatch(state));
  const ease = useSelector((state: RootState) => getSelectedTweensEase(state));
  const power = useSelector((state: RootState) => getSelectedTweensPower(state));
  const duration = useSelector((state: RootState) => getSelectedTweensDuration(state));
  const customBounceStrength = useSelector((state: RootState) => getSelectedCustomBounceTweensStrength(state));
  const customBounceSquash = useSelector((state: RootState) => getSelectedCustomBounceTweensSquash(state));
  const customBounceEndAtStart = useSelector((state: RootState) => getSelectedCustomBounceTweensEndAtStart(state));
  const customWiggleStrength = useSelector((state: RootState) => getSelectedCustomWiggleTweensStrength(state));
  const customWiggleWiggles = useSelector((state: RootState) => getSelectedCustomWiggleTweensWiggles(state));
  const customWiggleType = useSelector((state: RootState) => getSelectedCustomWiggleTweensType(state));
  const stepSteps = useSelector((state: RootState) => getSelectedStepTweensSteps(state));
  const slowLinearRatio = useSelector((state: RootState) => getSelectedSlowTweensLinearRatio(state));
  const slowPower = useSelector((state: RootState) => getSelectedSlowTweensPower(state));
  const slowYoYoMode = useSelector((state: RootState) => getSelectedSlowTweensYoyoMode(state));
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[state.easeEditor.tween]);
  const [pathData, setPathData] = useState();

  const getEaseString = () => {
    if (selectedTweensMatch) {
      switch(ease) {
        case 'customBounce':
          return `bounce({strength: ${customBounceStrength}, endAtStart: ${customBounceEndAtStart}, squash: ${customBounceSquash}})`;
        case 'customWiggle':
          return `wiggle({type: ${customWiggleType}, wiggles: ${customWiggleWiggles}})`;
        case 'slow':
          return `slow(${slowLinearRatio}, ${slowPower}, ${slowYoYoMode})`;
        case 'rough':
          return tween.rough.ref;
        case 'steps':
          return `steps(${stepSteps})`;
        default:
          return `${ease}.${power}`;
      }
    } else {
      return null;
    }
  }

  const setAndAnimate = (): void => {
    const easeString = getEaseString();
    gsap.killTweensOf([pathRevealRef.current, valueBarRef.current, valueHeadRef.current]);
    gsap.set(pathRevealRef.current, {clearProps: 'all'});
    gsap.set(valueBarRef.current, {scaleY: 0});
    gsap.set(valueHeadRef.current, {clearProps: 'y'});
    if (ease === 'customWiggle') {
      gsap.set(valueHeadRef.current, {y: '-=200'});
    }
    if (easeString) {
      // const pathData = CustomEase.getSVGData(ease, {width: 400, height: 400});
      // CustomEase.getSVGData(ease, {width: 400, height: 400, path: pathRevealRef.current});
      if (duration !== 'multi') {
        gsap.to(valueBarRef.current, {scaleY: 1, duration: duration, ease: easeString });
        gsap.to(valueHeadRef.current, {y: (ease === 'customWiggle' ? `-=200` : `-=400`), duration: duration, ease: easeString });
        gsap.from(pathRevealRef.current, {
          duration: duration,
          drawSVG: 0,
          ease: easeString
        });
      }
      setPathData(CustomEase.getSVGData(easeString, {width: 400, height: ease === 'customWiggle' ? 200 : 400}));
    }
  }

  useEffect(() => {
    setAndAnimate();
  }, [
    customBounceStrength, customBounceEndAtStart, customBounceSquash,
    customWiggleType, customWiggleWiggles, slowLinearRatio,
    slowPower, slowYoYoMode, stepSteps, ease, power
  ]);

  return (
    <div
      ref={visualizerRef}
      className='c-ease-editor__visualizer'>
      <div className='c-ease-editor-visualizer__top'>
        <div
          className='c-ease-editor__value'
          style={{
            height: 536
          }}>
          <div
            className='c-ease-editor-value__bar'
            style={{
              opacity: 0.5,
              height: 536
            }} />
          <div
            ref={valueBarRef}
            className={`c-ease-editor-value__progress${
              ease === 'customWiggle'
              ? `${' '}c-ease-editor-value__progress--wiggle`
              : ''
            }`}
            style={{
              height: 400,
              bottom: 72
            }} />
          <div
            ref={valueHeadRef}
            className='c-ease-editor-value__progress-head'
            style={{
              bottom: 72
            }} />
        </div>
        <div
          className='c-ease-editor__graph'
          style={{
            position: 'relative',
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
            <line className='c-ease-editor-graph__line' x1="0" y1="0" x2="400" y2="0" />
            <line className='c-ease-editor-graph__line' x1="0" y1="200" x2="400" y2="200" />
            <path
              className='c-ease-editor-graph__line'
              ref={pathRef}
              d={pathData}
              strokeWidth='1'
              fill='none' />
            <path
              className='c-ease-editor-graph__ease'
              ref={pathRevealRef}
              d={pathData}
              strokeWidth='1'
              fill='none' />
            <line className='c-ease-editor-graph__line' x1="0" y1="400" x2="400" y2="400" />
          </svg>
        </div>
        <EaseEditorCopyPathButton
          pathData={pathData} />
      </div>
    </div>
  );
}

export default EaseEditorVisualizer;