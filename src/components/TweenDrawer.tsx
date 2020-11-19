import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TweenDrawerEvents from './TweenDrawerEvents';
import TweenDrawerEvent from './TweenDrawerEvent';
import TweenDrawerDragHandle from './TweenDrawerDragHandle';
import EmptyState from './EmptyState';

interface TweenDrawerProps {
  ready?: boolean;
  tweenDrawerHeight?: number;
  isEmpty?: boolean;
  tweenEvent?: Btwx.TweenEvent;
}

const TweenDrawer = (props: TweenDrawerProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { ready, tweenEvent, tweenDrawerHeight, isEmpty } = props;

  return (
    <>
      <TweenDrawerDragHandle />
      <div
        id='tween-drawer'
        className='c-tween-drawer'
        style={{
          height: tweenDrawerHeight,
          background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
          boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
        }}>
        {
          isEmpty
          ? <EmptyState
              icon='tweens'
              text='Events'
              detail='Events can be added when the document has two or more artboards.'
              style={{paddingLeft: 24, paddingRight: 24}} />
          : null
        }
        {
          ready
          ? tweenEvent
            ? <TweenDrawerEvent />
            : <TweenDrawerEvents />
          : null
        }
      </div>
    </>
  );
}

const mapStateToProps = (state: RootState): {
  tweenDrawerHeight: number;
  tweenEvent: Btwx.TweenEvent;
  isEmpty: boolean;
} => {
  const { layer, tweenDrawer, viewSettings } = state;
  const tweenEvent = layer.present.events.byId[tweenDrawer.event];
  const tweenDrawerHeight = viewSettings.tweenDrawer.height;
  const isEmpty = layer.present.events.allIds.length === 0;
  return { tweenEvent, tweenDrawerHeight, isEmpty };
};

export default connect(
  mapStateToProps
)(TweenDrawer);