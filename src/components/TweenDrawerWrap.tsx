import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TweenDrawer from './TweenDrawer';

interface TweenDrawerWrapProps {
  ready: boolean;
  isOpen?: boolean;
}

const TweenDrawerWrap = (props: TweenDrawerWrapProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { ready, isOpen } = props;

  return (
    isOpen && ready
    ? <TweenDrawer />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isOpen: boolean;
} => {
  const { tweenDrawer } = state;
  const isOpen = tweenDrawer.isOpen;
  return { isOpen };
};

export default connect(
  mapStateToProps
)(TweenDrawerWrap);