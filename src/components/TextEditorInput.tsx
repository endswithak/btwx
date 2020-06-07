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

interface TextEditorInputProps {
  textEditor?: TextEditorState;
  textSettings?: TextSettingsState;
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
  const { textEditor, textSettings, layerItem, closeTextEditor, disableSelectionTool, enableSelectionTool, setLayerText, selectLayer } = props;
  const [text, setText] = useState(layerItem.text);
  const [pos, setPos] = useState({x: textEditor.x, y: textEditor.y});

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
      paperMain.project.getItem({data: { id: textEditor.layer }}).visible = false;
      disableSelectionTool();
    }
  }, []);

  useEffect(() => {
    if (paperMain.project.getItem({data: { id: 'selectionFrame' }})) {
      paperMain.project.getItem({data: { id: 'selectionFrame' }}).remove();
    }
    if (paperMain.project.getItem({data: { id: 'hoverFrame' }})) {
      paperMain.project.getItem({data: { id: 'hoverFrame' }}).remove();
    }
    textAreaRef.current.focus();
    textAreaRef.current.select();
    const paperLayer = paperMain.project.getItem({data: { id: textEditor.layer }});
    const topLeft = paperMain.view.projectToView(paperLayer.bounds.topLeft);
    const topCenter = paperMain.view.projectToView(paperLayer.bounds.topCenter);
    const topRight = paperMain.view.projectToView(paperLayer.bounds.topRight);
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
            return topLeft.y;
          case 'center':
            return topCenter.y;
          case 'right':
            return topRight.y;
        }
      })()
    });
  }, [textSettings]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.width = 'auto';
      textAreaRef.current.style.width = `${textSpanRef.current.clientWidth + 4}px`;
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
      <div style={{
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
      }} />
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
          color: textSettings.fillColor,
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
          color: textSettings.fillColor,
          textAlign: textSettings.justification
        }}>
        {text}
      </span>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { textEditor, textSettings, layer } = state;
  const layerItem = (layer.present.byId[textEditor.layer] as em.Text);
  return { textEditor, textSettings, layerItem };
};

export default connect(
  mapStateToProps,
  { closeTextEditor, disableSelectionTool, enableSelectionTool, setLayerText, selectLayer }
)(TextEditorInput);