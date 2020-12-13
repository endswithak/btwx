import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import TweenDrawer from './TweenDrawer';

interface TweenDrawerWrapProps {
  ready: boolean;
}

const TweenDrawerWrap = (props: TweenDrawerWrapProps): ReactElement => {
  const { ready } = props;
  const isOpen = useSelector((state: RootState) => state.viewSettings.tweenDrawer.isOpen);

  return (
    isOpen
    ? <TweenDrawer ready={ready} />
    : null
  );
}

export default TweenDrawerWrap;