import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarLayerTitleInput from './SidebarLayerTitleInput';

interface SidebarLayerTitleProps {
  id: string;
  isDragGhost?: boolean;
}

const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
  const { id, isDragGhost } = props;
  const name = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].name : null);
  const isArtboard = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].type === 'Artboard' : null);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].selected : false);
  const editing = useSelector((state: RootState) => state.leftSidebar.editing === id && !isDragGhost);

  return (
    <div className={`c-sidebar-layer__name${
      editing
      ? `${' '}c-sidebar-layer__name--editing`
      : ''
    }${
      isArtboard
      ? `${' '}c-sidebar-layer__name--artboard`
      : ''
    }${
      isSelected
      ? `${' '}c-sidebar-layer__name--selected`
      : ''
    }${
      isDragGhost
      ? `${' '}c-sidebar-layer__name--drag-ghost`
      : ''
    }`}>
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