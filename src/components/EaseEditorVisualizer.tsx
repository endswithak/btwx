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
import { RootState } from '../store/reducers';
import EaseEditorCopyPathButton from './EaseEditorCopyPathButton';

gsap.registerPlugin(CustomEase, RoughEase, SlowMo, MotionPathPlugin, MotionPathHelper, DrawSVGPlugin, CustomBounce, CustomWiggle);

const EaseEditorVisualizer = (): ReactElement => {
  const pathRef = useRef<SVGPathElement>(null);
  const pathRevealRef = useRef<SVGPathElement>(null);
  const valueBarRef = useRef<HTMLDivElement>(null);
  const valueHeadRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
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
          return tween.rough.ref;
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
            className='c-ease-editor-value__progress'
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
            <path className='c-ease-editor-graph__line' ref={pathRef} d={pathData} strokeWidth='1' fill='none' />
            <path className='c-ease-editor-graph__ease' ref={pathRevealRef} d={pathData} strokeWidth='1' fill='none' />
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