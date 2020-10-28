import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { openEaseEditor } from '../store/actions/easeEditor';
import { EaseEditorTypes, OpenEaseEditorPayload } from '../store/actionTypes/easeEditor';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

interface TweenDrawerEditEaseProps {
  tweenId: string;
  tween?: Btwx.Tween;
  editingEase?: boolean;
  openEaseEditor?(payload: OpenEaseEditorPayload): EaseEditorTypes;
}

const TweenDrawerEditEase = (props: TweenDrawerEditEaseProps): ReactElement => {
  const pathRef = useRef<SVGPathElement>(null);
  const theme = useContext(ThemeContext);
  const [hover, setHover] = useState(false);
  const { tweenId, tween, editingEase, openEaseEditor } = props;

  const handleClick = () => {
    openEaseEditor({tween: tweenId});
  }

  const handleMouseEnter = () => {
    setHover(true);
  }

  const handleMouseLeave = () => {
    setHover(false);
  }

  useEffect(() => {
    if (pathRef) {
      CustomEase.getSVGData(`${tween.ease}.${tween.power}`, {width: 16, height: 16, path: pathRef.current});
    }
  }, [tween]);

  return (
    <div
      className='c-tween-drawer__icon'
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <svg
        width="18"
        height="18"
        viewBox="-1 -1 18 18"
        style={{
          strokeWidth: 2,
          stroke: editingEase
          ? theme.palette.primary
          : hover
            ? theme.text.base
            : theme.text.lighter,
          fill: 'none',
          overflow: 'visible'
        }}>
        <path ref={pathRef} />
      </svg>
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEditEaseProps) => {
  const { layer, easeEditor } = state;
  const tween = layer.present.tweenById[ownProps.tweenId];
  const editingEase = easeEditor.tween && easeEditor.tween === ownProps.tweenId;
  return { tween, editingEase };
};

export default connect(
  mapStateToProps,
  { openEaseEditor }
)(TweenDrawerEditEase);