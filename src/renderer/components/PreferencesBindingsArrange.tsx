import React, { ReactElement, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArrangeBringForwardThunk, setArrangeBringToFrontThunk, setArrangeSendBackwardThunk, setArrangeSendToBackThunk, setArrangeAlignLeftThunk,  setArrangeAlignCenterThunk, setArrangeAlignRightThunk, setArrangeAlignTopThunk, setArrangeAlignMiddleThunk, setArrangeAlignBottomThunk, setArrangeDistributeHorizontallyThunk, setArrangeDistributeVerticallyThunk, setArrangeGroupThunk, setArrangeUngroupThunk } from '../store/actions/keyBindings';
import PreferencesBindingInput from './PreferencesBindingInput';
import SidebarSectionHead from './SidebarSectionHead';
import ListGroup from './ListGroup';

const PreferencesBindingsArrange = (): ReactElement => {
  const bringForward = useSelector((state: RootState) => state.keyBindings.arrange.bringForward);
  const bringToFront = useSelector((state: RootState) => state.keyBindings.arrange.bringToFront);
  const sendBackward = useSelector((state: RootState) => state.keyBindings.arrange.sendBackward);
  const sendToBack = useSelector((state: RootState) => state.keyBindings.arrange.sendToBack);
  const alignLeft = useSelector((state: RootState) => state.keyBindings.arrange.align.left);
  const alignCenter = useSelector((state: RootState) => state.keyBindings.arrange.align.center);
  const alignRight = useSelector((state: RootState) => state.keyBindings.arrange.align.right);
  const alignTop = useSelector((state: RootState) => state.keyBindings.arrange.align.top);
  const alignMiddle = useSelector((state: RootState) => state.keyBindings.arrange.align.middle);
  const alignBottom = useSelector((state: RootState) => state.keyBindings.arrange.align.bottom);
  const distributeHorizontally = useSelector((state: RootState) => state.keyBindings.arrange.distribute.horizontally);
  const distributeVertically = useSelector((state: RootState) => state.keyBindings.arrange.distribute.vertically);
  const group = useSelector((state: RootState) => state.keyBindings.arrange.group);
  const ungroup = useSelector((state: RootState) => state.keyBindings.arrange.ungroup);

  return (
    <div className='c-preferences__tab-section'>
      <div className='c-preferences__input-group'>
        <SidebarSectionHead
          text='Arrange' />
        <ListGroup>
          <PreferencesBindingInput
            binding={bringForward}
            onChange={setArrangeBringForwardThunk}
            title='Bring Forward'
            icon='bring-forward'
            storeKey='arrange.bringForward' />
          <PreferencesBindingInput
            binding={bringToFront}
            onChange={setArrangeBringToFrontThunk}
            title='Bring To Front'
            icon='bring-to-front'
            storeKey='arrange.bringToFront' />
          <PreferencesBindingInput
            binding={sendBackward}
            onChange={setArrangeSendBackwardThunk}
            title='Send Backward'
            icon='send-backward'
            storeKey='arrange.sendBackward' />
          <PreferencesBindingInput
            binding={sendToBack}
            onChange={setArrangeSendToBackThunk}
            title='Send To Back'
            icon='send-to-back'
            storeKey='arrange.sendToBack' />
          <PreferencesBindingInput
            binding={alignLeft}
            onChange={setArrangeAlignLeftThunk}
            title='Align Left'
            icon='align-left'
            storeKey='arrange.align.left' />
          <PreferencesBindingInput
            binding={alignCenter}
            onChange={setArrangeAlignCenterThunk}
            title='Align Center'
            icon='align-center'
            storeKey='arrange.align.center' />
          <PreferencesBindingInput
            binding={alignRight}
            onChange={setArrangeAlignRightThunk}
            title='Align Right'
            icon='align-right'
            storeKey='arrange.align.right' />
          <PreferencesBindingInput
            binding={alignTop}
            onChange={setArrangeAlignTopThunk}
            title='Align Top'
            icon='align-top'
            storeKey='arrange.align.top' />
          <PreferencesBindingInput
            binding={alignMiddle}
            onChange={setArrangeAlignMiddleThunk}
            title='Align Middle'
            icon='align-middle'
            storeKey='arrange.align.middle' />
          <PreferencesBindingInput
            binding={alignBottom}
            onChange={setArrangeAlignBottomThunk}
            title='Align Bottom'
            icon='align-bottom'
            storeKey='arrange.align.bottom' />
          <PreferencesBindingInput
            binding={distributeHorizontally}
            onChange={setArrangeDistributeHorizontallyThunk}
            title='Distribute Horizontally'
            icon='distribute-horizontally'
            storeKey='arrange.distribute.horizontally' />
          <PreferencesBindingInput
            binding={distributeVertically}
            onChange={setArrangeDistributeVerticallyThunk}
            title='Distribute Vertically'
            icon='distribute-vertically'
            storeKey='arrange.distribute.vertically' />
          <PreferencesBindingInput
            binding={group}
            onChange={setArrangeGroupThunk}
            title='Group'
            icon='group'
            storeKey='arrange.group' />
          <PreferencesBindingInput
            binding={ungroup}
            onChange={setArrangeUngroupThunk}
            title='Ungroup'
            icon='ungroup'
            storeKey='arrange.ungroup' />
        </ListGroup>
      </div>
    </div>
  );
};

export default PreferencesBindingsArrange;