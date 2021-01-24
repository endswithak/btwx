import React, { useContext, ReactElement, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MotionPathHelper } from 'gsap/MotionPathHelper';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { RootState } from '../store/reducers';
import { closeEaseEditor } from '../store/actions/easeEditor';
import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { ThemeContext } from './ThemeProvider';
import EaseEditorVisualizer from './EaseEditorVisualizer';
import EaseEditorMain from './EaseEditorMain';

gsap.registerPlugin(CustomEase, MotionPathPlugin, MotionPathHelper, DrawSVGPlugin);

const EaseEditor = (): ReactElement => {
  const editorRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[state.easeEditor.tween]);
  const canvasFocusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const easeEditor = useSelector((state: RootState) => state.easeEditor);
  const dispatch = useDispatch();

  const onMouseDown = (event: any): void => {
    const previewButton = document.getElementById('preview-button');
    if (editorRef.current && !editorRef.current.contains(event.target) && !previewButton.contains(event.target)) {
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
          // background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
          width: 864,
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16)`,
          borderRadius: theme.unit
          // backdropFilter: 'blur(17px)'
        }}>
        <EaseEditorVisualizer />
        <EaseEditorMain />
      </div>
    </div>
  );
}

export default EaseEditor;