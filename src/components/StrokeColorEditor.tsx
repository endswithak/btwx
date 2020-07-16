/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeStrokeColorEditor } from '../store/actions/strokeColorEditor';
import { StrokeColorEditorTypes } from '../store/actionTypes/strokeColorEditor';
import { openStrokeGradientEditor } from '../store/actions/strokeGradientEditor';
import { StrokeGradientEditorTypes, OpenStrokeGradientEditorPayload } from '../store/actionTypes/strokeGradientEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { StrokeColorEditorState } from '../store/reducers/strokeColorEditor';
import ColorPicker from './ColorPicker';
import { SetLayerStrokeFillTypePayload, SetLayerStrokeGradientTypePayload, SetLayerStrokeGradientPayload, SetLayerStrokeColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerStrokeColor, setLayerStrokeFillType, setLayerStrokeGradientType, setLayerStrokeGradient } from '../store/actions/layer';
import FillTypeSelector from './FillTypeSelector';
import debounce from 'lodash.debounce';
import chroma from 'chroma-js';

interface StrokeEditorProps {
  layerItem?: em.Layer;
  stroke?: em.Stroke;
  strokeColorEditor?: StrokeColorEditorState;
  closeStrokeColorEditor?(): StrokeColorEditorTypes;
  openStrokeGradientEditor?(payload: OpenStrokeGradientEditorPayload): StrokeGradientEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  setLayerStrokeColor?(payload: SetLayerStrokeColorPayload): LayerTypes;
  setLayerStrokeGradient?(payload: SetLayerStrokeGradientPayload): LayerTypes;
  setLayerStrokeFillType?(payload: SetLayerStrokeFillTypePayload): LayerTypes;
  setLayerStrokeGradientType?(payload: SetLayerStrokeGradientTypePayload): LayerTypes;
}

const StrokeColorEditor = (props: StrokeEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { layerItem, stroke, strokeColorEditor, closeStrokeColorEditor, setLayerStrokeColor, setLayerStrokeGradientType, openStrokeGradientEditor, setLayerStrokeFillType } = props;
  const debounceStrokeColor = useCallback(
    debounce((dStrokeColor: em.Color) => setLayerStrokeColor({id: strokeColorEditor.layer, strokeColor: dStrokeColor}), 150),
    []
  );

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown, false);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  const onMouseDown = (event: any) => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      closeStrokeColorEditor();
    }
  }

  const handleStrokeColorChange = (strokeColor: em.Color) => {
    debounceStrokeColor(strokeColor);
  }

  const handleLinearGradientClick = () => {
    setLayerStrokeFillType({id: strokeColorEditor.layer, fillType: 'gradient'});
    if (stroke.gradient.gradientType !== 'linear') {
      setLayerStrokeGradientType({id: strokeColorEditor.layer, gradientType: 'linear'});
    }
    closeStrokeColorEditor();
    openStrokeGradientEditor({
      layer: strokeColorEditor.layer,
      gradient: {
        ...stroke.gradient,
        gradientType: 'linear'
      },
      x: strokeColorEditor.x,
      y: strokeColorEditor.y
    });
  }

  const handleRadialGradientClick = () => {
    setLayerStrokeFillType({id: strokeColorEditor.layer, fillType: 'gradient'});
    if (stroke.gradient.gradientType !== 'radial') {
      setLayerStrokeGradientType({id: strokeColorEditor.layer, gradientType: 'radial'});
    }
    closeStrokeColorEditor();
    openStrokeGradientEditor({
      layer: strokeColorEditor.layer,
      gradient: {
        ...stroke.gradient,
        gradientType: 'radial'
      },
      x: strokeColorEditor.x,
      y: strokeColorEditor.y
    });
  }

  return (
    <div
      ref={editorRef}
      className='c-fill-editor'>
      <div
        className='c-fill-editor__picker'
        style={{
          top: strokeColorEditor.y,
          background: chroma(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).alpha(0.88).hex(),
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
        }}>
        <FillTypeSelector
          colorSelector={{
            enabled: true,
            onClick: () => {return;},
            isActive: true
          }}
          linearGradientSelector={{
            enabled: true,
            onClick: handleLinearGradientClick,
            isActive: false
          }}
          radialGradientSelector={{
            enabled: true,
            onClick: handleRadialGradientClick,
            isActive: false
          }} />
        <ColorPicker
          colorValue={stroke.color}
          colorType='rgb'
          onChange={handleStrokeColorChange} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { strokeColorEditor, layer } = state;
  const layerItem = layer.present.byId[strokeColorEditor.layer];
  const stroke = layerItem.style.stroke;
  return { strokeColorEditor, layerItem, stroke };
};

export default connect(
  mapStateToProps,
  {
    closeStrokeColorEditor,
    disableSelectionTool,
    enableSelectionTool,
    setLayerStrokeFillType,
    setLayerStrokeGradientType,
    setLayerStrokeGradient,
    setLayerStrokeColor,
    openStrokeGradientEditor
  }
)(StrokeColorEditor);