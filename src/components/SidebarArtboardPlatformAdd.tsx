import { v4 as uuidv4 } from 'uuid';
import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import styled from 'styled-components';
import { ArtboardPresetEditorState } from '../store/reducers/artboardPresetEditor';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { ArtboardPresetEditorTypes } from '../store/actionTypes/artboardPresetEditor';
import { ThemeContext } from './ThemeProvider';

interface SidebarArtboardPlatformAddProps {
  artboardPresetEditor?: ArtboardPresetEditorState;
  openArtboardPresetEditor?(payload: em.ArtboardPreset): ArtboardPresetEditorTypes;
  isActive?: boolean;
}

const AddCustomButton = styled.button<SidebarArtboardPlatformAddProps>`
  background: ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
  color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
  :hover {
    background: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
    color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
  }
`;

const SidebarArtboardPlatformAdd = (props: SidebarArtboardPlatformAddProps): ReactElement => {
  const { artboardPresetEditor, openArtboardPresetEditor } = props;
  const theme = useContext(ThemeContext);

  const handleClick = () => {
    openArtboardPresetEditor({
      id: uuidv4(),
      name: artboardPresetEditor.name,
      width: artboardPresetEditor.width,
      height: artboardPresetEditor.height
    })
  }

  return (
    <AddCustomButton
      theme={theme}
      onClick={handleClick}
      isActive={artboardPresetEditor.isOpen}>
      Add Custom Size...
    </AddCustomButton>
  );
}

const mapStateToProps = (state: RootState) => {
  const { artboardPresetEditor } = state;
  return { artboardPresetEditor };
};

export default connect(
  mapStateToProps,
  { openArtboardPresetEditor }
)(SidebarArtboardPlatformAdd);