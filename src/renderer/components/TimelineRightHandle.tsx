/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
import { setLayersTweenTiming, setLayerTweenDuration, selectLayerEventTweens, deselectLayerEventTweens } from '../store/actions/layer';

// gsap.registerPlugin(Draggable);

interface TimelineRightHandleProps {
  tweenId: string;
  onMouseDown(handle: Btwx.EventTweenHandle, e: any): void;
}

const TimelineRightHandle = (props: TimelineRightHandleProps): ReactElement => {
  const { tweenId, onMouseDown } = props;
  const isSelected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.includes(tweenId) && state.layer.present.tweens.selected.handle[tweenId] === 'duration');

  return (
    <div
      id={`${tweenId}-handle-duration`}
      className={`c-timeline-handle c-timeline-handle--duration${
        isSelected
        ? `${' '}c-timeline-handle--selected`
        : ''
      }`}
      onMouseDown={(e) => onMouseDown('duration', e)}>
      <div className='c-timeline-handle__ellipse' />
      <span
        id={`${tweenId}-tooltip-duration`}
        className='c-timeline-handle__tooltip' />
    </div>
  );
}

export default TimelineRightHandle;

// /* eslint-disable @typescript-eslint/no-use-before-define */
// import React, { ReactElement, useEffect, useState, forwardRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import gsap from 'gsap';
// import { Draggable } from 'gsap/Draggable';
// import { RootState } from '../store/reducers';
// import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
// import { setLayersTweenTiming, setLayerTweenDuration, selectLayerEventTweens, deselectLayerEventTweens } from '../store/actions/layer';

// gsap.registerPlugin(Draggable);

// interface TimelineRightHandleProps {
//   tweenId: string;
// }

// const TimelineRightHandle = forwardRef((props: TimelineRightHandleProps, ref: any): ReactElement => {
//   const themeUnit = 4;
//   const { tweenId } = props;
//   const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
//   const selected = useSelector((state: RootState) => state.layer.present.tweens.selected);
//   const isSelected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.includes(tweenId) && state.layer.present.tweens.selected.handle[tweenId] === 'duration');
//   const dispatch = useDispatch();

//   const positionHandle = () => {
//     const rightHandleInitialPos = ((tween.delay * 100) * themeUnit) + ((tween.duration * 100) * themeUnit) - themeUnit * 4;
//     const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
//     gsap.set(rightHandleElement, {x: rightHandleInitialPos});
//   }

//   const killHandle = () => {
//     const rightHandleElement = getHandle();
//     if (rightHandleElement) {
//       rightHandleElement.kill();
//     }
//   }

//   const getHandle = (): globalThis.Draggable => {
//     const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
//     if (Draggable.get(rightHandleElement)) {
//       return Draggable.get(rightHandleElement);
//     } else {
//       return null;
//     }
//   }

//   const getOtherDragHandles = (): { [id:string]: HTMLElement } => {
//     const convert = (handle: Btwx.EventTweenHandle) => {
//       switch(handle) {
//         case 'both':
//           return 'tween';
//         case 'delay':
//           return 'left';
//         case 'duration':
//           return 'right';
//       }
//     }
//     return selected.allIds.reduce((result, current) => {
//       if (current !== tweenId) {
//         result = {
//           ...result,
//           [current]: document.getElementById(`${current}-handle-${convert(selected.handle[current])}`)
//         };
//       }
//       return result;
//     }, {} as { [id:string]: HTMLElement });
//   }

//   const setupHandle = (): globalThis.Draggable => {
//     killHandle();
//     const leftHandleInitialPos = ((tween.delay * 100) * themeUnit);
//     const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
//     const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
//     const timelineElement = document.getElementById(`${tweenId}-timeline`);
//     const rightTooltipElement = document.getElementById(`${tweenId}-tooltip-right`);
//     const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
//     const guide = document.getElementById('event-drawer-guide');
//     const handle = Draggable.create(rightHandleElement, {
//       type: 'x',
//       zIndexBoost: false,
//       cursor: 'ew-resize',
//       autoScroll: 1,
//       bounds: {
//         minX: leftHandleInitialPos,
//         maxX: timelineElement.clientWidth - (themeUnit * 4),
//         minY: timelineElement.clientHeight,
//         maxY: timelineElement.clientHeight
//       },
//       liveSnap: {
//         x: function(value): number {
//           return Math.round(value / themeUnit) * themeUnit;
//         }
//       },
//       // onRelease: function() {
//       //   dispatch(setEventDrawerTweenEditing({id: null}));
//       //   gsap.set(rightTooltipElement, {display: 'none'});
//       //   document.body.style.cursor = 'auto';
//       // },
//       // onDragStart: function() {
//       //   dispatch(setEventDrawerTweenEditing({id: tweenId}));
//       //   gsap.set(guide, {x: this.x + (themeUnit * 4)});
//       //   gsap.set(rightTooltipElement, {display: 'inline'});
//       //   rightTooltipElement.innerHTML = `${(tweenHandleElement.clientWidth / 4) / 100}s`;
//       //   document.body.style.cursor = 'ew-resize';
//       // },
//       onDrag: function() {
//         gsap.set(tweenHandleElement, {
//           width: `+=${this.deltaX}`
//         });
//         gsap.set(guide, {
//           x: `+=${this.deltaX}`
//         });
//         // rightTooltipElement.innerHTML = `${(tweenHandleElement.clientWidth / 4) / 100}s`;
//       },
//       onDragEnd: function() {
//         const distance = this.endX - this.startX;
//         if (distance >= 4 && tweenId === selected.allIds[0]) {
//           handleDragEnd();
//         }
//       }
//     });
//     return handle as any;
//   }

//   const handleDragEnd = () => {
//     dispatch(setLayersTweenTiming({
//       tweens: selected.allIds,
//       ...selected.allIds.reduce((result, current) => {
//         const leftHandleElement = document.getElementById(`${current}-handle-left`);
//         const rightHandleElement = document.getElementById(`${current}-handle-right`);
//         const handle = selected.handle[current];
//         const leftHandlePos = gsap.getProperty(leftHandleElement, 'x') as number;
//         const rightHandlePos = gsap.getProperty(rightHandleElement, 'x') as number;
//         const duration = (((rightHandlePos + themeUnit * 4) - leftHandlePos) / 4) / 100;
//         const delay = (leftHandlePos / 4) / 100;
//         switch(handle) {
//           case 'both': {
//             return {
//               ...result,
//               delay: {
//                 ...result.delay,
//                 [current]: delay
//               }
//             }
//           }
//           case 'delay':
//             return {
//               ...result,
//               delay: {
//                 ...result.delay,
//                 [current]: delay
//               },
//               duration: {
//                 ...result.duration,
//                 [current]: duration
//               }
//             }
//           case 'duration':
//             return {
//               ...result,
//               duration: {
//                 ...result.duration,
//                 [current]: duration
//               }
//             }
//         }
//       }, { duration: {}, delay: {} })
//     }));
//   }

//   const handleMouseDown = (e: any): void => {
//     const draggable = setupHandle();
//     const otherHandles = getOtherDragHandles();
//     draggable[0].startDrag(e);
//     Object.keys(otherHandles).forEach((key) => {
//       if (Draggable.get(otherHandles[key])) {
//         Draggable.get(otherHandles[key]).startDrag(e);
//       }
//     });
//     if (e.metaKey) {
//       if (isSelected) {
//         dispatch(deselectLayerEventTweens({
//           tweens: [tweenId]
//         }));
//       } else {
//         dispatch(selectLayerEventTweens({
//           tweens: [tweenId],
//           handle: {
//             [tweenId]: 'duration'
//           }
//         }));
//       }
//     } else {
//       if (!isSelected) {
//         dispatch(selectLayerEventTweens({
//           tweens: [tweenId],
//           handle: {
//             [tweenId]: 'duration'
//           },
//           newSelection: true
//         }));
//       }
//     }
//   }

//   // initial render
//   useEffect(() => {
//     positionHandle();
//     return (): void => {
//       killHandle();
//     }
//   }, [tween.duration, tween.delay]);

//   useEffect(() => {
//     if (!isSelected) {
//       killHandle();
//     }
//   }, [isSelected]);

//   return (
//     <div
//       id={`${tweenId}-handle-right`}
//       ref={ref}
//       className={`c-timeline-handle c-timeline-handle--right${
//         isSelected
//         ? `${' '}c-timeline-handle--selected`
//         : ''
//       }`}
//       onMouseDown={handleMouseDown}>
//       <div className='c-timeline-handle__ellipse' />
//       <span
//         id={`${tweenId}-tooltip-right`}
//         className='c-timeline-handle__tooltip' />
//     </div>
//   );
// });

// export default TimelineRightHandle;