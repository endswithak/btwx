import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import mexp from 'math-expression-evaluator';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MotionPathHelper } from 'gsap/MotionPathHelper';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeEaseEditor } from '../store/actions/easeEditor';
import { setLayerTweenEase, setLayerTweenPower } from '../store/actions/layer';
import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionRow from './SidebarSectionRow';
import EaseEditorVisualizer from './EaseEditorVisualizer';
import EaseEditorDelayInput from './EaseEditorDelayInput';
import EaseEditorDurationInput from './EaseEditorDurationInput';
import EaseEditorEaseInput from './EaseEditorEaseInput';
import EaseEditorPowerInput from './EaseEditorPowerInput';
import EaseEditorBounceStrengthInput from './EaseEditorBounceStrengthInput';
import EaseEditorBounceSquashInput from './EaseEditorBounceSquashInput';
import EaseEditorWiggleWigglesInput from './EaseEditorWiggleWigglesInput';
import EaseEditorWiggleTypeInput from './EaseEditorWiggleTypeInput';
import EaseEditorStepsInput from './EaseEditorStepsInput';
import EaseEditorRoughPointsInput from './EaseEditorRoughPointsInput';
import EaseEditorRoughStrengthInput from './EaseEditorRoughStrengthInput';
import EaseEditorRoughTaperInput from './EaseEditorRoughTaperInput';
import EaseEditorRoughTemplateInput from './EaseEditorRoughTemplateInput';
import EaseEditorSlowLinearRatioInput from './EaseEditorSlowLinearRatioInput';
import EaseEditorSlowPowerInput from './EaseEditorSlowPowerInput';

gsap.registerPlugin(CustomEase, MotionPathPlugin, MotionPathHelper, DrawSVGPlugin);

const EaseEditor = (): ReactElement => {
  const editorRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[state.easeEditor.tween]);
  const easeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease : null);
  const canvasFocusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const easeEditor = useSelector((state: RootState) => state.easeEditor);
  const dispatch = useDispatch();

  const onMouseDown = (event: any): void => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      dispatch(setEventDrawerTweenEditing({id: null}));
      dispatch(closeEaseEditor());
    }
  }

  useEffect(() => {
    if (canvasFocusing) {
      dispatch(setCanvasFocusing({focusing: false}));
    }
    document.addEventListener('mousedown', onMouseDown, false);
    dispatch(setEventDrawerTweenEditing({id: tween.id}));
    return (): void => {
      if (easeEditor.isOpen) {
        dispatch(closeEaseEditor());
      }
      dispatch(setCanvasFocusing({focusing: true}));
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  return (
    <div className='c-ease-editor'>
      <div
        className='c-ease-editor__content'
        ref={editorRef}
        style={{
          // background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString(),
          background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
          width: 700,
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16)`,
          borderRadius: theme.unit,
          // backdropFilter: 'blur(17px)'
        }}>
        <div
          className='c-ease-editor__presets'
          style={{
            height: 568
          }}>
          <div className='c-ease-editor__preset-group'>
            <div
              className='c-ease-editor__preset c-ease-editor__preset--label'
              style={{
                color: theme.text.lighter
              }}>
              Ease
            </div>
            <SidebarSectionRow>
              <SidebarSectionColumn width='100%'>
                <EaseEditorEaseInput />
              </SidebarSectionColumn>
            </SidebarSectionRow>
            {
              (() => {
                switch(easeValue) {
                  case 'customBounce':
                    return (
                      <SidebarSectionRow>
                        <SidebarSectionColumn width='50%'>
                          <EaseEditorBounceStrengthInput />
                        </SidebarSectionColumn>
                        <SidebarSectionColumn width='50%'>
                          <EaseEditorBounceSquashInput />
                        </SidebarSectionColumn>
                      </SidebarSectionRow>
                    );
                  case 'customWiggle':
                    return (
                      <SidebarSectionRow>
                        <SidebarSectionColumn width='50%'>
                          <EaseEditorWiggleWigglesInput />
                        </SidebarSectionColumn>
                        <SidebarSectionColumn width='50%'>
                          <EaseEditorWiggleTypeInput />
                        </SidebarSectionColumn>
                      </SidebarSectionRow>
                    );
                  case 'rough':
                    return (
                      <>
                        <SidebarSectionRow>
                          <SidebarSectionColumn width='50%'>
                            <EaseEditorRoughTaperInput />
                          </SidebarSectionColumn>
                          <SidebarSectionColumn width='50%'>
                            <EaseEditorRoughTemplateInput />
                          </SidebarSectionColumn>
                        </SidebarSectionRow>
                        <SidebarSectionRow>
                          <SidebarSectionColumn width='50%'>
                            <EaseEditorRoughPointsInput />
                          </SidebarSectionColumn>
                          <SidebarSectionColumn width='50%'>
                            <EaseEditorRoughStrengthInput />
                          </SidebarSectionColumn>
                        </SidebarSectionRow>
                      </>
                    );
                  case 'steps':
                    return (
                      <SidebarSectionRow>
                        <SidebarSectionColumn width='50%'>
                          <EaseEditorStepsInput />
                        </SidebarSectionColumn>
                        <SidebarSectionColumn width='50%'>
                        </SidebarSectionColumn>
                      </SidebarSectionRow>
                    );
                  case 'slow':
                    return (
                      <SidebarSectionRow>
                        <SidebarSectionColumn width='50%'>
                          <EaseEditorSlowLinearRatioInput />
                        </SidebarSectionColumn>
                        <SidebarSectionColumn width='50%'>
                          <EaseEditorSlowPowerInput />
                        </SidebarSectionColumn>
                      </SidebarSectionRow>
                    );
                  default:
                    return (
                      <SidebarSectionRow>
                        <SidebarSectionColumn width='100%'>
                          <EaseEditorPowerInput />
                        </SidebarSectionColumn>
                      </SidebarSectionRow>
                    );
                }
              })()
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
                <EaseEditorDurationInput />
              </SidebarSectionColumn>
              <SidebarSectionColumn width='50%'>
                <EaseEditorDelayInput />
              </SidebarSectionColumn>
            </SidebarSectionRow>
          </div>
        </div>
        <EaseEditorVisualizer />
      </div>
    </div>
  );
}

export default EaseEditor;