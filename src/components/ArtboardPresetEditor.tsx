/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ArtboardPresetEditorState } from '../store/reducers/artboardPresetEditor';
import { ThemeContext } from './ThemeProvider';
import tinyColor from 'tinycolor2';
import { closeArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { ArtboardPresetEditorTypes } from '../store/actionTypes/artboardPresetEditor';
import { setArtboardToolDevicePlatform } from '../store/actions/tool';
import { ToolTypes, SetArtboardToolDevicePlatformPayload } from '../store/actionTypes/tool';
import { addArtboardPreset, updateArtboardPreset } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, AddArtboardPresetPayload, UpdateArtboardPresetPayload } from '../store/actionTypes/canvasSettings';
import SidebarInput from './SidebarInput';

interface ArtboardPresetEditorProps {
  exists?: boolean;
  artboardPresetEditor?: ArtboardPresetEditorState;
  platformType?: em.DevicePlatformType;
  closeArtboardPresetEditor?(): ArtboardPresetEditorTypes;
  setArtboardToolDevicePlatform?(payload: SetArtboardToolDevicePlatformPayload): ToolTypes;
  addArtboardPreset?(payload: AddArtboardPresetPayload): CanvasSettingsTypes;
  updateArtboardPreset?(payload: UpdateArtboardPresetPayload): CanvasSettingsTypes;
}

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

const ArtboardPresetEditor = (props: ArtboardPresetEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { exists, closeArtboardPresetEditor, platformType, artboardPresetEditor, addArtboardPreset, updateArtboardPreset, setArtboardToolDevicePlatform } = props;
  const [name, setName] = useState(artboardPresetEditor.type);
  const [width, setWidth] = useState(artboardPresetEditor.width);
  const [height, setHeight] = useState(artboardPresetEditor.height);

  const handleNameChange = (e: any) => {
    const target = e.target;
    setName(target.value);
  };

  const handleWidthChange = (e: any) => {
    const target = e.target;
    if (!isNaN(target.value)) {
      setWidth(target.value);
    }
  };

  const handleHeightChange = (e: any) => {
    const target = e.target;
    if (!isNaN(target.value)) {
      setHeight(target.value);
    }
  };

  const handleSave = () => {
    if (exists) {
      updateArtboardPreset({
        id: artboardPresetEditor.id,
        type: name.replace(/\s/g, '').length > 0 ? name : 'Custom',
        width: width,
        height: height
      });
    } else {
      addArtboardPreset({
        id: artboardPresetEditor.id,
        type: name.replace(/\s/g, '').length > 0 ? name : 'Custom',
        width: width,
        height: height
      });
    }
    setArtboardToolDevicePlatform({
      platform: 'Custom'
    });
    closeArtboardPresetEditor();
  }

  return (
    <div
      className='c-artboard-preset-editor-wrap'>
      <div
        className='c-artboard-preset-editor-overlay'
        onClick={closeArtboardPresetEditor} />
      <div
        className='c-artboard-preset-editor'
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
                backdropFilter: theme.name === 'dark' ? 'brightness(400%)' : 'opacity(400%)'
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
                disableSelectionToolToggle
                selectOnMount />
            </div>
            <div className='c-artboard-preset-editor__size-input'>
              <SidebarInput
                value={width}
                onChange={handleWidthChange}
                onSubmit={handleSave}
                bottomLabel={'Width'}
                label='px'
                disableSelectionToolToggle />
              <SidebarInput
                value={height}
                onChange={handleHeightChange}
                onSubmit={handleSave}
                bottomLabel={'Height'}
                label='px'
                disableSelectionToolToggle />
            </div>
          </div>
          <div className='c-artboard-preset-editor__buttons'>
            <CancelButton
              className='c-artboard-preset-editor__button c-artboard-preset-editor__button--cancel'
              theme={theme}
              onClick={closeArtboardPresetEditor}>
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
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { artboardPresetEditor, tool, canvasSettings } = state;
  const platformType = tool.artboardToolDevicePlatform;
  const exists = canvasSettings.artboardPresets.allIds.includes(artboardPresetEditor.id);
  return { artboardPresetEditor, platformType, exists };
};

export default connect(
  mapStateToProps,
  { closeArtboardPresetEditor, addArtboardPreset, updateArtboardPreset, setArtboardToolDevicePlatform }
)(ArtboardPresetEditor);