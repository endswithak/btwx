import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarLayer from './SidebarLayer';
import { getLayersById } from '../store/selectors/layer';

interface SidebarLayerDragGhostsProps {
  selected?: string[];
  leftSidebarWidth?: number;
  byId?: {
    [id: string]: Btwx.Layer;
  };
}

const SidebarLayerDragGhosts = (props: SidebarLayerDragGhostsProps): ReactElement => {
  const { selected, leftSidebarWidth, byId } = props;

  return (
    <div
      id='sidebarDragGhosts'
      style={{
        position: 'fixed',
        width: leftSidebarWidth,
        left: 999999999999,
        opacity: 0.5
      }}>
      {
        selected.map((layer, index) => {
          const layerItem = byId[layer];
          const { id, name, type, mask, underlyingMask, ignoreUnderlyingMask, masked, selected, hover, pathData, scope } = layerItem;
          return (
            <SidebarLayer
              key={index}
              id={id}
              name={name}
              type={type}
              mask={mask}
              underlyingMask={underlyingMask}
              ignoreUnderlyingMask={ignoreUnderlyingMask}
              masked={masked}
              selected={selected}
              hover={hover}
              pathData={pathData}
              closed={closed}
              nestingLevel={scope.length - 1}
              isOpen={false}
              setOpen={null}
              style={{}}
              isDragGhost />
          )
        })
      }
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const { layer, viewSettings } = state;
  const selected = [...layer.present.selected].reverse();
  const leftSidebarWidth = viewSettings.leftSidebar.width;
  const byId = getLayersById(state);
  return { selected, leftSidebarWidth, byId };
};

export default connect(
  mapStateToProps
)(SidebarLayerDragGhosts);