/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPrettyAccelerator } from '../utils';
import { toggleArtboardToolThunk} from '../store/actions/artboardTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
// import { insertImageThunk } from '../store/actions/layer';
import ListGroup from './ListGroup';
import ListItem from './ListItem';
import StackedButton from './StackedButton';
import InsertImageListItem from './InsertImageListItem';
import Icon from './Icon';

const InsertButton = (): ReactElement => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const artboardAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.insert.artboard));
  const rectangleAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.insert.shape.rectangle));
  const roundedAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.insert.shape.rounded));
  const ellipseAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.insert.shape.ellipse));
  const starAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.insert.shape.star));
  const polygonAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.insert.shape.polygon));
  const lineAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.insert.shape.line));
  const textAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.insert.text));
  // const imageAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.insert.image));
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
    document.addEventListener('mousedown', onMouseDown);
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
        size='small'
        isActive={showDropdown || activeTool === 'Artboard' || activeTool === 'Shape' || activeTool === 'Text'}>
        <Icon
          size='small'
          name={getInsertButtonIcon()} />
      </StackedButton>
      {
        showDropdown
        ? <div className='c-topbar-dropdown-button__dropdown c-topbar-dropdown-button__dropdown--left'>
            <ListGroup as='div'>
              <ListItem
                as='button'
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
                    { artboardAccelerator }
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                as='button'
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
                    { rectangleAccelerator }
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                as='button'
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
                    { roundedAccelerator }
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                as='button'
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
                    { ellipseAccelerator }
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                as='button'
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
                <ListItem.Right>
                  <ListItem.Text
                    size='small'
                    variant={
                      activeTool === 'Shape' && shapeToolShapeType === 'Star'
                      ? 'lighter-on-primary'
                      : 'lighter'
                    }>
                    { starAccelerator }
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                as='button'
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
                <ListItem.Right>
                  <ListItem.Text
                    size='small'
                    variant={
                      activeTool === 'Shape' && shapeToolShapeType === 'Polygon'
                      ? 'lighter-on-primary'
                      : 'lighter'
                    }>
                    { polygonAccelerator }
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                as='button'
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
                    { lineAccelerator }
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <ListItem
                as='button'
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
                    { textAccelerator }
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem>
              <InsertImageListItem />
              {/* <ListItem
                onClick={() => dispatch(insertImageThunk())}
                disabled={activeArtboard === null}
                interactive>
                <ListItem.Icon name='image' />
                <ListItem.Body>
                  <ListItem.Text size='small'>
                    Image
                  </ListItem.Text>
                </ListItem.Body>
                <ListItem.Right>
                  <ListItem.Text
                    size='small'
                    variant='lighter'>
                    { imageAccelerator }
                  </ListItem.Text>
                </ListItem.Right>
              </ListItem> */}
            </ListGroup>
          </div>
        : null
      }
    </div>
  );
}

export default InsertButton;