import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerMaskedIconProps {
  layer: string;
  dragGhost: boolean;
  layerItem?: em.Layer;
}

const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, dragGhost, layerItem } = props;

  return (
    layerItem.masked && !layerItem.mask
    ? <div
        className='c-sidebar-layer__icon'
        >
        <Icon
          name={layerItem.mask ? 'masked-mask' : 'masked'}
          style={{
            fill: layerItem.selected && !dragGhost
            ? theme.text.onPrimary
            : theme.text.lighter
          }} />
      </div>
    : null
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerMaskedIconProps): {
  layerItem?: em.Layer;
} => {
  const { layer } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  return { layerItem };
};

export default connect(
  mapStateToProps
)(SidebarLayerMaskedIcon);