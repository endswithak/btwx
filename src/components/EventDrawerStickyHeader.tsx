import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover } from '../store/actions/layer';
import Icon from './Icon';
import ListItem from './ListItem';

interface EventDrawerStickyHeaderProps {
  scrollLayer: string;
}

const EventDrawerStickyHeader = (props: EventDrawerStickyHeaderProps): ReactElement => {
  const { scrollLayer } = props;
  const scrollLayerItem = useSelector((state: RootState) => scrollLayer ? state.layer.present.byId[scrollLayer] : null);
  const tweenEditing = useSelector((state: RootState) => state.eventDrawer.tweenEditing);
  const dispatch = useDispatch();

  const handleMouseEnter = (id: string): void => {
    if (!tweenEditing) {
      dispatch(setLayerHover({id}));
    }
  }

  const handleMouseLeave = (): void => {
    if (!tweenEditing) {
      dispatch(setLayerHover({id: null}));
    }
  }

  return (
    scrollLayerItem
    ? <div className='c-event-drawer-sticky-header'>
        <ListItem
          as='div'
          onMouseEnter={(): void => handleMouseEnter(scrollLayerItem.id)}
          onMouseLeave={handleMouseLeave}
          flush
          root>
          <Icon
            name={((): string => {
              switch(scrollLayerItem.type) {
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
            shapeId={
              scrollLayerItem.type === 'Shape'
              ? scrollLayerItem.id
              : null
            }
            size={scrollLayerItem.type === 'Shape' ? 'small' : null} />
          <ListItem.Body>
            <ListItem.Text size='small'>
              { scrollLayerItem.name }
            </ListItem.Text>
          </ListItem.Body>
        </ListItem>
      </div>
    : null
  );
}

export default EventDrawerStickyHeader;