import React, { useContext, ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarLayerTitleInput from './SidebarLayerTitleInput';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerTitleProps {
  id: string;
  isDragGhost?: boolean;
}

const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, isDragGhost } = props;
  const name = useSelector((state: RootState) => state.layer.present.byId[id].name);
  const isArtboard = useSelector((state: RootState) => state.layer.present.byId[id].type === 'Artboard');
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id].selected);
  const editing = useSelector((state: RootState) => state.leftSidebar.editing === id && !isDragGhost);

  useEffect(() => {
    console.log('LAYER TITLE');
  }, []);

  return (
    <div
      className={`
        c-sidebar-layer__name
        ${editing
          ? 'c-sidebar-layer__name--editing'
          : null
        }
        ${isArtboard
          ? 'c-sidebar-layer__name--artboard'
          : null
        }`
      }
      style={{
        color: isSelected && !isDragGhost
        ? theme.text.onPalette.primary
        : theme.text.base
      }}>
      {
        editing
        ? <SidebarLayerTitleInput
            id={id} />
        : name
      }
    </div>
  );
}

export default SidebarLayerTitle;