import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeFillEditor } from '../store/actions/fillEditor';
import { FillEditorTypes } from '../store/actionTypes/fillEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { FillEditorState } from '../store/reducers/fillEditor';

Modal.setAppElement('#root');

interface FillEditorProps {
  fillEditor?: FillEditorState;
  pickerColor?: string;
  closeFillEditor?(): FillEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
}

const FillEditor = (props: FillEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { fillEditor, pickerColor, closeFillEditor, disableSelectionTool, enableSelectionTool } = props;
  const [fill, setFill] = useState(fillEditor.fill);
  const [activePickerColor, setActivePickerColor] = useState(pickerColor);

  const handleCloseRequest = () => {
    if (fillEditor.onClose) {
      fillEditor.onClose(fill);
    }
    closeFillEditor();
  }

  const handleAfterOpen = () => {
    disableSelectionTool();
    setFill(fillEditor.fill);
  }

  const handleAfterClose = () => {
    enableSelectionTool();
  }

  return (
    <Modal
      className='c-color-editor'
      overlayClassName='c-color-editor__overlay'
      isOpen={fillEditor.isOpen}
      onAfterOpen={handleAfterOpen}
      onAfterClose={handleAfterClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleCloseRequest}
      style={{
        content: {
          width: 220,
          height: 240,
          top: fillEditor.y,
          left: fillEditor.x,
          background: theme.background.z1,
          boxShadow: `0 0 0 1px ${theme.background.z4} inset`
        }
      }}
      contentLabel='fill-editor'>

    </Modal>
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillEditor } = state;
  const pickerColor = (() => {
    switch(fillEditor.fill.fillType) {
      case 'color':
        return fillEditor.fill.color;
      case 'gradient':
        return fillEditor.fill.gradient.stops[0].color;
    }
  })();
  return { fillEditor, pickerColor };
};

export default connect(
  mapStateToProps,
  { closeFillEditor, disableSelectionTool, enableSelectionTool }
)(FillEditor);