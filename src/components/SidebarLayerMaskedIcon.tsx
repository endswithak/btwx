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
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          style={{
            fill: layer.selected && !dragGhost
            ? theme.text.onPrimary
            : theme.text.lighter
          }}>
          <path d={Icon('masked').fill} />
        </svg>
      </div>
    : null
  );
}

export default SidebarLayerMaskedIcon;