import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerMaskedIconProps {
  layer: em.Layer;
  dragGhost: boolean;
}

const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, dragGhost } = props;

  return (
    layer.masked
    ? <div
        className='c-sidebar-layer__icon'
        >
        <Icon
          name='masked'
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