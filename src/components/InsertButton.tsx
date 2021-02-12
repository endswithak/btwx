/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef, useState } from 'react';
import sharp from 'sharp';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleArtboardToolThunk} from '../store/actions/artboardTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { addImageThunk } from '../store/actions/layer';
import TopbarDropdownButton from './TopbarDropdownButton';
import ListGroup from './ListGroup';
import ListItem from './ListItem';
import StackedButton from './StackedButton';

const InsertButton = (): ReactElement => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeTool = useSelector((state: RootState) => state.canvasSettings.activeTool);
  const shapeToolShapeType = useSelector((state: RootState) => state.shapeTool.shapeType);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
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

  const handleImageClick = (): void => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      filters: [
        { name: 'Images', extensions: ['jpg', 'png'] }
      ],
      properties: ['openFile']
    }).then(result => {
      if (result.filePaths.length > 0 && !result.canceled) {
        sharp(result.filePaths[0]).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
          dispatch(addImageThunk({
            layer: {
              frame: {
                x: 0,
                y: 0,
                width: info.width,
                height: info.height,
                innerWidth: info.width,
                innerHeight: info.height
              },
              originalDimensions: {
                width: info.width,
                height: info.height
              }
            },
            buffer: data
          }));
        });
      }
    });
  }

  const getInsertButtonIcon = () => {
    switch(activeTool) {
      case 'Shape':
        switch(shapeToolShapeType) {
          case 'Rectangle':
            return 'rectangle';
          case 'Rounded':
            return 'rounded';
          case 'Ellipse':
            return 'ellipse';
          case 'Star':
            return 'star';
          case 'Polygon':
            return 'polygon';
          case 'Line':
            return 'line';
        }
        break;
      case 'Text':
        return 'text';
      case 'Artboard':
        return 'artboard';
      default:
        return 'insert';
    }
  }

  return (
    <div
      className='c-topbar-dropdown-button'
      ref={dropdownRef}>
      <StackedButton
        label='Insert'
        onClick={handleClick}
        iconName={getInsertButtonIcon()}
        size='small'
        isActive={showDropdown || activeTool === 'Artboard' || activeTool === 'Shape' || activeTool === 'Text'} />
      {
        showDropdown
        ? <div className='c-topbar-dropdown-button__dropdown c-topbar-dropdown-button__dropdown--left'>
            <ListGroup>
              <ListItem
                onClick={() => dispatch(toggleArtboardToolThunk())}
                isActive={activeTool === 'Artboard'}
                interactive>
                <ListItem.Icon name='artboard' />
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Artboard
                  </ListItem.Text>
                </ListItem.Body>
                <ListItem.Right>
                  <ListItem.Text
                    size='small'
                    variant={
                      activeTool === 'Artboard'
                      ? 'lighter-on-primary'
                      : 'lighter'
                    }>
                    A
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                onClick={() => dispatch(toggleShapeToolThunk('Rectangle'))}
                isActive={activeTool === 'Shape' && shapeToolShapeType === 'Rectangle'}
                disabled={activeArtboard === null}
                interactive>
                <ListItem.Icon name='rectangle' />
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Rectangle
                  </ListItem.Text>
                </ListItem.Body>
                <ListItem.Right>
                  <ListItem.Text
                    size='small'
                    variant={
                      activeTool === 'Shape' && shapeToolShapeType === 'Rectangle'
                      ? 'lighter-on-primary'
                      : 'lighter'
                    }>
                    R
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                onClick={() => dispatch(toggleShapeToolThunk('Rounded'))}
                isActive={activeTool === 'Shape' && shapeToolShapeType === 'Rounded'}
                disabled={activeArtboard === null}
                interactive>
                <ListItem.Icon name='rounded' />
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Rounded
                  </ListItem.Text>
                </ListItem.Body>
                <ListItem.Right>
                  <ListItem.Text
                    size='small'
                    variant={
                      activeTool === 'Shape' && shapeToolShapeType === 'Rounded'
                      ? 'lighter-on-primary'
                      : 'lighter'
                    }>
                    U
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                onClick={() => dispatch(toggleShapeToolThunk('Ellipse'))}
                isActive={activeTool === 'Shape' && shapeToolShapeType === 'Ellipse'}
                disabled={activeArtboard === null}
                interactive>
                <ListItem.Icon name='ellipse' />
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Ellipse
                  </ListItem.Text>
                </ListItem.Body>
                <ListItem.Right>
                  <ListItem.Text
                    size='small'
                    variant={
                      activeTool === 'Shape' && shapeToolShapeType === 'Ellipse'
                      ? 'lighter-on-primary'
                      : 'lighter'
                    }>
                    O
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                onClick={() => dispatch(toggleShapeToolThunk('Star'))}
                isActive={activeTool === 'Shape' && shapeToolShapeType === 'Star'}
                disabled={activeArtboard === null}
                interactive>
                <ListItem.Icon name='star' />
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Star
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                onClick={() => dispatch(toggleShapeToolThunk('Polygon'))}
                isActive={activeTool === 'Shape' && shapeToolShapeType === 'Polygon'}
                disabled={activeArtboard === null}
                interactive>
                <ListItem.Icon name='polygon' />
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Polygon
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
              <ListItem
                onClick={() => dispatch(toggleShapeToolThunk('Line'))}
                isActive={activeTool === 'Shape' && shapeToolShapeType === 'Line'}
                disabled={activeArtboard === null}
                interactive>
                <ListItem.Icon name='line' />
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Line
                  </ListItem.Text>
                </ListItem.Body>
                <ListItem.Right>
                  <ListItem.Text
                    size='small'
                    variant={
                      activeTool === 'Shape' && shapeToolShapeType === 'Line'
                      ? 'lighter-on-primary'
                      : 'lighter'
                    }>
                    L
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                onClick={() => dispatch(toggleTextToolThunk())}
                isActive={activeTool === 'Text'}
                disabled={activeArtboard === null}
                interactive>
                <ListItem.Icon name='text' />
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Text
                  </ListItem.Text>
                </ListItem.Body>
                <ListItem.Right>
                  <ListItem.Text
                    size='small'
                    variant={
                      activeTool === 'Text'
                      ? 'lighter-on-primary'
                      : 'lighter'
                    }>
                    T
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                onClick={handleImageClick}
                disabled={activeArtboard === null}
                interactive>
                <ListItem.Icon name='image' />
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Image
                  </ListItem.Text>
                </ListItem.Body>
              </ListItem>
            </ListGroup>
          </div>
        : null
      }
    </div>
    // <TopbarDropdownButton
    //   dropdownPosition='left'
    //   label='Insert'
    //   icon={getInsertButtonIcon()}
    //   isActive={ activeTool === 'Artboard' || activeTool === 'Shape' || activeTool === 'Text' }
    //   options={[{
    //     label: 'Artboard',
    //     onClick: () => dispatch(toggleArtboardToolThunk()),
    //     icon: 'artboard',
    //     isActive: activeTool === 'Artboard',
    //     bottomDivider: true
    //   },{
    //     label: 'Rectangle',
    //     onClick: () => dispatch(toggleShapeToolThunk('Rectangle')),
    //     icon: 'rectangle',
    //     isActive: activeTool === 'Shape' && shapeToolShapeType === 'Rectangle',
    //     disabled: activeArtboard === null
    //   },{
    //     label: 'Rounded',
    //     onClick: () => dispatch(toggleShapeToolThunk('Rounded')),
    //     icon: 'rounded',
    //     isActive: activeTool === 'Shape' && shapeToolShapeType === 'Rounded',
    //     disabled: activeArtboard === null
    //   },{
    //     label: 'Ellipse',
    //     onClick: () => dispatch(toggleShapeToolThunk('Ellipse')),
    //     icon: 'ellipse',
    //     isActive: activeTool === 'Shape' && shapeToolShapeType === 'Ellipse',
    //     disabled: activeArtboard === null
    //   },{
    //     label: 'Star',
    //     onClick: () => dispatch(toggleShapeToolThunk('Star')),
    //     icon: 'star',
    //     isActive: activeTool === 'Shape' && shapeToolShapeType === 'Star',
    //     disabled: activeArtboard === null
    //   },{
    //     label: 'Polygon',
    //     onClick: () => dispatch(toggleShapeToolThunk('Polygon')),
    //     icon: 'polygon',
    //     isActive: activeTool === 'Shape' && shapeToolShapeType === 'Polygon',
    //     disabled: activeArtboard === null
    //   },{
    //     label: 'Line',
    //     onClick: () => dispatch(toggleShapeToolThunk('Line')),
    //     icon: 'line',
    //     isActive: activeTool === 'Shape' && shapeToolShapeType === 'Line',
    //     disabled: activeArtboard === null
    //   },{
    //     label: 'Text',
    //     onClick: () => dispatch(toggleTextToolThunk()),
    //     icon: 'text',
    //     isActive: activeTool === 'Text',
    //     disabled: activeArtboard === null
    //   },{
    //     label: 'Image',
    //     onClick: handleImageClick,
    //     icon: 'image',
    //     disabled: activeArtboard === null
    //   }]} />
  );
}

export default InsertButton;