import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandOpacityStyles, collapseOpacityStyles } from '../store/actions/rightSidebar';
import SidebarCollapseSection from './SidebarCollapseSection';
import OpacityInput from './OpacityInput';

const SidebarOpacityStyles = (): ReactElement => {
  const opacityStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.opacityStylesCollapsed);
  const isEnabled = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.layer.present.selected.every((id: string) => state.layer.present.byId[id].type !== 'Artboard' && state.layer.present.byId[id].type !== 'Group'));
  const dispatch = useDispatch();

  const handleClick = () => {
    if (opacityStylesCollapsed) {
      dispatch(expandOpacityStyles());
    } else {
      dispatch(collapseOpacityStyles());
    }
  }

  return (
    isEnabled
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={opacityStylesCollapsed}
        header='opacity'>
        <OpacityInput />
      </SidebarCollapseSection>
    : null
  );
}

export default SidebarOpacityStyles;