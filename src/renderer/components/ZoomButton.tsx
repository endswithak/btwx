/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useState, useRef } from 'react';
import { RootState } from '../store/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { zoomFitCanvasThunk, zoomPercentThunk, zoomFitSelectedThunk, zoomFitActiveArtboardThunk } from '../store/actions/zoomTool';
import ListGroup from './ListGroup';
import ListItem from './ListItem';
import StackedButton from './StackedButton';
import Text from './Text';

const ZoomButton = (): ReactElement => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const zoom = useSelector((state: RootState) => Math.round(state.documentSettings.matrix[0] * 100));
  const canArtboardZoom = useSelector((state: RootState) => state.layer.present.activeArtboard !== null)
  const canSelectedZoom = useSelector((state: RootState) => state.layer.present.selected.length > 0);
  const canCanvasZoom = useSelector((state: RootState) => state.layer.present.allIds.length > 1);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();

  const onMouseDown = (event: any): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
  }

  const onKeyDown = (e: any): void => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  }

  const handleClick = (event: React.SyntheticEvent): void => {
    showDropdown ? closeDropdown() : openDropdown();
  }

  const handleItemClick = (type: string | number): void => {
    switch(type) {
      case 50:
        dispatch(zoomPercentThunk(0.5));
        break;
      case 100:
        dispatch(zoomPercentThunk(1));
        break;
      case 200:
        dispatch(zoomPercentThunk(2));
        break;
      case 'fitCanvas':
        dispatch(zoomFitCanvasThunk());
        break;
      case 'fitSelected':
        dispatch(zoomFitSelectedThunk());
        break;
      case 'fitActiveArtboard':
        dispatch(zoomFitActiveArtboardThunk());
        break;
    }
    closeDropdown();
  }

  const closeDropdown = (): void => {
    setShowDropdown(false);
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('keydown', onKeyDown);
  }

  const openDropdown = (): void => {
    setShowDropdown(true);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
  }

  return (
    <div
      className='c-topbar-dropdown-button'
      ref={dropdownRef}>
      <StackedButton
        label='Zoom'
        onClick={handleClick}
        size='small'
        isActive={showDropdown}
        padded>
        <Text size='small'>
          {`${zoom}%`}
        </Text>
      </StackedButton>
      {
        showDropdown
        ? <div className='c-topbar-dropdown-button__dropdown c-topbar-dropdown-button__dropdown--left'>
            <ListGroup>
              <ListItem
                interactive
                onClick={() => handleItemClick(50)}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    50%
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                interactive
                onClick={() => handleItemClick(100)}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    100%
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                interactive
                onClick={() => handleItemClick(200)}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    200%
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                interactive
                onClick={() => handleItemClick('fitCanvas')}
                disabled={!canCanvasZoom}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Canvas
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                interactive
                onClick={() => handleItemClick('fitSelected')}
                disabled={!canSelectedZoom}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Selection
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                interactive
                onClick={() => handleItemClick('fitActiveArtboard')}
                disabled={!canArtboardZoom}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Active Artboard
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
            </ListGroup>
          </div>
        : null
      }
    </div>
  );
}

export default ZoomButton;