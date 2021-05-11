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
import { paperMain } from '../canvas';
import { getLeading } from './CanvasTextLayer';

const TextEditorInput = (): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textSpanRef = useRef<HTMLTextAreaElement>(null);
  const textEditor = useSelector((state: RootState) => state.textEditor);
  const layerItem = useSelector((state: RootState) => state.layer.present.byId[state.textEditor.layer] as Btwx.Text);
  const textValue = useSelector((state: RootState) => (state.layer.present.byId[state.textEditor.layer] as Btwx.Text).text);
  const [text, setText] = useState(textValue);
  const debounceText = useCallback(
    debounce((dText: string) => dispatch(setLayerTextThunk({
      id: textEditor.layer,
      text: dText
    })), 150),
    []
  );
  const [pos, setPos] = useState({x: textEditor.x, y: textEditor.y});
  const dispatch = useDispatch();

  const handleBlur = (event: any): void => {
    const paperLayer = getPaperLayer(textEditor.layer, textEditor.projectIndex) as paper.PointText;
    paperLayer.visible = true;
    debounceText(textAreaRef.current.value);
    dispatch(setCanvasFocusing({
      focusing: true
    }));
    dispatch(closeTextEditor());
  }

  const handleTextChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setText(target.value);
  }

  const updateTextAreaSize = () => {
    if (textAreaRef.current) {
      if (layerItem.textStyle.textResize === 'autoWidth') {
        textAreaRef.current.style.width = 'auto';
        textAreaRef.current.style.width = `${textSpanRef.current.clientWidth + 4}px`;
      }
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }

  useEffect(() => {
    if (textAreaRef.current) {
      const paperLayer = getPaperLayer(textEditor.layer, textEditor.projectIndex) as paper.PointText;
      paperLayer.visible = false;
      textAreaRef.current.focus();
      textAreaRef.current.select();
      const topLeft = paperMain.view.projectToView(paperLayer.bounds.topLeft);
      const topCenter = paperMain.view.projectToView(paperLayer.bounds.topCenter);
      const topRight = paperMain.view.projectToView(paperLayer.bounds.topRight);
      setPos({
        x: (() => {
          switch(layerItem.textStyle.justification) {
            case 'left':
              return topLeft.x;
            case 'center':
              return topCenter.x;
            case 'right':
              return topRight.x;
          }
        })(),
        y: (() => {
          switch(layerItem.textStyle.justification) {
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
    dispatch(setCanvasFocusing({focusing: false}));
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
        spellCheck={false}
        ref={textAreaRef}
        onBlur={handleBlur}
        value={text}
        onChange={handleTextChange}
        rows={1}
        style={{
          left: pos.x,
          top: pos.y,
          position: 'absolute',
          fontFamily: layerItem.textStyle.fontFamily,
          fontSize: layerItem.textStyle.fontSize,
          minHeight: layerItem.textStyle.leading,
          fontWeight: layerItem.textStyle.fontWeight,
          lineHeight: `${getLeading({
            leading: layerItem.textStyle.leading,
            fontSize: layerItem.textStyle.fontSize
          })}px`,
          letterSpacing: layerItem.textStyle.letterSpacing,
          fontStyle: layerItem.textStyle.fontStyle,
          textAlign: layerItem.textStyle.justification,
          textTransform: layerItem.textStyle.textTransform,
          transformOrigin: 'left top',
          color: tinyColor({
            h: layerItem.style.fill.color.h,
            s: layerItem.style.fill.color.s,
            l: layerItem.style.fill.color.l,
            a: layerItem.style.fill.color.a
          }).toRgbString(),
          transform: (() => {
            switch(layerItem.textStyle.justification) {
              case 'left':
                return `scale(${paperMain.view.zoom})`;
              case 'center':
                return `scale(${paperMain.view.zoom}) translateX(-50%)`;
              case 'right':
                return `scale(${paperMain.view.zoom}) translateX(-100%)`;
            }
          })(),
          width: (() => {
            switch(layerItem.textStyle.textResize) {
              case 'autoWidth':
                return 'auto';
              case 'autoHeight':
              case 'fixed':
                return layerItem.frame.innerWidth;
            }
          })()
        }} />
      <span
        className='c-text-editor__span'
        ref={textSpanRef}
        style={{
          fontFamily: layerItem.textStyle.fontFamily,
          fontSize: layerItem.textStyle.fontSize,
          fontWeight: layerItem.textStyle.fontWeight,
          lineHeight: `${getLeading({
            leading: layerItem.textStyle.leading,
            fontSize: layerItem.textStyle.fontSize
          })}px`,
          textAlign: layerItem.textStyle.justification,
          letterSpacing: layerItem.textStyle.letterSpacing,
          textTransform: layerItem.textStyle.textTransform,
          fontStyle: layerItem.textStyle.fontStyle
        }}>
        {text}
      </span>
    </div>
  );
}

export default TextEditorInput;