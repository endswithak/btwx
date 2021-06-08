import React, { ReactElement, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setInsertArtboardThunk, setInsertShapeRectangleThunk, setInsertShapeRoundedThunk, setInsertShapeEllipseThunk, setInsertShapePolygonThunk, setInsertShapeStarThunk, setInsertShapeLineThunk, setInsertTextThunk, setInsertImageThunk } from '../store/actions/keyBindings';
import PreferencesBindingInput from './PreferencesBindingInput';
import SidebarSectionHead from './SidebarSectionHead';
import ListGroup from './ListGroup';

const PreferencesBindingsInsert = (): ReactElement => {
  const artboard = useSelector((state: RootState) => state.keyBindings.insert.artboard);
  const rectangle = useSelector((state: RootState) => state.keyBindings.insert.shape.rectangle);
  const rounded = useSelector((state: RootState) => state.keyBindings.insert.shape.rounded);
  const ellipse = useSelector((state: RootState) => state.keyBindings.insert.shape.ellipse);
  const star = useSelector((state: RootState) => state.keyBindings.insert.shape.star);
  const polygon = useSelector((state: RootState) => state.keyBindings.insert.shape.polygon);
  const line = useSelector((state: RootState) => state.keyBindings.insert.shape.line);
  const text = useSelector((state: RootState) => state.keyBindings.insert.text);
  const image = useSelector((state: RootState) => state.keyBindings.insert.image);

  return (
    <div className='c-preferences__tab-section'>
      <div className='c-preferences__input-group'>
        <SidebarSectionHead
          text='Insert' />
        <ListGroup>
          <PreferencesBindingInput
            binding={artboard}
            onChange={setInsertArtboardThunk}
            title='Artboard'
            icon='artboard'
            storeKey='insert.artboard' />
          <PreferencesBindingInput
            binding={rectangle}
            onChange={setInsertShapeRectangleThunk}
            title='Rectangle'
            icon='rectangle'
            storeKey='insert.shape.rectangle' />
          <PreferencesBindingInput
            binding={rounded}
            onChange={setInsertShapeRoundedThunk}
            title='Rounded'
            icon='rounded'
            storeKey='insert.shape.rounded' />
          <PreferencesBindingInput
            binding={ellipse}
            onChange={setInsertShapeEllipseThunk}
            title='Ellipse'
            icon='ellipse'
            storeKey='insert.shape.ellipse' />
          <PreferencesBindingInput
            binding={star}
            onChange={setInsertShapeStarThunk}
            title='Star'
            icon='star'
            storeKey='insert.shape.star' />
          <PreferencesBindingInput
            binding={polygon}
            onChange={setInsertShapePolygonThunk}
            title='Polygon'
            icon='polygon'
            storeKey='insert.shape.polygon' />
          <PreferencesBindingInput
            binding={line}
            onChange={setInsertShapeLineThunk}
            title='Line'
            icon='line'
            storeKey='insert.shape.line' />
          <PreferencesBindingInput
            binding={text}
            onChange={setInsertTextThunk}
            title='Text'
            icon='text'
            storeKey='insert.text' />
          <PreferencesBindingInput
            binding={image}
            onChange={setInsertImageThunk}
            title='Image'
            icon='image'
            storeKey='insert.image' />
        </ListGroup>
      </div>
    </div>
  );
};

export default PreferencesBindingsInsert;