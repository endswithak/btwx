/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useCallback, useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeTextEditor } from '../store/actions/textEditor';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { setLayerTextThunk } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { uiPaperScope } from '../canvas';

const TextEditorInput = (): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textSpanRef = useRef<HTMLTextAreaElement>(null);
  const textEditor = useSelector((state: RootState) => state.textEditor);
  const justification = useSelector((state: RootState) => state.textSettings.justification);
  const fontWeight = useSelector((state: RootState) => state.textSettings.fontWeight);
  const fontSize = useSelector((state: RootState) => state.textSettings.fontSize);
  const leading = useSelector((state: RootState) => state.textSettings.leading);
  const fontFamily = useSelector((state: RootState) => state.textSettings.fontFamily);
  const fillColor = useSelector((state: RootState) => state.textSettings.fillColor);
  const textValue = useSelector((state: RootState) => (state.layer.present.byId[state.textEditor.layer] as Btwx.Text).text);
  const [text, setText] = useState(textValue);
  const debounceText = useCallback(
    debounce((dText: string) => dispatch(setLayerTextThunk({id: textEditor.layer, text: dText })), 150),
    []
  );
  const [pos, setPos] = useState({x: textEditor.x, y: textEditor.y});
  const dispatch = useDispatch();

  const onMouseDown = (event: any): void => {
    if (event.target !== textAreaRef.current) {
      dispatch(closeTextEditor());
    }
  }

  const handleTextChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setText(target.value);
  }

  const updateTextAreaSize = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.width = 'auto';
      textAreaRef.current.style.width = `${textSpanRef.current.clientWidth + 4}px`;
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }

  useEffect(() => {
    dispatch(setCanvasFocusing({focusing: false}));
    if (textAreaRef.current) {
      document.addEventListener('mousedown', onMouseDown);
      const paperLayer = getPaperLayer(textEditor.layer, textEditor.projectIndex) as paper.PointText;
      paperLayer.visible = false;
      textAreaRef.current.focus();
      textAreaRef.current.select();
      const topLeft = uiPaperScope.view.projectToView(paperLayer.bounds.topLeft);
      const topCenter = uiPaperScope.view.projectToView(paperLayer.bounds.topCenter);
      const topRight = uiPaperScope.view.projectToView(paperLayer.bounds.topRight);
      setPos({
        x: (() => {
          switch(justification) {
            case 'left':
              return topLeft.x;
            case 'center':
              return topCenter.x;
            case 'right':
              return topRight.x;
          }
        })(),
        y: (() => {
          switch(justification) {
            case 'left':
              return topLeft.y;
            case 'center':
              return topCenter.y;
            case 'right':
              return topRight.y;
          }
        })()
      });
      updateTextAreaSize();
    }
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      const paperLayer = getPaperLayer(textEditor.layer, textEditor.projectIndex) as paper.PointText;
      paperLayer.visible = true;
      debounceText(textAreaRef.current.value);
      dispatch(setCanvasFocusing({focusing: true}));
    }
  }, []);

  useEffect(() => {
    updateTextAreaSize();
  }, [text]);

  return (
    <div
      className='c-text-editor'
      ref={containerRef}>
      <textarea
        className='c-text-editor__textarea'
        ref={textAreaRef}
        value={text}
        onChange={handleTextChange}
        rows={1}
        style={{
          left: pos.x,
          top: pos.y,
          position: 'absolute',
          fontFamily: fontFamily,
          fontSize: fontSize,
          minHeight: leading,
          fontWeight: fontWeight,
          lineHeight: `${leading}px`,
          color: tinyColor({
            h: fillColor.h,
            s: fillColor.s,
            l: fillColor.l,
            a: fillColor.a
          }).toHslString(),
          textAlign: justification,
          transformOrigin: 'left top',
          transform: (() => {
            switch(justification) {
              case 'left':
                return `scale(${uiPaperScope.view.zoom})`;
              case 'center':
                return `scale(${uiPaperScope.view.zoom}) translateX(-50%)`;
              case 'right':
                return `scale(${uiPaperScope.view.zoom}) translateX(-100%)`;
            }
          })()
        }} />
      <span
        className='c-text-editor__span'
        ref={textSpanRef}
        style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
          fontWeight: fontWeight,
          lineHeight: `${leading}px`,
          textAlign: justification
        }}>
        {text}
      </span>
    </div>
  );
}

export default TextEditorInput;