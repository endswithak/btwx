import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandShadowStyles, collapseShadowStyles } from '../store/actions/rightSidebar';
import SidebarCollapseSection from './SidebarCollapseSection';
import ColorInput from './ColorInput';
import ShadowToggle from './ShadowToggle';
import ShadowParamsInput from './ShadowParamsInput';

const SidebarShadowStyles = (): ReactElement => {
  const validFillSelection = useSelector((state: RootState) => state.layer.present.selected.every((id: string) => state.layer.present.byId[id] && state.layer.present.byId[id].type !== 'Artboard' && state.layer.present.byId[id].type !== 'Group'));
  const shadowStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.shadowStylesCollapsed);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (shadowStylesCollapsed) {
      dispatch(expandShadowStyles());
    } else {
      dispatch(collapseShadowStyles());
    }
  }

  return (
    validFillSelection
    ? <SidebarCollapseSection
        onClick={handleClick}
        header='shadow'
        collapsed={shadowStylesCollapsed}
        actions={[
          <ShadowToggle key='shadowToggle' />
        ]}>
        <ColorInput prop='shadow' />
        <ShadowParamsInput />
      </SidebarCollapseSection>
    : null
  );
}

export default SidebarShadowStyles;