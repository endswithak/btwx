import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { openFillRuleSelector, closeFillRuleSelector } from '../store/actions/fillRuleSelector';
import ToggleIconButton from './ToggleIconButton';

const FillRuleToggle = (): ReactElement => {
  const controlRef = useRef(null);
  const fillRuleSelectorOpen = useSelector((state: RootState) => state.fillRuleSelector.isOpen);
  const isDisabled = useSelector((state: RootState) => !state.layer.present.selected.every((id) => state.layer.present.byId[id] && (state.layer.present.byId[id].type === 'Shape' || state.layer.present.byId[id].type === 'CompoundShape')));
  const dispatch = useDispatch();

  const handleOptionsClick = () => {
    if (!fillRuleSelectorOpen) {
      const sidebarRightScroll = document.getElementById('sidebar-scroll-right');
      const controlBox = controlRef.current.getBoundingClientRect();
      const sidebarBox = sidebarRightScroll.getBoundingClientRect();
      const scrollTop = sidebarRightScroll.scrollTop;
      dispatch(openFillRuleSelector({
        x: controlBox.x,
        y: (controlBox.y + scrollTop + controlBox.height + 8) - sidebarBox.top
      }));
    } else {
      dispatch(closeFillRuleSelector());
    }
  }

  return (
    <ToggleIconButton
      id='fill-rule-toggle'
      ref={controlRef}
      disabled={isDisabled}
      value={fillRuleSelectorOpen}
      type='checkbox'
      onChange={handleOptionsClick}
      iconName='more'
      checked={fillRuleSelectorOpen}
      label='fill rule'
      size='small' />
  );
}

export default FillRuleToggle;