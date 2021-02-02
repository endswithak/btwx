import { v4 as uuidv4 } from 'uuid';
import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import Button from './Button';

const SidebarArtboardPlatformAdd = (): ReactElement => {
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
    <Button
      text='Add Custom Size...'
      onClick={handleClick}
      active={artboardPresetEditor.isOpen} />
  );
}

export default SidebarArtboardPlatformAdd;