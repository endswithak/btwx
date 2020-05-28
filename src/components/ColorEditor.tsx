import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import chroma from 'chroma-js';
import { SketchPicker } from 'react-color';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeColorEditor } from '../store/actions/colorEditor';
import { ColorEditorTypes } from '../store/actionTypes/colorEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { setLayerFillColor, setLayerStrokeColor, setLayerShadowColor } from '../store/actions/layer';
import { SetLayerFillColorPayload, SetLayerStrokeColorPayload, SetLayerShadowColorPayload, LayerTypes } from '../store/actionTypes/layer';

Modal.setAppElement('#root');

interface ColorEditorProps {
  colorEditor?: {
    isOpen: boolean;
    layer: string;
    color: string;
    prop: em.ColorEditorProp;
    x: number;
    y: number;
    onChange?(color: string): void;
  };
  closeColorEditor?(): ColorEditorTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setLayerStrokeColor?(payload: SetLayerStrokeColorPayload): LayerTypes;
  setLayerShadowColor?(payload: SetLayerShadowColorPayload): LayerTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
}

const Editor = styled.div`
  .sketch-picker {
    background: ${props => props.theme.background.z2} !important;
    font-family: 'Space Mono' !important;
    box-shadow: 0 0 0 1px ${props => props.theme.background.z4} inset !important;
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
  const { colorEditor, closeColorEditor, setLayerFillColor, setLayerStrokeColor, setLayerShadowColor, disableSelectionTool, enableSelectionTool } = props;
  const [color, setColor] = useState(colorEditor.color);

  const handleCloseRequest = () => {
    switch(colorEditor.prop) {
      case 'fillColor': {
        setLayerFillColor({id: colorEditor.layer, fillColor: color});
        break;
      }
      case 'strokeColor': {
        setLayerStrokeColor({id: colorEditor.layer, strokeColor: color});
        break;
      }
      case 'shadowColor': {
        setLayerShadowColor({id: colorEditor.layer, shadowColor: color});
        break;
      }
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

  const handleColorChange = (color, event) => {
    const newColor = chroma(color.rgb).hex();
    setColor(newColor);
    if (colorEditor.onChange) {
      colorEditor.onChange(newColor);
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
          background: 'none',
          width: 220,
          height: 237,
          top: colorEditor.y,
          left: colorEditor.x
        }
      }}
      contentLabel='color-editor'>
      {
        colorEditor.isOpen && color
        ? <Editor
            theme={theme}>
            <SketchPicker
              color={color}
              onChange={handleColorChange}
              presetColors={[]} />
          </Editor>
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
  { closeColorEditor, setLayerFillColor, setLayerStrokeColor, setLayerShadowColor, disableSelectionTool, enableSelectionTool }
)(ColorEditor);