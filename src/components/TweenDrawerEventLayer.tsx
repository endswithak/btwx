import React, { useContext, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover, selectLayers } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventLayerTweens from './TweenDrawerEventLayerTweens';
import SidebarLayerIcon from './SidebarLayerIcon';

interface TweenDrawerEventLayerProps {
  id: string;
  index: number;
}

const TweenDrawerEventLayer = (props: TweenDrawerEventLayerProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, index } = props;
  const layerName = useSelector((state: RootState) => state.layer.present.byId[id].name);
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    dispatch(setLayerHover({ id }));
  }

  const handleMouseLeave = () => {
    dispatch(setLayerHover({ id: null }));
  }

  const handleClick = () => {
    dispatch(selectLayers({layers: [id], newSelection: true}));
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
          boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset, 0 1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset, -1px 0 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`,
          cursor: 'pointer'
        }}>
        <div className='c-tween-drawer__icon'>
          <SidebarLayerIcon
            id={id}
            isDragGhost />
        </div>
        <div
          className='c-tween-drawer-event-layer-tween__name'
          style={{
            color: theme.text.base
          }}
          onClick={handleClick}>
          {layerName}
        </div>
      </div>
      <TweenDrawerEventLayerTweens layerId={id} />
    </div>
  );
}

export default TweenDrawerEventLayer;