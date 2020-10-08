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
    layer.masked && !layer.mask
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
    : null
  );
}

export default SidebarLayerMaskedIcon;