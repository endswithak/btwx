/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeShadowColorEditor } from '../store/actions/shadowColorEditor';
import { ShadowColorEditorTypes } from '../store/actionTypes/shadowColorEditor';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { ShadowColorEditorState } from '../store/reducers/shadowColorEditor';
import ColorPicker from './ColorPicker';
import { SetLayerShadowColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerShadowColor } from '../store/actions/layer';
import debounce from 'lodash.debounce';
import chroma from 'chroma-js';

interface ShadowEditorProps {
  layerItem?: em.Layer;
  shadow?: em.Shadow;
  shadowColorEditor?: ShadowColorEditorState;
  closeShadowColorEditor?(): ShadowColorEditorTypes;
  setLayerShadowColor?(payload: SetLayerShadowColorPayload): LayerTypes;
}

const ShadowColorEditor = (props: ShadowEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const editorRef = useRef<HTMLDivElement>(null);
  const { layerItem, shadow, shadowColorEditor, closeShadowColorEditor, setLayerShadowColor } = props;
  const debounceShadowColor = useCallback(
    debounce((dShadowColor: em.Color) => setLayerShadowColor({id: shadowColorEditor.layer, shadowColor: dShadowColor}), 150),
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
      closeShadowColorEditor();
    }
  }

  const handleShadowColorChange = (shadowColor: em.Color) => {
    debounceShadowColor(shadowColor);
  }

  return (
    <div
      ref={editorRef}
      className='c-fill-editor'>
      <div
        className='c-fill-editor__picker'
        style={{
          top: shadowColorEditor.y,
          background: chroma(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).alpha(0.88).hex(),
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
        }}>
        <ColorPicker
          colorValue={shadow.color}
          colorType='rgb'
          onChange={handleShadowColorChange} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { shadowColorEditor, layer } = state;
  const layerItem = layer.present.byId[shadowColorEditor.layer];
  const shadow = layerItem.style.shadow;
  return { shadowColorEditor, layerItem, shadow };
};

export default connect(
  mapStateToProps,
  {
    closeShadowColorEditor,
    disableSelectionTool,
    enableSelectionTool,
    setLayerShadowColor
  }
)(ShadowColorEditor);