import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableGroupGroupEventTweens, disableGroupGroupEventTweens } from '../store/actions/layer';
import ToggleIconButton from './ToggleIconButton';
import ListItem from './ListItem';
import Icon from './Icon';

interface SidebarLayerGroupEventTweensButtonProps {
  id: string;
  searchTree?: boolean;
  isDragGhost?: boolean;
  isSelected?: boolean;
}

const SidebarLayerBoolButton = (props: SidebarLayerGroupEventTweensButtonProps): ReactElement => {
  const { id, isDragGhost, searchTree } = props;
  const bool = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[id] as Btwx.Shape | Btwx.CompoundShape).bool);
  const groupEventTweensAncestor = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].scope.some((sid) => state.layer.present.byId[sid] && state.layer.present.byId[sid].type === 'Group' && (state.layer.present.byId[sid] as Btwx.Group).groupEventTweens) : false);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].selected);
  const selected = typeof props.isSelected === 'boolean' ? props.isSelected : isSelected;
  const dispatch = useDispatch();

  // const handleChange = () => {
  //   if (groupEventTweens) {
  //     dispatch(disableGroupGroupEventTweens({id}));
  //   } else {
  //     dispatch(enableGroupGroupEventTweens({id}));
  //   }
  // }

  // const handleMouseDown = (e: any) => {
  //   e.stopPropagation();
  // }

  return (
    !isDragGhost && !groupEventTweensAncestor && bool !== 'none'
    ? <ListItem.Right>
        <div
        className={`c-sidebar-layer__icon c-sidebar-layer__icon--chevron`}
        id={searchTree ? `search-tree-${id}-group-event-tweens-icon` : `${id}-group-event-tweens-icon`}>
          <Icon
            name={`combine-${bool}`}
            size='small' />
          {/* <ToggleIconButton
            value={groupEventTweens}
            onMouseDown={handleMouseDown}
            type='checkbox'
            onChange={handleChange}
            size='small'
            checked={groupEventTweens}
            label={'Group Event Tweens'}
            iconName='lock-tweens'
            activeIconName='lock-tweens'
            variant={selected && groupEventTweens ? 'base-on-primary' : null} /> */}
        </div>
      </ListItem.Right>
    : null
  );
}

export default SidebarLayerBoolButton;