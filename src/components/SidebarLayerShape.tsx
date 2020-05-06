import React, { useContext, ReactElement, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerShapeProps {
  layer: em.Layer;
}

const SidebarLayerShape = (props: SidebarLayerShapeProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer } = props;

  return (
    layer.type === 'Shape'
    ? <div className='c-sidebar-layer__shape'>
        <svg
          width="18"
          height="18"
          viewBox="-1 -1 18 18"
          style={{
            strokeWidth: 1,
            stroke: layer.selected
            ? theme.text.onPrimary
            : theme.text.lighter,
            fill: theme.text.lightest
          }}>
            <path d={(layer as em.Shape).pathData} />
          </svg>
      </div>
    : null
  );
}

export default SidebarLayerShape;