/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { addArtboardPreset, updateArtboardPreset, setArtboardPresetDevicePlatform } from '../store/actions/documentSettings';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

const CancelButton = styled.button`
  background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
  color: ${props => props.theme.text.light};
  :hover {
    background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
    color: ${props => props.theme.text.base};
  }
`;

const SaveButton = styled.button`
  background: ${props => props.theme.palette.primary};
  box-shadow: 0 0 0 1px ${props => props.theme.palette.primary} inset;
  color: ${props => props.theme.text.onPrimary};
  :hover {
    background: ${props => props.theme.palette.primaryHover};
    box-shadow: 0 0 0 1px ${props => props.theme.palette.primaryHover} inset;
    color: ${props => props.theme.text.onPrimary};
  }
`;

const ArtboardPresetEditor = (): ReactElement => {
  const ref = useRef(null);
  const theme = useContext(ThemeContext);
  const artboardPresetEditor = useSelector((state: RootState) => state.artboardPresetEditor);
  // const platformType = useSelector((state: RootState) => state.documentSettings.artboardPresets.platform);
  const exists = useSelector((state: RootState) => state.documentSettings.artboardPresets.allIds.includes(state.artboardPresetEditor.id));
  // const canvasFocusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const [name, setName] = useState(artboardPresetEditor.type);
  const [width, setWidth] = useState(artboardPresetEditor.width);
  const [height, setHeight] = useState(artboardPresetEditor.height);
  const dispatch = useDispatch();

  const handleNameChange = (e: any): void => {
    const target = e.target;
    setName(target.value);
  };

  const handleWidthChange = (e: any): void => {
    const target = e.target;
    if (!isNaN(target.value)) {
      setWidth(target.value);
    }
  };

  const handleHeightChange = (e: any): void => {
    const target = e.target;
    if (!isNaN(target.value)) {
      setHeight(target.value);
    }
  };

  const handleKeyDown = (e: any): void => {
    if (e.key === 'Escape') {
      dispatch(closeArtboardPresetEditor());
    }
  };

  const handleMouseDown = (e: any): void => {
    if (!ref.current.contains(e.target)) {
      dispatch(closeArtboardPresetEditor());
    }
  };

  const handleSave = (): void => {
    if (exists) {
      dispatch(updateArtboardPreset({
        id: artboardPresetEditor.id,
        type: name.replace(/\s/g, '').length > 0 ? name : 'Custom',
        width: width,
        height: height
      }));
    } else {
      dispatch(addArtboardPreset({
        id: artboardPresetEditor.id,
        type: name.replace(/\s/g, '').length > 0 ? name : 'Custom',
        width: width,
        height: height
      }));
    }
    dispatch(setArtboardPresetDevicePlatform({
      platform: 'Custom'
    }));
    dispatch(closeArtboardPresetEditor());
  }

  useEffect(() => {
    dispatch(setCanvasFocusing({focusing: false}));
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      dispatch(setCanvasFocusing({focusing: true}));
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    }
  }, []);

  return (
    <div
      className='c-artboard-preset-editor'
      ref={ref}
      style={{
        background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.88).toRgbString(),
        boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
      }}>
      <div className='c-artboard-preset-editor__aside'>
        <div className='c-artboard-preset-editor__icon'>
          <div
            className='c-artboard-preset-editor-icon__plane c-artboard-preset-editor-icon__plane--bg'
            style={{
              background: theme.name === 'dark' ? theme.background.z4 : theme.background.z6
            }} />
          <div
            className='c-artboard-preset-editor-icon__plane c-artboard-preset-editor-icon__plane--fg'
            style={{
              background: tinyColor(theme.palette.primary).setAlpha(0.77).toRgbString(),
              backdropFilter: 'opacity(50%)'
            }} />
        </div>
        <p
          className='c-artboard-preset-editor__head'
          style={{
            color: theme.text.base
          }}>
          Custom Preset
        </p>
        <p
          className='c-artboard-preset-editor__body'
          style={{
            color: theme.text.lighter
          }}>
          Create custom presets for your frequently used artboard sizes.
        </p>
      </div>
      <div
        className='c-artboard-preset-editor__main'
        style={{
          background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
          boxShadow: `-1px 0 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
        }}>
        <div className='c-artboard-preset-editor__form'>
          <div className='c-artboard-preset-editor__name-input'>
            <SidebarInput
              value={name}
              onChange={handleNameChange}
              onSubmit={handleSave}
              bottomLabel={'Name'}
              selectOnMount
              manualCanvasFocus />
          </div>
          <div className='c-artboard-preset-editor__size-input'>
            <SidebarInput
              value={width}
              onChange={handleWidthChange}
              onSubmit={handleSave}
              bottomLabel={'Width'}
              label='px'
              manualCanvasFocus />
            <SidebarInput
              value={height}
              onChange={handleHeightChange}
              onSubmit={handleSave}
              bottomLabel={'Height'}
              label='px'
              manualCanvasFocus />
          </div>
        </div>
        <div className='c-artboard-preset-editor__buttons'>
          <CancelButton
            className='c-artboard-preset-editor__button c-artboard-preset-editor__button--cancel'
            theme={theme}
            onClick={() => dispatch(closeArtboardPresetEditor())}>
            Cancel
          </CancelButton>
          <SaveButton
            className='c-artboard-preset-editor__button c-artboard-preset-editor__button--save'
            theme={theme}
            onClick={handleSave}>
            Save
          </SaveButton>
        </div>
      </div>
    </div>
  );
}

export default ArtboardPresetEditor;