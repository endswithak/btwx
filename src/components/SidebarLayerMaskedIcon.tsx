import React, { useContext, ReactElement, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerMaskedIconProps {
  layer: em.Layer;
}

const SidebarLayerMaskedIcon = (props: SidebarLayerMaskedIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer } = props;

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
            fill: layer.selected
            ? theme.text.onPrimary
            : theme.text.lighter
          }}>
          <path d='M16,19 L16,18 L14,18 C13.2203039,18 12.5795513,17.4051119 12.5068666,16.64446 L12.5,16.5 L12.499,6.773 L14.6,9.5 L15.4,8.91558442 L12,4.5 L8.6,8.91558442 L9.4,9.5 L11.499,6.773 L11.5,16.5 C11.5,17.8254834 12.5315359,18.9100387 13.8356243,18.9946823 L14,19 L16,19 Z' />
        </svg>
      </div>
    : null
  );
}

export default SidebarLayerMaskedIcon;