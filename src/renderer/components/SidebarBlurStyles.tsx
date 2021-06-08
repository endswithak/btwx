import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandBlurStyles, collapseBlurStyles } from '../store/actions/rightSidebar';
import SidebarCollapseSection from './SidebarCollapseSection';
import BlurInput from './BlurInput';
import BlurToggle from './BlurToggle';

const SidebarBlurStyles = (): ReactElement => {
  const validSelection = useSelector((state: RootState) => state.layer.present.selected.every((id) => state.layer.present.byId[id].type !== 'Group' && state.layer.present.byId[id].type !== 'Artboard'));
  const blurStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.blurStylesCollapsed);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (blurStylesCollapsed) {
      dispatch(expandBlurStyles());
    } else {
      dispatch(collapseBlurStyles());
    }
  }

  return (
    validSelection
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={blurStylesCollapsed}
        header='blur'
        actions={[
          <BlurToggle key='blurToggle' />
        ]}>
        <BlurInput />
      </SidebarCollapseSection>
    : null
  );
}

export default SidebarBlurStyles;