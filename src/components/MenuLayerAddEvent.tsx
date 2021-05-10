import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { addSelectedEventThunk } from '../store/actions/layer';
import MenuLayerEvent from './MenuLayerEvent';

export const MENU_ITEM_ID = 'layerAddEvent';

interface MenuLayerAddEventProps {
  setAddEvent(combine: any): void;
}

const MenuLayerAddEvent = (props: MenuLayerAddEventProps): ReactElement => {
  const { setAddEvent } = props;
  const visible = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.layer.present.selected.every((id) => state.layer.present.byId[id].type !== 'Group'));
  const [mouseDown, setMouseDown] = useState(undefined);
  const [mouseUp, setMouseUp] = useState(undefined);
  const [mouseDrag, setMouseDrag] = useState(undefined);
  const [click, setClick] = useState(undefined);
  const [rightClick, setRightClick] = useState(undefined);
  const [doubleClick, setDoubleClick] = useState(undefined);
  const [mouseMove, setMouseMove] = useState(undefined);
  const [mouseEnter, setMouseEnter] = useState(undefined);
  const [mouseLeave, setMouseLeave] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    if (mouseDown && mouseUp && mouseDrag && click && rightClick && doubleClick && mouseEnter && mouseLeave) {
      setAddEvent({
        label: 'Add Event Listener...',
        visible,
        submenu: [
          mouseDown,
          mouseUp,
          mouseDrag,
          mouseEnter,
          mouseLeave,
          click,
          rightClick,
          doubleClick
        ]
      });
    }
  }, [visible, mouseDown, mouseUp, mouseDrag, click, rightClick, doubleClick, mouseEnter, mouseLeave]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (params: { event: Btwx.EventType; destinationArtboard: string }) => {
      const { event, destinationArtboard } = params;
      dispatch(addSelectedEventThunk(event, destinationArtboard));
    }
  }, []);

  return (
    <>
      <MenuLayerEvent
        eventListener={'mousedown'}
        label={'Mouse Down'}
        setEvent={setMouseDown} />
      <MenuLayerEvent
        eventListener={'mouseup'}
        label={'Mouse Up'}
        setEvent={setMouseUp} />
      <MenuLayerEvent
        eventListener={'mousedrag'}
        label={'Mouse Drag'}
        setEvent={setMouseDrag} />
      {/* <MenuLayerEvent
        event={'mousemove'}
        label={'Mouse Move'}
        setEvent={setMouseMove} /> */}
      <MenuLayerEvent
        eventListener={'mouseenter'}
        label={'Mouse Enter'}
        setEvent={setMouseEnter} />
      <MenuLayerEvent
        eventListener={'mouseleave'}
        label={'Mouse Leave'}
        setEvent={setMouseLeave} />
      <MenuLayerEvent
        eventListener={'click'}
        label={'Click'}
        setEvent={setClick} />
      <MenuLayerEvent
        eventListener={'rightclick'}
        label={'Right Click'}
        setEvent={setRightClick} />
      <MenuLayerEvent
        eventListener={'doubleclick'}
        label={'Double Click'}
        setEvent={setDoubleClick} />
    </>
  );
};

export default MenuLayerAddEvent;