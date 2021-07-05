import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableGroupGroupEventTweens, disableGroupGroupEventTweens } from '../store/actions/layer';
import ToggleIconButton from './ToggleIconButton';
import ListItem from './ListItem';

interface SidebarLayerGroupEventTweensButtonProps {
  id: string;
  searchTree?: boolean;
  isDragGhost?: boolean;
  isSelected?: boolean;
}

const SidebarLayerGroupEventTweensButton = (props: SidebarLayerGroupEventTweensButtonProps): ReactElement => {
  const { id, isDragGhost, searchTree } = props;
  const groupEventTweens = useSelector((state: RootState) => state.layer.present.byId[id] ? (state.layer.present.byId[id] as Btwx.Group).groupEventTweens : false);
  const groupEventTweensAncestor = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].scope.some((sid) => state.layer.present.byId[sid] && state.layer.present.byId[sid].type === 'Group' && (state.layer.present.byId[sid] as Btwx.Group).groupEventTweens) : false);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].selected);
  const selected = typeof props.isSelected === 'boolean' ? props.isSelected : isSelected;
  const dispatch = useDispatch();

  const handleChange = () => {
    if (groupEventTweens) {
      dispatch(disableGroupGroupEventTweens({id}));
    } else {
      dispatch(enableGroupGroupEventTweens({id}));
    }
  }

  return (
    !isDragGhost && groupEventTweens && !groupEventTweensAncestor
    ? <ListItem.Right>
        <div
        className={`c-sidebar-layer__icon c-sidebar-layer__icon--chevron`}
        id={searchTree ? `search-tree-${id}-group-event-tweens-icon` : `${id}-group-event-tweens-icon`}>
          <ToggleIconButton
            value={groupEventTweens}
            type='checkbox'
            onChange={handleChange}
            size='small'
            checked={groupEventTweens}
            label={'Group Event Tweens'}
            iconName='tweens'
            activeIconName='tweens'
            variant={selected && groupEventTweens ? 'base-on-primary' : null} />
        </div>
      </ListItem.Right>
    : null
  );
}

export default SidebarLayerGroupEventTweensButton;