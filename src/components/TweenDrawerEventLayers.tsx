import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import TweenDrawerEventLayer from './TweenDrawerEventLayer';

interface TweenDrawerEventLayersProps {
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
}

const TweenDrawerEventLayers = (props: TweenDrawerEventLayersProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenEventLayers } = props;

  return (
    <div className={`c-tween-drawer-event__layers`}>
      <div
        className='c-tween-drawer-event-layers__header'>

      </div>
      <div className='c-tween-drawer-event-layers__layers'>
        {
          tweenEventLayers.allIds.map((layer, index) => (
            <TweenDrawerEventLayer
              key={index}
              id={layer} />
          ))
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer } = state;
  const tweenEventLayers = getTweenEventLayers(layer.present, tweenDrawer.event);
  return { tweenEventLayers };
};

export default connect(
  mapStateToProps
)(TweenDrawerEventLayers);