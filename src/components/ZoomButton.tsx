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

  const handleClick = (event: React.SyntheticEvent): void => {
    showDropdown ? closeDropdown() : openDropdown();
    // if (onClick) {
    //   onClick(event);
    // }
  }

  const closeDropdown = (): void => {
    setShowDropdown(false);
    document.removeEventListener('mousedown', onMouseDown);
  }

  const openDropdown = (): void => {
    setShowDropdown(true);
    document.addEventListener('mousedown', onMouseDown, false);
  }

  return (
    <div
      className='c-topbar-dropdown-button'
      ref={dropdownRef}>
      <StackedButton
        label='Zoom'
        onClick={handleClick}
        size='small'
        isActive={showDropdown}>
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
                onClick={() => dispatch(zoomPercentThunk(0.5))}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    50%
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                interactive
                onClick={() => dispatch(zoomPercentThunk(1))}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    100%
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                interactive
                onClick={() => dispatch(zoomPercentThunk(2))}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    200%
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                interactive
                onClick={() => dispatch(zoomFitCanvasThunk())}
                disabled={!canCanvasZoom}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Canvas
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                interactive
                onClick={() => dispatch(zoomFitSelectedThunk())}
                disabled={!canSelectedZoom}>
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Selection
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                interactive
                onClick={() => dispatch(zoomFitActiveArtboardThunk())}
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
      {/* <TopbarDropdownButton
        dropdownPosition='left'
        label='Zoom'
        text={`${zoom}%`}
        options={[{
          label: '50%',
          onClick: () => dispatch(zoomPercentThunk(0.5))
        },{
          label: '100%',
          onClick: () => dispatch(zoomPercentThunk(1))
        },{
          label: '200%',
          onClick: () => dispatch(zoomPercentThunk(2)),
          bottomDivider: true
        },{
          label: 'Canvas',
          onClick: () => dispatch(zoomFitCanvasThunk()),
          disabled: !canCanvasZoom
        },{
          label: 'Selection',
          onClick: () => dispatch(zoomFitSelectedThunk()),
          disabled: !canSelectedZoom
        },{
          label: 'Active Artboard',
          onClick: () => dispatch(zoomFitActiveArtboardThunk()),
          disabled: !canArtboardZoom
        }]} /> */}
    </div>
  );
}

export default ZoomButton;