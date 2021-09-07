import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import capitalize from 'lodash.capitalize';
import { RootState } from '../store/reducers';
import ListItem from './ListItem';
import IconButton from './IconButton';

interface SidebarLayerGroupEventTweensButtonProps {
  id: string;
  searchTree?: boolean;
  isDragGhost?: boolean;
  isSelected?: boolean;
}

const SidebarLayerBoolButton = (props: SidebarLayerGroupEventTweensButtonProps): ReactElement => {
  const { id, isDragGhost, searchTree } = props;
  const bool = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[id] as Btwx.Shape | Btwx.CompoundShape).bool);
  const theme = useSelector((state: RootState) => state.preferences.theme);
  const instanceId = useSelector((state: RootState) => state.session.instance);

  const buildContextMenu = () => {
    const boolTypes = ['none', 'unite', 'subtract', 'intersect', 'exclude'];
    return boolTypes.reduce((result, current) => {
      const item = {
        label: capitalize(current),
        type: 'checkbox',
        checked: bool === current,
        click: {
          id: 'setLayerBool',
          params: {
            id: id,
            bool: current
          }
        }
      }
      if (current === 'none') {
        result = [...result, item, { type: 'separator' }];
      } else {
        result = [...result, item];
      }
      return result;
    }, []);
  }

  const handleMouseDown = (e: any) => {
    e.stopPropagation();
    (window as any).api.openBoolContextMenu(JSON.stringify({
      instanceId: instanceId,
      template: buildContextMenu(),
      theme: theme
    }));
  }

  return (
    !isDragGhost
    ? <ListItem.Right>
        <div
        className={`c-sidebar-layer__icon c-sidebar-layer__icon--chevron`}
        id={searchTree ? `search-tree-${id}-group-event-tweens-icon` : `${id}-group-event-tweens-icon`}>
          <IconButton
            iconName={`combine-${bool}`}
            size='small'
            onMouseDown={handleMouseDown} />
        </div>
      </ListItem.Right>
    : null
  );
}

export default SidebarLayerBoolButton;