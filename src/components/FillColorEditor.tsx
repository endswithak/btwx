/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeFillColorEditor } from '../store/actions/fillColorEditor';
import { FillColorEditorTypes } from '../store/actionTypes/fillColorEditor';
import { openFillLinearGradientEditor } from '../store/actions/fillLinearGradientEditor';
import { FillLinearGradientEditorTypes, OpenFillLinearGradientEditorPayload } from '../store/actionTypes/fillLinearGradientEditor';
import { openFillRadialGradientEditor } from '../store/actions/fillRadialGradientEditor';
import { FillRadialGradientEditorTypes, OpenFillRadialGradientEditorPayload } from '../store/actionTypes/fillRadialGradientEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { FillColorEditorState } from '../store/reducers/fillColorEditor';
import ColorPicker from './ColorPicker';
import { SetLayerFillTypePayload, SetLayerFillGradientTypePayload, SetLayerFillGradientPayload, SetLayerFillColorPayload, SetLayerFillPayload ,LayerTypes } from '../store/actionTypes/layer';
import { setLayerFill, setLayerFillType, setLayerFillGradientType, setLayerFillGradient, setLayerFillColor } from '../store/actions/layer';
import FillTypeSelector from './FillTypeSelector';
import debounce from 'lodash.debounce';
import chroma from 'chroma-js';

interface FillEditorProps {
  layerItem?: em.Layer;
  fill?: em.Fill;
  fillColorEditor?: FillColorEditorState;
  closeFillColorEditor?(): FillColorEditorTypes;
  openFillLinearGradientEditor?(payload: OpenFillLinearGradientEditorPayload): FillLinearGradientEditorTypes;
  openFillRadialGradientEditor?(payload: OpenFillRadialGradientEditorPayload): FillRadialGradientEditorTypes;
  disableSelectionTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setLayerFillGradient?(payload: SetLayerFillGradientPayload): LayerTypes;
  setLayerFillType?(payload: SetLayerFillTypePayload): LayerTypes;
  setLayerFillGradientType?(payload: SetLayerFillGradientTypePayload): LayerTypes;
  setLayerFill?(payload: SetLayerFillPayload): LayerTypes;
}

const FillColorEditor = (props: FillEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { layerItem, fill, fillColorEditor, closeFillColorEditor, disableSelectionTool, enableSelectionTool, setLayerFillColor, openFillLinearGradientEditor, openFillRadialGradientEditor, setLayerFillType, setLayerFillGradientType } = props;
  const [fillColor, setFillColor] = useState(fillColorEditor.color);
  const debounceFillColor = useCallback(
    debounce((dFillColor: string) => setLayerFillColor({id: fillColorEditor.layer, fillColor: dFillColor}), 150),
    []
  );

  useEffect(() => {
    onOpen();
    return () => {
      onClose();
    }
  }, []);

  const onOpen = () => {
    disableSelectionTool();
    document.addEventListener('mousedown', onMouseDown, false);
  }

  const onClose = () => {
    enableSelectionTool();
    document.removeEventListener('mousedown', onMouseDown);
  }

  const onMouseDown = (event: any) => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      closeFillColorEditor();
    }
  }

  const handleFillColorChange = (fillColor: string) => {
    debounceFillColor(fillColor);
  }

  const handleLinearGradientClick = () => {
    setLayerFillType({id: fillColorEditor.layer, fillType: 'gradient'});
    if (fill.gradient.gradientType !== 'linear') {
      setLayerFillGradientType({id: fillColorEditor.layer, gradientType: 'linear'});
    }
    closeFillColorEditor();
    openFillLinearGradientEditor({
      layer: fillColorEditor.layer,
      gradient: {
        ...fill.gradient,
        gradientType: 'linear'
      },
      x: fillColorEditor.x,
      y: fillColorEditor.y
    });
  }

  const handleRadialGradientClick = () => {
    setLayerFillType({id: fillColorEditor.layer, fillType: 'gradient'});
    if (fill.gradient.gradientType !== 'radial') {
      setLayerFillGradientType({id: fillColorEditor.layer, gradientType: 'radial'});
    }
    closeFillColorEditor();
    openFillRadialGradientEditor({
      layer: fillColorEditor.layer,
      gradient: {
        ...fill.gradient,
        gradientType: 'radial'
      },
      x: fillColorEditor.x,
      y: fillColorEditor.y
    });
  }

  return (
    <div
      ref={editorRef}
      className='c-fill-editor'>
      <div
        className='c-fill-editor__picker'
        style={{
          top: fillColorEditor.y,
          //transform: `translate(8px, ${fillColorEditor.y}px)`,
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
          colorValue={fillColor}
          colorType='rgb'
          onChange={handleFillColorChange} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillColorEditor, layer } = state;
  const layerItem = layer.present.byId[fillColorEditor.layer];
  const fill = layerItem.style.fill;
  return { fillColorEditor, layerItem, fill };
};

export default connect(
  mapStateToProps,
  {
    closeFillColorEditor,
    disableSelectionTool,
    enableSelectionTool,
    setLayerFillType,
    setLayerFillGradientType,
    setLayerFillGradient,
    setLayerFillColor,
    setLayerFill,
    openFillLinearGradientEditor,
    openFillRadialGradientEditor
  }
)(FillColorEditor);