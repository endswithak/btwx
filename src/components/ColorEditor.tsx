import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeColorEditor } from '../store/actions/colorEditor';
import { ColorEditorTypes } from '../store/actionTypes/colorEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import ColorPicker from './ColorPicker';

Modal.setAppElement('#root');

interface ColorEditorProps {
  colorEditor?: {
    isOpen: boolean;
    layer: string;
    color: string;
    //prop: em.ColorEditorProp;
    x: number;
    y: number;
    onChange?(color: string): void;
    onClose?(color: string): void;
  };
  layerType?: em.LayerType;
  closeColorEditor?(): ColorEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
}

const Editor = styled.div`
  .sketch-picker {
    /* background: ${props => props.theme.background.z2} !important; */
    background: none !important;
    font-family: 'Space Mono' !important;
    /* box-shadow: 0 0 0 1px ${props => props.theme.background.z4} inset !important; */
    box-shadow: none !important;
    ::selection {
      background: ${props => props.theme.palette.primary} !important;
    }
  }
  input {
    background: ${props => props.theme.background.z4} !important;
    color: ${props => props.theme.text.base} !important;
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
    width: 100% !important;
    font-family: 'Space Mono' !important;
    border-radius: ${props => props.theme.unit}px !important;
    ::selection {
      background: ${props => props.theme.palette.primary} !important;
    }
    :focus {
      box-shadow: 0 0 0 1px ${props => props.theme.palette.primary} !important;
    }
  }
  span {
    color: ${props => props.theme.text.lighter} !important;
    ::selection {
      background: ${props => props.theme.palette.primary} !important;
    }
  }
`;

const ColorEditor = (props: ColorEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { colorEditor, closeColorEditor, disableSelectionTool, enableSelectionTool } = props;
  const [color, setColor] = useState(colorEditor.color);

  const handleCloseRequest = () => {
    if (colorEditor.onClose) {
      colorEditor.onClose(color);
    }
    closeColorEditor();
  }

  const handleAfterOpen = () => {
    disableSelectionTool();
    setColor(colorEditor.color);
  }

  const handleAfterClose = () => {
    enableSelectionTool();
  }

  const handleColorChange = (color: string) => {
    if (colorEditor.onChange) {
      colorEditor.onChange(color);
    }
  }

  return (
    <Modal
      className='c-color-editor'
      overlayClassName='c-color-editor__overlay'
      isOpen={colorEditor.isOpen}
      onAfterOpen={handleAfterOpen}
      onAfterClose={handleAfterClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleCloseRequest}
      style={{
        content: {
          //width: 220,
          width: 220,
          //height: 240,
          top: colorEditor.y,
          left: colorEditor.x,
          background: theme.background.z1,
          boxShadow: `0 0 0 1px ${theme.background.z4}`
        }
      }}
      contentLabel='color-editor'>
      {
        colorEditor.isOpen && color
        ? <ColorPicker
            colorValue={color}
            colorType='rgb'
            onChange={handleColorChange} />
        : null
      }
    </Modal>
  );
}

const mapStateToProps = (state: RootState) => {
  const { colorEditor } = state;
  return { colorEditor };
};

export default connect(
  mapStateToProps,
  { closeColorEditor, disableSelectionTool, enableSelectionTool }
)(ColorEditor);