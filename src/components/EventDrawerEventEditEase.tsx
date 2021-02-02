import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { CustomBounce } from 'gsap/CustomBounce';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { RootState } from '../store/reducers';
import { openEaseEditor } from '../store/actions/easeEditor';
import { ThemeContext } from './ThemeProvider';
import IconButton from './IconButton';

gsap.registerPlugin(CustomEase, CustomBounce, CustomWiggle);

interface EventDrawerEventEditEaseProps {
  tweenId: string;
}

const EventDrawerEventEditEase = (props: EventDrawerEventEditEaseProps): ReactElement => {
  // const pathRef = useRef<SVGPathElement>(null);
  // const theme = useContext(ThemeContext);
  // const [hover, setHover] = useState(false);
  const { tweenId } = props;
  // const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  // const easeString = useSelector((state: RootState) => {
  //   const tween = tweenId ? state.layer.present.tweens.byId[tweenId] : null;
  //   if (tween) {
  //     switch(tween.ease) {
  //       case 'customBounce':
  //         return `bounce({strength: ${tween.customBounce.strength}, endAtStart: ${tween.customBounce.endAtStart}, squash: ${tween.customBounce.squash}})`;
  //       case 'customWiggle':
  //         return `wiggle({type: ${tween.customWiggle.type}, wiggles: ${tween.customWiggle.wiggles}})`;
  //       default:
  //         return `${tween.ease}.${tween.power}`;
  //     }
  //   } else {
  //     return null;
  //   }
  // });
  const editingEase = useSelector((state: RootState) => state.easeEditor.tween && state.easeEditor.tween === tweenId);
  const dispatch = useDispatch();

  const handleClick = (): void => {
    dispatch(openEaseEditor({tween: tweenId}));
  }

  // const handleMouseEnter = (): void => {
  //   setHover(true);
  // }

  // const handleMouseLeave = (): void => {
  //   setHover(false);
  // }

  // useEffect(() => {
  //   if (pathRef) {
  //     CustomEase.getSVGData(easeString, {width: 16, height: 16, path: pathRef.current});
  //   }
  // }, [easeString]);

  return (
    <div
      className='c-event-drawer__icon'>
      <IconButton
        onClick={handleClick}
        icon='more'
        active={editingEase} />
    </div>
    // <div
    //   className='c-event-drawer__icon'
    //   onClick={handleClick}
    //   onMouseEnter={handleMouseEnter}
    //   onMouseLeave={handleMouseLeave}>
    //   <svg
    //     width='18'
    //     height='18'
    //     viewBox='-1 -1 18 18'
    //     style={{
    //       strokeWidth: 2,
    //       stroke: editingEase
    //       ? theme.palette.primary
    //       : hover
    //         ? theme.text.base
    //         : theme.text.lighter,
    //       fill: 'none',
    //       overflow: 'visible'
    //     }}>
    //     <path ref={pathRef} />
    //   </svg>
    // </div>
  );
}

export default EventDrawerEventEditEase;