import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerMaskedIconProps {
  layer: string;
  isEnabled?: boolean;
  isSelected?: boolean;
}

const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, isEnabled, isSelected } = props;

  useEffect(() => {
    console.log('LAYER MASKED ICON');
  }, []);

  return (
    isEnabled
    ? <div
        className='c-sidebar-layer__icon'
        >
        <Icon
          name='masked'
          style={{
            fill: isSelected
            ? theme.text.onPrimary
            : theme.text.lighter
          }} />
      </div>
    : null
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerMaskedIconProps): {
  isEnabled?: boolean;
  isSelected?: boolean;
} => {
  const { layer } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const isEnabled = layerItem.masked && !layerItem.mask;
  const isSelected = layerItem.selected;
  return { isEnabled, isSelected };
};

export default connect(
  mapStateToProps
)(SidebarLayerMaskedIcon);