import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeTextEditor } from '../store/actions/textEditor';
import { TextEditorTypes } from '../store/actionTypes/textEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { setLayerFillColor, setLayerStrokeColor, setLayerShadowColor, setLayerText, selectLayer } from '../store/actions/layer';
import { SetLayerFillColorPayload, SetLayerStrokeColorPayload, SetLayerShadowColorPayload, SetLayerTextPayload, SelectLayerPayload, LayerTypes } from '../store/actionTypes/layer';
import { paperMain } from '../canvas';
import gsap from 'gsap';

interface TextEditorProps {
  textEditor?: {
    isOpen: boolean;
    layer: string;
    text: string;
    scale: number;
    x: number;
    y: number;
    textStyle: em.TextStyle;
  };
  textLayer?: em.Text;
  closeTextEditor?(): TextEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  setLayerText?(payload: SetLayerTextPayload): ToolTypes;
  selectLayer?(payload: SelectLayerPayload): ToolTypes;
}

const TextEditor = (props: TextEditorProps): ReactElement => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textSpanRef = useRef<HTMLTextAreaElement>(null);
  const minTextSpanRef = useRef<HTMLTextAreaElement>(null);
  const theme = useContext(ThemeContext);
  const { textEditor, textLayer, closeTextEditor, disableSelectionTool, enableSelectionTool, setLayerText, selectLayer } = props;
  const [text, setText] = useState(textEditor.text);

  const handleTextChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setText(target.value);
  }

  const handleClose = () => {
    closeTextEditor();
    enableSelectionTool();
    setLayerText({id: textEditor.layer, text });
    paperMain.project.getItem({data: { id: textEditor.layer }}).visible = true;
    selectLayer({id: textEditor.layer, newSelection: true });
  }

  useEffect(() => {
    if (textAreaRef.current && textEditor.isOpen) {
      if (paperMain.project.getItem({data: { id: 'selectionFrame' }})) {
        paperMain.project.getItem({data: { id: 'selectionFrame' }}).remove();
      }
      paperMain.project.getItem({data: { id: textEditor.layer }}).visible = false;
      setText(textEditor.text);
      textAreaRef.current.focus();
      textAreaRef.current.select();
      textAreaRef.current.style.minWidth = `${minTextSpanRef.current.clientWidth}px`;
      textAreaRef.current.style.minHeight = `${textEditor.textStyle.leading}px`;
      const canvas = document.getElementById('canvas-main') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      const text = textEditor.text;
      ctx.font = `${textEditor.textStyle.fontSize}px ${textEditor.textStyle.fontFamily}`;
      const textMetrics = ctx.measureText(text);
      const boundingHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
      const boundingWhitespace = textEditor.textStyle.leading - boundingHeight;
      const baseline = (boundingWhitespace / 2) + textMetrics.actualBoundingBoxAscent + (textMetrics.actualBoundingBoxDescent / 2);
      gsap.set(textAreaRef.current, {x: textEditor.x, y: textEditor.y - (baseline * textEditor.scale), scale: textEditor.scale});
    }
  }, [textEditor.isOpen]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.width = 'auto';
      textAreaRef.current.style.width = `${textSpanRef.current.clientWidth + 4}px`;
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    textEditor.isOpen
    ? <div
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
            fontFamily: textEditor.textStyle.fontFamily,
            fontSize: textEditor.textStyle.fontSize,
            lineHeight: `${textEditor.textStyle.leading}px`,
            color: textEditor.textStyle.fillColor,
            textAlign: textEditor.textStyle.justification,
            transformOrigin: 'top left'
          }} />
        <span
          className='c-text-editor__span'
          ref={textSpanRef}
          style={{
            fontFamily: textEditor.textStyle.fontFamily,
            fontSize: textEditor.textStyle.fontSize,
            lineHeight: `${textEditor.textStyle.leading}px`,
            color: textEditor.textStyle.fillColor,
            textAlign: textEditor.textStyle.justification
          }}>
          {text}
        </span>
        <span
          className='c-text-editor__span'
          ref={minTextSpanRef}
          style={{
            fontFamily: textEditor.textStyle.fontFamily,
            fontSize: textEditor.textStyle.fontSize,
            lineHeight: `${textEditor.textStyle.leading}px`,
            color: textEditor.textStyle.fillColor,
            textAlign: textEditor.textStyle.justification,
          }}>
          A
        </span>
      </div>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { textEditor, layer } = state;
  const textLayer = textEditor.layer ? layer.present.byId[textEditor.layer] : null;
  return { textEditor, textLayer };
};

export default connect(
  mapStateToProps,
  { closeTextEditor, setLayerFillColor, setLayerStrokeColor, setLayerShadowColor, disableSelectionTool, enableSelectionTool, setLayerText, selectLayer }
)(TextEditor);

// Modal.setAppElement('#root');

// interface TextEditorProps {
//   textEditor?: {
//     isOpen: boolean;
//     layer: string;
//     text: string;
//     scale: number;
//     x: number;
//     y: number;
//     textStyle: em.TextStyle;
//   };
//   closeTextEditor?(): TextEditorTypes;
//   disableSelectionTool?(): ToolTypes;
//   enableSelectionTool?(): ToolTypes;
// }

// const TextEditor = (props: TextEditorProps): ReactElement => {
//   const textAreaRef = useRef<HTMLTextAreaElement>(null);
//   const textSpanRef = useRef<HTMLTextAreaElement>(null);
//   const minTextSpanRef = useRef<HTMLTextAreaElement>(null);
//   const theme = useContext(ThemeContext);
//   const { textEditor, closeTextEditor, disableSelectionTool, enableSelectionTool } = props;
//   const [text, setText] = useState('');

//   const handleCloseRequest = () => {
//     closeTextEditor();
//   }

//   const handleAfterOpen = () => {
//     disableSelectionTool();
//     setText(textEditor.text);
//     textAreaRef.current.focus();
//     textAreaRef.current.select();
//     textAreaRef.current.style.minWidth = `${minTextSpanRef.current.clientWidth}px`;
//     textAreaRef.current.style.minHeight = `${minTextSpanRef.current.clientHeight}px`;
//     textAreaRef.current.style.width = 'auto';
//     textAreaRef.current.style.width = `${textSpanRef.current.clientWidth + 5}px`;
//     textAreaRef.current.style.height = 'auto';
//     textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + 5}px`;
//     gsap.set(textAreaRef.current, {x: textEditor.x, y: textEditor.y, scale: textEditor.scale});
//   }

//   const handleAfterClose = () => {
//     enableSelectionTool();
//     //paperMain.project.getItem({data: { id: textEditor.layer }}).visible = true;
//   }

//   const handleTextChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
//     const target = e.target as HTMLTextAreaElement;
//     setText(target.value);
//   }

//   useEffect(() => {
//     if (textAreaRef.current) {
//       textAreaRef.current.style.width = 'auto';
//       textAreaRef.current.style.width = `${textSpanRef.current.clientWidth + 4}px`;
//       textAreaRef.current.style.height = 'auto';
//       textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + 4}px`;
//     }
//   }, [text]);

//   return (
//     <Modal
//       className='c-text-editor'
//       overlayClassName='c-text-editor__overlay'
//       isOpen={textEditor.isOpen}
//       onAfterOpen={handleAfterOpen}
//       onAfterClose={handleAfterClose}
//       shouldCloseOnEsc={true}
//       shouldCloseOnOverlayClick={true}
//       onRequestClose={handleCloseRequest}
//       contentLabel='text-editor'>
//       <textarea
//         className={'c-text-editor__textarea'}
//         ref={textAreaRef}
//         value={text}
//         onChange={handleTextChange}
//         rows={1}
//         style={{
//           // top: textEditor.y,
//           // left: textEditor.x,
//           fontFamily: textEditor.textStyle.fontFamily,
//           fontSize: textEditor.textStyle.fontSize,
//           lineHeight: `${textEditor.textStyle.leading}px`,
//           color: textEditor.textStyle.fillColor,
//           textAlign: textEditor.textStyle.justification,
//           transformOrigin: 'left bottom',
//           boxSizing: 'border-box'
//         }} />
//       <span
//         className={'c-text-editor__span'}
//         ref={textSpanRef}
//         style={{
//           fontFamily: textEditor.textStyle.fontFamily,
//           fontSize: textEditor.textStyle.fontSize,
//           lineHeight: `${textEditor.textStyle.leading}px`,
//           color: textEditor.textStyle.fillColor,
//           textAlign: textEditor.textStyle.justification
//         }}>
//         {text}
//       </span>
//       <span
//         className={'c-text-editor__span'}
//         ref={minTextSpanRef}
//         style={{
//           fontFamily: textEditor.textStyle.fontFamily,
//           fontSize: textEditor.textStyle.fontSize,
//           lineHeight: `${textEditor.textStyle.leading}px`,
//           color: textEditor.textStyle.fillColor,
//           textAlign: textEditor.textStyle.justification,
//         }}>
//         A
//       </span>
//     </Modal>
//   );
// }

// const mapStateToProps = (state: RootState) => {
//   const { textEditor } = state;
//   return { textEditor };
// };

// export default connect(
//   mapStateToProps,
//   { closeTextEditor, setLayerFillColor, setLayerStrokeColor, setLayerShadowColor, disableSelectionTool, enableSelectionTool }
// )(TextEditor);