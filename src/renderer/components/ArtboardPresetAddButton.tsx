import { v4 as uuidv4 } from 'uuid';
import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import Button from './Button';

const ArtboardPresetAddButton = (): ReactElement => {
  const artboardPresetEditor = useSelector((state: RootState) => state.artboardPresetEditor);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(openArtboardPresetEditor({
      id: uuidv4(),
      category: artboardPresetEditor.category,
      type: artboardPresetEditor.type,
      width: artboardPresetEditor.width,
      height: artboardPresetEditor.height,
      new: true
    }));
  }

  return (
    <Button
      block
      onClick={handleClick}
      isActive={artboardPresetEditor.isOpen && artboardPresetEditor.new}
      size='small'>
      Add Custom Size...
    </Button>
  );
}

export default ArtboardPresetAddButton;