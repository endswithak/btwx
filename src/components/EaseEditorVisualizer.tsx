import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase, SlowMo } from 'gsap/EasePack';
import { CustomBounce } from 'gsap/CustomBounce';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MotionPathHelper } from 'gsap/MotionPathHelper';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

gsap.registerPlugin(CustomEase, RoughEase, SlowMo, MotionPathPlugin, MotionPathHelper, DrawSVGPlugin, CustomBounce, CustomWiggle);

const EaseEditor = (): ReactElement => {
  const pathRef = useRef<SVGPathElement>(null);
  const pathRevealRef = useRef<SVGPathElement>(null);
  const valueBarRef = useRef<HTMLDivElement>(null);
  const valueHeadRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[state.easeEditor.tween]);
  const [pathData, setPathData] = useState();
  const easeString = useSelector((state: RootState) => {
    const tween = state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween] : null;
    if (tween) {
      switch(tween.ease) {
        case 'customBounce':
          return `bounce({strength: ${tween.customBounce.strength}, endAtStart: ${tween.customBounce.endAtStart}, squash: ${tween.customBounce.squash}})`;
        case 'customWiggle':
          return `wiggle({type: ${tween.customWiggle.type}, wiggles: ${tween.customWiggle.wiggles}})`;
        case 'slow':
          return `slow(${tween.slow.linearRatio}, ${tween.slow.power}, ${tween.slow.yoyoMode})`;
        case 'rough':
          return `rough({clamp: ${tween.rough.clamp}, points: ${tween.rough.points}, randomize: ${tween.rough.randomize}, strength: ${tween.rough.strength}, taper: ${tween.rough.taper}, template: ${tween.rough.template}})`;
        case 'steps':
          return `steps(${tween.steps.steps})`;
        default:
          return `${tween.ease}.${tween.power}`;
      }
    } else {
      return null;
    }
  });

  const setAndAnimate = (): void => {
    const ease = easeString;
    gsap.killTweensOf([pathRevealRef.current, valueBarRef.current, valueHeadRef.current]);
    gsap.set(pathRevealRef.current, {clearProps: 'all'});
    gsap.set(valueBarRef.current, {clearProps: 'scale'});
    gsap.set(valueHeadRef.current, {clearProps: 'y'});
    // const pathData = CustomEase.getSVGData(ease, {width: 400, height: 400});
    // CustomEase.getSVGData(ease, {width: 400, height: 400, path: pathRevealRef.current});
    gsap.from(valueBarRef.current, {scaleY: 0, duration: tween.duration, ease: ease });
    gsap.to(valueHeadRef.current, {y: `-=400`, duration: tween.duration, ease: ease });
    gsap.from(pathRevealRef.current, {
      duration: tween.duration,
      drawSVG: 0,
      ease: ease
    });
    setPathData(CustomEase.getSVGData(ease, {width: 400, height: 400}));
  }

  useEffect(() => {
    if (tween) {
      setAndAnimate();
    }
  }, [tween]);

  return (
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
            <path ref={pathRef} d={pathData} strokeWidth='1' stroke={theme.text.lightest} opacity='0.5' fill='none'></path>
            <path ref={pathRevealRef} d={pathData} strokeWidth='1' stroke={theme.text.base} fill='none'></path>
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
  );
}

export default EaseEditor;