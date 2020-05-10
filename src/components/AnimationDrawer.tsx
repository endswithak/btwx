import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';

interface AnimationDrawerProps {
  selection?: em.Layer[];
  isOpen: boolean;
}

const AnimationDrawer = (props: AnimationDrawerProps): ReactElement => {
  const elementRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { selection, isOpen } = props;

  return (
    isOpen
    ? <div
        className={`c-animation-drawer`}
        ref={elementRef}
        style={{
          background: theme.background.z3
        }}>

      </div>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, animationDrawer } = state;
  const selection = layer.present.selected.reduce((result, current) => {
    if (layer.present.byId[current]) {
      result = [
        ...result,
        layer.present.byId[current]
      ];
    }
    return result;
  }, []);
  const isOpen = animationDrawer.isOpen;
  return { selection, isOpen };
};

export default connect(
  mapStateToProps
)(AnimationDrawer);