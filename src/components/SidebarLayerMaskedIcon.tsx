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
          <path d='M17.3507957,16.5606602 L17.3507957,15.5606602 L13.3535534,15.5606602 C12.5591397,15.5606602 11.9313732,15.0626291 11.8602672,14.4604145 L11.8535534,14.3463745 L11.853,5.91466017 L15,9.06066017 L15.7071068,8.35355339 L11.3535534,4 L7,8.35355339 L7.70710678,9.06066017 L10.853,5.91466017 L10.8535534,14.3463745 C10.8535534,15.536138 11.8958722,16.4791276 13.1841832,16.5556445 L13.3535534,16.5606602 L17.3507957,16.5606602 Z' />
        </svg>
      </div>
    : null
  );
}

export default SidebarLayerMaskedIcon;