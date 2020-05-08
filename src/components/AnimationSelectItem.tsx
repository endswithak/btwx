import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { paperMain, paperPreview } from '../canvas';
import { LayerTypes, OpenAnimationSelectPayload } from '../store/actionTypes/layer';
import { closeAnimationSelect, openAnimationSelect } from '../store/actions/layer';


interface AnimationSelectItemProps {
  text: string;
  onClick(e: any): void;
}

const AnimationSelectItem = (props: AnimationSelectItemProps): ReactElement => {
  const [hover, setHover] = useState(false);
  const selectItem = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { text, onClick } = props;

  const handleClick = (e) => {
    onClick(e);
  }

  return (
    <div
      className='c-animation-select__item'
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
        ? theme.palette.primary
        : 'none',
        color: hover
        ? theme.text.onPrimary
        : theme.text.base
      }}>
      {text}
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const animationSelect = layer.present.animationSelect;
  return { animationSelect };
};

export default connect(
  mapStateToProps,
  {
    closeAnimationSelect,
    openAnimationSelect
  }
)(AnimationSelectItem);