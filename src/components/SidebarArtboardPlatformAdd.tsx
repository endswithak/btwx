import { v4 as uuidv4 } from 'uuid';
import React, { useContext, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { ThemeContext } from './ThemeProvider';

interface AddCustomButtonProps {
  isActive?: boolean;
}

const AddCustomButton = styled.button<AddCustomButtonProps>`
  background: ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
  color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
  :hover {
    background: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
    color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
  }
`;

const SidebarArtboardPlatformAdd = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const artboardPresetEditor = useSelector((state: RootState) => state.artboardPresetEditor);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(openArtboardPresetEditor({
      id: uuidv4(),
      category: artboardPresetEditor.category,
      type: artboardPresetEditor.type,
      width: artboardPresetEditor.width,
      height: artboardPresetEditor.height
    }));
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

export default SidebarArtboardPlatformAdd;