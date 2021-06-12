import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import Icon from './Icon';

interface SidebarLayerIconProps {
  id: string;
  isDragGhost?: boolean;
  isSelected?: boolean;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const { id, isDragGhost } = props;
  const type = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].type : null);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].selected);
  const isMask = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).mask);
  const isOpenShape = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Shape' && !(state.layer.present.byId[id] as Btwx.Shape).closed);
  const selected = typeof props.isSelected === 'boolean' ? props.isSelected : isSelected;

  return (
    <div
      className={`c-sidebar-layer__icon`}
      id={`${id}-icon`}>
      <Icon
        name={(() => {
          switch(type) {
            case 'Artboard':
              return 'artboard'
            case 'Group':
              return 'folder';
            case 'Shape':
              return 'shape';
            case 'Text':
              return 'text';
            case 'Image':
              return 'image';
          }
        })()}
        size={(type === 'Shape' || type === 'Text') ? 'small' : null}
        shapeId={type === 'Shape' ? id : null}
        variant={
          isOpenShape || isMask
          ? null
          : selected && !isDragGhost
            ? 'base-on-primary'
            : 'lighter'
        }
        outline={isOpenShape || isMask} />
    </div>
  );
}

export default SidebarLayerIcon;