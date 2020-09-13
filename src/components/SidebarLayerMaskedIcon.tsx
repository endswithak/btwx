import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerMaskedIconProps {
  layer: em.Layer;
  maskedParent: boolean;
  dragGhost: boolean;
}

const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, dragGhost, maskedParent } = props;

  return (
    layer.masked
    ? <div
        className='c-sidebar-layer__icon'
        >
        <Icon
          name={layer.mask ? 'masked-mask' : 'masked'}
          style={{
            fill: layer.selected && !dragGhost
            ? theme.text.onPrimary
            : theme.text.lighter
          }} />
      </div>
    : maskedParent
      ? <div
        className='c-sidebar-layer__icon c-sidebar-layer__icon--chevron'
        style={{
          pointerEvents: 'none'
        }} />
      : null
  );
}

export default SidebarLayerMaskedIcon;