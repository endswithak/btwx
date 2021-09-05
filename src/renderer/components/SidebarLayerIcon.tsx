import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import Icon from './Icon';
import ShapeIcon from './ShapeIcon';

interface SidebarLayerIconProps {
  id: string;
  isDragGhost?: boolean;
  isSelected?: boolean;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const { id, isDragGhost } = props;
  const isActiveArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard === id);
  const type = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].type : null);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].selected);
  const isMask = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).mask);
  const isOpenShape = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Shape' && !(state.layer.present.byId[id] as Btwx.Shape).closed);
  const selected = typeof props.isSelected === 'boolean' ? props.isSelected : isSelected;

  return (
    <div
      className={`c-sidebar-layer__icon`}
      id={`${id}-icon`}>
      {
        type === 'Shape' || type === 'CompoundShape'
        ? <ShapeIcon
            id={id}
            size='small'
            variant={
              isOpenShape || isMask
              ? null
              : selected && !isDragGhost
                ? 'base-on-primary'
                : isActiveArtboard
                  ? 'primary'
                  : 'lighter'
            }
            outline={isOpenShape || isMask} />
        : <Icon
            name={(() => {
              switch(type) {
                case 'Artboard':
                  return 'artboard'
                case 'Group':
                  return 'folder';
                case 'Text':
                  return 'text';
                case 'Image':
                  return 'image';
              }
            })()}
            size={type === 'Text' ? 'small' : null}
            variant={
              selected && !isDragGhost
              ? 'base-on-primary'
              : isActiveArtboard
                ? 'primary'
                : 'lighter'
            } />
      }
    </div>
  );
}

export default SidebarLayerIcon;