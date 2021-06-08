import React, { useEffect, ReactElement, useState } from 'react';
import MenuArtboardPresetEdit from './MenuArtboardPresetEdit';
import MenuArtboardPresetDelete from './MenuArtboardPresetDelete';

interface ArtboardPresetContextMenuProps {
  setArtboardPresetContextMenu(artboardPresetContextMenu: any[] | null): void;
}

const ArtboardPresetContextMenu = (props: ArtboardPresetContextMenuProps): ReactElement => {
  const { setArtboardPresetContextMenu } = props;
  const [artboardPresetEdit, setArtboardPresetEdit] = useState(undefined);
  const [artboardPresetDelete, setArtboardPresetDelete] = useState(undefined);

  useEffect(() => {
    if (artboardPresetEdit && artboardPresetDelete) {
      setArtboardPresetContextMenu([
        artboardPresetEdit,
        artboardPresetDelete
      ]);
    }
  }, [artboardPresetEdit, artboardPresetDelete]);

  return (
    <>
      <MenuArtboardPresetEdit
        setArtboardPresetEdit={setArtboardPresetEdit} />
      <MenuArtboardPresetDelete
        setArtboardPresetDelete={setArtboardPresetDelete} />
    </>
  );
}

export default ArtboardPresetContextMenu;