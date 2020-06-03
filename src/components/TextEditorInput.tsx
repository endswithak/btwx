import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
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
import { CanvasSettingsState } from '../store/reducers/canvasSettings';
import gsap from 'gsap';

interface TextEditorInputProps {
  textEditor?: TextEditorState;
  textSettings?: TextSettingsState;
  canvasSettings?: CanvasSettingsState;
  layerItem?: em.Text;
  closeTextEditor?(): TextEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  setLayerText?(payload: SetLayerTextPayload): LayerTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
}

const TextEditorInput = (props: TextEditorInputProps): ReactElement => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textSpanRef = useRef<HTMLTextAreaElement>(null);
  const theme = useContext(ThemeContext);
  const { textEditor, textSettings, canvasSettings, layerItem, closeTextEditor, disableSelectionTool, enableSelectionTool, setLayerText, selectLayer } = props;
  const [text, setText] = useState(layerItem.text);

  const handleTextChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setText(target.value);
  }

  const handleClose = () => {
    paperMain.project.getItem({data: { id: textEditor.layer }}).visible = true;
    closeTextEditor();
    setLayerText({id: textEditor.layer, text });
    selectLayer({id: textEditor.layer, newSelection: true });
    enableSelectionTool();
  }

  useEffect(() => {
    if (textAreaRef.current) {
      if (paperMain.project.getItem({data: { id: 'selectionFrame' }})) {
        paperMain.project.getItem({data: { id: 'selectionFrame' }}).remove();
      }
      if (paperMain.project.getItem({data: { id: 'hoverFrame' }})) {
        paperMain.project.getItem({data: { id: 'hoverFrame' }}).remove();
      }
      paperMain.project.getItem({data: { id: textEditor.layer }}).visible = false;
      textAreaRef.current.focus();
      textAreaRef.current.select();
      textAreaRef.current.style.minHeight = `${textSettings.leading}px`;
      textAreaRef.current.style.width = 'auto';
      textAreaRef.current.style.width = `${textSpanRef.current.clientWidth + 4}px`;
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      const canvas = document.getElementById('canvas-main') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      ctx.font = `${textSettings.fontSize}px ${textSettings.fontFamily}`;
      const textMetrics = ctx.measureText(layerItem.text);
      const boundingHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
      const boundingWhitespace = textSettings.leading - boundingHeight;
      const baseline = (boundingWhitespace / 2) + textMetrics.actualBoundingBoxAscent + (textMetrics.actualBoundingBoxDescent / 2);
      gsap.set(textAreaRef.current, {
        x: textEditor.x,
        y: textEditor.y - (baseline * canvasSettings.zoom),
        scale: canvasSettings.zoom
      });
      disableSelectionTool();
    }
  }, []);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.width = 'auto';
      textAreaRef.current.style.width = `${textSpanRef.current.clientWidth + 12}px`;
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div
      className='c-text-editor'>
      <div
        className='c-text-editor__overlay'
        onClick={handleClose} />
      <textarea
        className='c-text-editor__textarea'
        ref={textAreaRef}
        value={text}
        onChange={handleTextChange}
        rows={1}
        style={{
          position: 'absolute',
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
          color: textSettings.fillColor,
          textAlign: textSettings.justification,
          transformOrigin: (() => {
            switch(textSettings.justification) {
              case 'left':
                return 'left top';
              case 'center':
                return 'center top';
              case 'right':
                return 'right top';
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
          color: textSettings.fillColor,
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
  return { textEditor, textSettings, layerItem, canvasSettings };
};

export default connect(
  mapStateToProps,
  { closeTextEditor, disableSelectionTool, enableSelectionTool, setLayerText, selectLayer }
)(TextEditorInput);