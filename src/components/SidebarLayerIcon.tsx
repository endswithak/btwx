import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import { paperMain } from '../canvas';

interface SidebarLayerIconProps {
  layer: em.Layer;
  dragGhost: boolean;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, dragGhost } = props;

  const pathData = () => {
    switch(layer.type) {
      case 'Artboard':
        return 'M12.4743416,2.84188612 L12.859,3.99988612 L21,4 L21,15 L22,15 L22,16 L16.859,15.9998861 L18.4743416,20.8418861 L17.5256584,21.1581139 L16.805,18.9998861 L7.193,18.9998861 L6.47434165,21.1581139 L5.52565835,20.8418861 L7.139,15.9998861 L2,16 L2,15 L3,15 L3,4 L11.139,3.99988612 L11.5256584,2.84188612 L12.4743416,2.84188612 Z M15.805,15.9998861 L8.193,15.9998861 L7.526,17.9998861 L16.472,17.9998861 L15.805,15.9998861 Z M20,5 L4,5 L4,15 L20,15 L20,5 Z';
      case 'Group':
        return 'M21,9 L21,20 L3,20 L3,9 L21,9 Z M9,4 C10.480515,4 11.7731656,4.80434324 12.4648015,5.99987956 L21,6 L21,8 L3,8 L3,4 L9,4 Z';
      case 'Shape': {
        const layerIcon = new paperMain.Path({
          pathData: (layer as em.Shape).pathData,
          insert: false
        });
        layerIcon.fitBounds(new paperMain.Rectangle({
          point: new paperMain.Point(0,0),
          size: new paperMain.Size(24,24)
        }));
        return layerIcon.pathData;
      }
      case 'Text':
        return 'M12.84,18.999 L12.84,6.56 L12.84,6.56 L16.92,6.56 L16.92,5 L7.08,5 L7.08,6.56 L11.16,6.56 L11.16,19 L12.839,19 C12.8395523,19 12.84,18.9995523 12.84,18.999 Z';
      case 'Image':
        return theme.name === 'dark' ? 'M21,4 L21,20 L3,20 L3,4 L21,4 Z M20,5 L4,5 L4,14.916 L7.55555556,11 L12.7546667,16.728 L16,13.6703297 L20,17.44 L20,5 Z M16.6243657,6.71118154 C16.9538983,6.79336861 17.2674833,6.9606172 17.5297066,7.21384327 C18.3242674,7.98114172 18.3463679,9.24727881 17.5790695,10.0418396 C16.811771,10.8364004 15.5456339,10.8585009 14.7510731,10.0912025 C14.4888499,9.8379764 14.3107592,9.53041925 14.21741,9.2034121 C14.8874902,9.37067575 15.6260244,9.1851639 16.1403899,8.65252287 C16.6547553,8.11988184 16.8143797,7.37532327 16.6243657,6.71118154 Z' : 'M21,4 L21,20 L3,20 L3,4 L21,4 Z M20,5 L4,5 L4,14.916 L7.55555556,11 L12.7546667,16.728 L16,13.6703297 L20,17.44 L20,5 Z M16,7 C17.1045695,7 18,7.8954305 18,9 C18,10.1045695 17.1045695,11 16,11 C14.8954305,11 14,10.1045695 14,9 C14,7.8954305 14.8954305,7 16,7 Z';
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
          fill: layer.selected && !dragGhost
          ? theme.text.onPrimary
          : theme.text.lighter,
          transform: layer.type === 'Shape' ? `scale(0.75)` : 'none'
        }}>
        <path d={pathData()} />
      </svg>
    </div>
  );
}

export default SidebarLayerIcon;