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
          <path d='M16,16.5606602 L16,15.5606602 L14,15.5606602 C13.2055863,15.5606602 12.5778198,15.0626291 12.5067138,14.4604145 L12.5,14.3463745 L12.4994466,5.91466017 L15.6464466,9.06066017 L16.3535534,8.35355339 L12,4 L7.64644661,8.35355339 L8.35355339,9.06066017 L11.4994466,5.91466017 L11.5,14.3463745 C11.5,15.536138 12.5423188,16.4791276 13.8306298,16.5556445 L14,16.5606602 L16,16.5606602 Z' />
        </svg>
      </div>
    : null
  );
}

export default SidebarLayerMaskedIcon;