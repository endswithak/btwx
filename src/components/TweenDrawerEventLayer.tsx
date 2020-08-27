import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TweenDrawerEventLayerTweens from './TweenDrawerEventLayerTweens';
import { setLayerHover, selectLayer } from '../store/actions/layer';
import { SetLayerHoverPayload, SelectLayerPayload, LayerTypes } from '../store/actionTypes/layer';
import SidebarLayerIcon from './SidebarLayerIcon';

interface TweenDrawerEventLayerProps {
  id: string;
  index: number;
  layer?: em.Layer;
  hover?: string;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
}

const TweenDrawerEventLayer = (props: TweenDrawerEventLayerProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, index, layer, hover, setLayerHover, selectLayer } = props;

  const handleMouseEnter = () => {
    setLayerHover({ id });
  }

  const handleMouseLeave = () => {
    setLayerHover({ id: null });
  }

  const handleClick = () => {
    selectLayer({id: id, newSelection: true});
  }

  return (
    <div
      className='c-tween-drawer-event__layer'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div
        className='c-tween-drawer-event-layer__tween'
        style={{
          background: theme.name === 'dark' ? theme.background.z2 : theme.background.z1,
          boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset, 0 1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`,
          cursor: 'pointer'
        }}>
        <div className='c-tween-drawer__icon'>
          <SidebarLayerIcon
            layer={layer}
            dragGhost={true} />
        </div>
        <div
          className='c-tween-drawer-event-layer-tween__name'
          style={{
            color: theme.text.base
          }}
          onClick={handleClick}>
          {layer.name}
        </div>
      </div>
      <TweenDrawerEventLayerTweens layerId={id} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerProps) => {
  const { layer } = state;
  return {
    layer: layer.present.byId[ownProps.id],
    hover: layer.present.hover
  };
};

export default connect(
  mapStateToProps,
  { setLayerHover, selectLayer }
)(TweenDrawerEventLayer);