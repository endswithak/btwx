/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useCallback, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeTextEditor } from '../store/actions/textEditor';
import { TextEditorTypes } from '../store/actionTypes/textEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { setLayerText, selectLayer } from '../store/actions/layer';
import { SetLayerTextPayload, SelectLayerPayload, LayerTypes } from '../store/actionTypes/layer';
import { paperMain } from '../canvas';
import { TextEditorState } from '../store/reducers/textEditor';
import { TextSettingsState } from '../store/reducers/textSettings';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { SetCanvasFocusingPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';

interface TextEditorInputProps {
  textEditor?: TextEditorState;
  textSettings?: TextSettingsState;
  layerItem?: em.Text;
  canvasFocusing?: boolean;
  closeTextEditor?(): TextEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  setLayerText?(payload: SetLayerTextPayload): LayerTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  setCanvasFocusing?(payload: SetCanvasFocusingPayload): CanvasSettingsTypes;
}

const TextEditorInput = (props: TextEditorInputProps): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textSpanRef = useRef<HTMLTextAreaElement>(null);
  const { textEditor, textSettings, layerItem, closeTextEditor, setCanvasFocusing, canvasFocusing, setLayerText, selectLayer } = props;
  const [text, setText] = useState(layerItem.text);
  const [prevText, setPrevText] = useState(layerItem.text);
  const debounceText = useCallback(
    debounce((dText: string) => setLayerText({id: textEditor.layer, text: dText }), 250),
    []
  );
  const [pos, setPos] = useState({x: textEditor.x, y: textEditor.y});

  const onMouseDown = (event: any) => {
    if (event.target !== textAreaRef.current) {
      closeTextEditor();
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
    if (textAreaRef.current) {
      if (canvasFocusing) {
        setCanvasFocusing({focusing: false});
      }
      document.addEventListener('mousedown', onMouseDown);
      const paperLayer = paperMain.project.getItem({data: { id: textEditor.layer }}) as paper.PointText;
      textAreaRef.current.focus();
      textAreaRef.current.select();
      const singleLineText = paperLayer.clone({insert: false}) as paper.PointText;
      singleLineText.content = 'Text';
      const anchorPoint = paperMain.view.projectToView(singleLineText.point);
      const domAnchorPoint = paperMain.view.projectToView(singleLineText.bounds.leftCenter);
      const topLeft = paperMain.view.projectToView(singleLineText.bounds.topLeft);
      const topCenter = paperMain.view.projectToView(singleLineText.bounds.topCenter);
      const topRight = paperMain.view.projectToView(singleLineText.bounds.topRight);
      const anchorDiff = (anchorPoint.y - domAnchorPoint.y) - (((textSettings.fontSize * 0.8) * paperMain.view.zoom) / 2);
      setPos({
        x: (() => {
          switch(textSettings.justification) {
            case 'left':
              return topLeft.x;
            case 'center':
              return topCenter.x;
            case 'right':
              return topRight.x;
          }
        })(),
        y: (() => {
          switch(textSettings.justification) {
            case 'left':
              return topLeft.y + anchorDiff;
            case 'center':
              return topCenter.y + anchorDiff;
            case 'right':
              return topRight.y + anchorDiff;
          }
        })()
      });
      updateTextAreaSize();
    }
    return () => {
      setCanvasFocusing({focusing: true});
      paperMain.project.getItem({data: { id: textEditor.layer }}).visible = true;
      selectLayer({id: textEditor.layer, newSelection: true });
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  useEffect(() => {
    const paperLayer = paperMain.project.getItem({data: { id: textEditor.layer }}) as paper.PointText;
    paperLayer.visible = false;
  }, [layerItem.text]);

  useEffect(() => {
    updateTextAreaSize();
    if (text !== prevText) {
      debounceText(text);
      setPrevText(text);
    }
  }, [text]);

  return (
    <div
      className='c-text-editor'
      ref={containerRef}>
      {/* <div style={{
        position: 'absolute',
        top: 0,
        left: pos.x,
        height: '100%',
        width: 1,
        background: 'red'
      }} />
      <div style={{
        position: 'absolute',
        top: pos.y,
        left: 0,
        height: 1,
        width: '100%',
        background: 'red'
      }} /> */}
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
          fontFamily: textSettings.fontFamily,
          fontSize: textSettings.fontSize,
          minHeight: textSettings.leading,
          fontWeight: (() => {
            switch(textSettings.fontWeight) {
              case 'normal':
                return textSettings.fontWeight;
              case 'bold':
              case 'bold italic':
                return 'bold';
              case 'italic':
                return 'normal';
            }
          })(),
          fontStyle: (() => {
            switch(textSettings.fontWeight) {
              case 'normal':
              case 'bold':
                return textSettings.fontWeight;
              case 'bold italic':
              case 'italic':
                return 'italic';
            }
          })(),
          lineHeight: `${textSettings.leading}px`,
          color: tinyColor({h: textSettings.fillColor.h, s: textSettings.fillColor.s, l: textSettings.fillColor.l, a: textSettings.fillColor.a}).toHslString(),
          textAlign: textSettings.justification,
          transformOrigin: 'left top',
          transform: (() => {
            switch(textSettings.justification) {
              case 'left':
                return `scale(${paperMain.view.zoom})`;
              case 'center':
                return `scale(${paperMain.view.zoom}) translateX(-50%)`;
              case 'right':
                return `scale(${paperMain.view.zoom}) translateX(-100%)`;
            }
          })()
        }} />
      <span
        className='c-text-editor__span'
        ref={textSpanRef}
        style={{
          fontFamily: textSettings.fontFamily,
          fontSize: textSettings.fontSize,
          fontWeight: (() => {
            switch(textSettings.fontWeight) {
              case 'normal':
                return textSettings.fontWeight;
              case 'bold':
              case 'bold italic':
                return 'bold';
              case 'italic':
                return 'normal';
            }
          })(),
          fontStyle: (() => {
            switch(textSettings.fontWeight) {
              case 'normal':
              case 'bold':
                return textSettings.fontWeight;
              case 'bold italic':
              case 'italic':
                return 'italic';
            }
          })(),
          lineHeight: `${textSettings.leading}px`,
          textAlign: textSettings.justification
        }}>
        {text}
      </span>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { textEditor, textSettings, layer, canvasSettings } = state;
  const layerItem = (layer.present.byId[textEditor.layer] as em.Text);
  const canvasFocusing = canvasSettings.focusing;
  return { textEditor, textSettings, layerItem, canvasFocusing };
};

export default connect(
  mapStateToProps,
  { closeTextEditor, disableSelectionTool, enableSelectionTool, setLayerText, selectLayer, setCanvasFocusing }
)(TextEditorInput);