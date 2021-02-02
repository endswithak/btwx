import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { showLayerChildren, hideLayerChildren } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerChevronProps {
  id: string;
  isOpen: boolean;
  isDragGhost?: boolean;
  setOpen?(isOpen: boolean): void;
}

const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, isDragGhost, isOpen, setOpen } = props;
  const canOpen = useSelector((state: RootState) => state.layer.present.byId[id].type === 'Group' || state.layer.present.byId[id].type === 'Artboard');
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id].selected);
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();

  const handleMouseDown = (e: any) => {
    e.stopPropagation();
    // setOpen(!isOpen);
    if (isOpen) {
      dispatch(hideLayerChildren({id}));
    } else {
      dispatch(showLayerChildren({id}));
    }
  }

  useEffect(() => {
    console.log('LAYER CHEVRON');
  }, []);

  return (
    <div
      className='c-sidebar-layer__icon c-sidebar-layer__icon--chevron'
      id={`${id}-open-icon`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={canOpen ? handleMouseDown : null}
      onMouseUp={() => setHover(true)}
      style={{
        pointerEvents: canOpen ? 'auto' : 'none'
      }}>
      {
        canOpen
        ? <Icon
            name={isOpen ? 'thicc-chevron-down' : 'thicc-chevron-right'}
            size='small'
            style={{
              fill: isSelected
              ? theme.text.onPrimary
              : hover
                ? theme.text.base
                : theme.text.lighter
            }} />
        : null
      }
    </div>
  );
}

export default SidebarLayerChevron;