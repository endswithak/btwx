/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
import { setLayersTweenTiming, selectLayerEventTweens, deselectLayerEventTweens } from '../store/actions/layer';

// gsap.registerPlugin(Draggable);

interface TimelineLeftHandleProps {
  tweenId: string;
  onMouseDown(handle: Btwx.EventTweenHandle, e: any): void;
}

const TimelineLeftHandle = (props: TimelineLeftHandleProps): ReactElement => {
  const { tweenId, onMouseDown } = props;
  const isSelected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.includes(tweenId) && state.layer.present.tweens.selected.handle[tweenId] === 'both');

  return (
    <div
      id={`${tweenId}-handle-both`}
      className={`c-timeline-handle c-timeline-handle--both${
        isSelected
        ? `${' '}c-timeline-handle--selected`
        : ''
      }`}
      onMouseDown={(e) => onMouseDown('both', e)}>
      <div className='c-timeline-handle__ellipse' />
      <span
        id={`${tweenId}-tooltip-both`}
        className='c-timeline-handle__tooltip' />
    </div>
  );
}

export default TimelineLeftHandle;

// /* eslint-disable @typescript-eslint/no-use-before-define */
// import React, { ReactElement, useEffect, useState, forwardRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import gsap from 'gsap';
// import { Draggable } from 'gsap/Draggable';
// import { RootState } from '../store/reducers';
// import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
// import { setLayersTweenTiming, selectLayerEventTweens, deselectLayerEventTweens } from '../store/actions/layer';

// gsap.registerPlugin(Draggable);

// interface TimelineLeftHandleProps {
//   tweenId: string;
// }

// const TimelineLeftHandle = forwardRef((props: TimelineLeftHandleProps, ref: any): ReactElement => {
//   const themeUnit = 4;
//   const { tweenId } = props;
//   const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
//   const selected = useSelector((state: RootState) => state.layer.present.tweens.selected);
//   const isSelected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.includes(tweenId) && state.layer.present.tweens.selected.handle[tweenId] === 'delay');
//   const dispatch = useDispatch();

//   const positionHandle = () => {
//     const leftHandleInitialPos = ((tween.delay * 100) * themeUnit);
//     const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
//     gsap.set(leftHandleElement, {x: leftHandleInitialPos});
//   }

//   const killHandle = () => {
//     const leftHandleElement = getHandle();
//     if (leftHandleElement) {
//       leftHandleElement.kill();
//     }
//   }

//   const getHandle = (): globalThis.Draggable => {
//     const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
//     if (Draggable.get(leftHandleElement)) {
//       return Draggable.get(leftHandleElement);
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
//     const rightHandleInitialPos = ((tween.delay * 100) * themeUnit) + ((tween.duration * 100) * themeUnit) - themeUnit * 4;
//     const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
//     const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
//     const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
//     const timelineElement = document.getElementById(`${tweenId}-timeline`);
//     const leftTooltipElement = document.getElementById(`${tweenId}-tooltip-left`);
//     const guide = document.getElementById('event-drawer-guide');
//     const handle = Draggable.create(leftHandleElement, {
//       type: 'x',
//       zIndexBoost: false,
//       cursor: 'ew-resize',
//       autoScroll: 1,
//       bounds: {
//         minX: 0,
//         maxX: rightHandleInitialPos,
//         minY: timelineElement.clientHeight,
//         maxY: timelineElement.clientHeight
//       },
//       minX: themeUnit,
//       liveSnap: {
//         x: function(value): number {
//           return Math.round(value / themeUnit) * themeUnit;
//         }
//       },
//       // onDragStart: function() {
//       //   dispatch(setEventDrawerTweenEditing({id: tweenId}));
//       //   gsap.set(guide, {x: this.x});
//       //   gsap.set(leftTooltipElement, {display: 'inline'});
//       //   leftTooltipElement.innerHTML = `${(this.x / 4) / 100}s`;
//       //   document.body.style.cursor = 'ew-resize';
//       // },
//       // onRelease: function() {
//       //   dispatch(setEventDrawerTweenEditing({id: null}));
//       //   gsap.set(leftTooltipElement, {display: 'none'});
//       //   document.body.style.cursor = 'auto';
//       // },
//       onDrag: function() {
//         gsap.set(guide, {
//           x: `+=${this.deltaX}`
//         });
//         gsap.set(tweenHandleElement, {
//           x: `+=${this.deltaX}`,
//           width: `-=${this.deltaX}`
//         });
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
//             [tweenId]: 'delay'
//           }
//         }));
//       }
//     } else {
//       if (!isSelected) {
//         dispatch(selectLayerEventTweens({
//           tweens: [tweenId],
//           handle: {
//             [tweenId]: 'delay'
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
//       id={`${tweenId}-handle-left`}
//       ref={ref}
//       className={`c-timeline-handle c-timeline-handle--left${
//         isSelected
//         ? `${' '}c-timeline-handle--selected`
//         : ''
//       }`}
//       onMouseDown={handleMouseDown}>
//       <div className='c-timeline-handle__ellipse' />
//       <span
//         id={`${tweenId}-tooltip-left`}
//         className='c-timeline-handle__tooltip' />
//     </div>
//   );
// });

// export default TimelineLeftHandle;