import React, { useContext, ReactElement, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerIconProps {
  layer: em.Layer;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer } = props;

  const pathData = () => {
    switch(layer.type) {
      case 'Artboard':
        return 'M12.4743416,2.84188612 L12.859,3.99988612 L21,4 L21,15 L22,15 L22,16 L16.859,15.9998861 L18.4743416,20.8418861 L17.5256584,21.1581139 L16.805,18.9998861 L7.193,18.9998861 L6.47434165,21.1581139 L5.52565835,20.8418861 L7.139,15.9998861 L2,16 L2,15 L3,15 L3,4 L11.139,3.99988612 L11.5256584,2.84188612 L12.4743416,2.84188612 Z M15.805,15.9998861 L8.193,15.9998861 L7.526,17.9998861 L16.472,17.9998861 L15.805,15.9998861 Z M20,5 L4,5 L4,15 L20,15 L20,5 Z';
      case 'Group':
        return 'M21,9 L21,20 L3,20 L3,9 L21,9 Z M9,4 C10.480515,4 11.7731656,4.80434324 12.4648015,5.99987956 L21,6 L21,8 L3,8 L3,4 L9,4 Z';
      case 'Shape':
        return (layer as em.Shape).pathData;
      case 'Text':
        return 'M12.84,18.999 L12.84,6.56 L12.84,6.56 L16.92,6.56 L16.92,5 L7.08,5 L7.08,6.56 L11.16,6.56 L11.16,19 L12.839,19 C12.8395523,19 12.84,18.9995523 12.84,18.999 Z';
      case 'Image':
        return theme.name === 'dark' ? 'M21,3 L21,21 L3,21 L3,3 L21,3 Z M20.1,3.9 L3.9,3.9 L3.9,16.16 L7.5,12.2 L12.765,17.991 L16.05,14.9 L20.1,18.712 L20.1,3.9 Z M16.05,5.7 C17.2926407,5.7 18.3,6.70735931 18.3,7.95 C18.3,9.19264069 17.2926407,10.2 16.05,10.2 C15.729854,10.2 15.4253249,10.1331365 15.1496154,10.0126123 C15.9443605,9.66600335 16.5,8.87288995 16.5,7.95 C16.5,7.02711005 15.9443605,6.23399665 15.1493633,5.8869416 C15.4253249,5.76686354 15.729854,5.7 16.05,5.7 Z' : 'M21,3 L21,21 L3,21 L3,3 L21,3 Z M20.1,3.9 L3.9,3.9 L3.9,16.16 L7.5,12.2 L12.765,17.991 L16.05,14.9 L20.1,18.712 L20.1,3.9 Z M16.05,5.7 C17.2926407,5.7 18.3,6.70735931 18.3,7.95 C18.3,9.19264069 17.2926407,10.2 16.05,10.2 C14.8073593,10.2 13.8,9.19264069 13.8,7.95 C13.8,6.70735931 14.8073593,5.7 16.05,5.7 Z';
    }
  }

  return (
    <div
      className='c-sidebar-layer__icon'>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        style={{
          // strokeWidth: 1,
          // stroke: layer.selected
          // ? theme.text.onPrimary
          // : theme.text.lighter,
          fill: theme.text.lighter,
          transform: layer.type === 'Shape' ? `scale(0.75)` : 'none'
        }}>
        <path d={pathData()} />
      </svg>
    </div>
  );
}

export default SidebarLayerIcon;