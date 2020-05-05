import paper from 'paper';
import React, { useContext, ReactElement, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import { getPaperLayer } from '../store/selectors/layer';

interface SidebarLayerShapeProps {
  layer: em.Layer;
}

const SidebarLayerShape = (props: SidebarLayerShapeProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer } = props;

  const getShapePath = () => {
    const paperLayer = getPaperLayer(layer.id);
    const clone = paperLayer.clone({insert: false}) as paper.PathItem;
    clone.fitBounds(new paper.Rectangle({
      point: new paper.Point(0,0),
      size: new paper.Size(16,16)
    }));
    return clone.pathData;
  }

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
            <path d={getShapePath()} />
          </svg>
      </div>
    : null
  );
}

export default SidebarLayerShape;