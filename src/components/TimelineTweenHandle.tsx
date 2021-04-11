/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
import { setLayerTweenDelay, setLayersTweenTiming, selectLayerEventTweens, deselectLayerEventTweens } from '../store/actions/layer';

// gsap.registerPlugin(Draggable);

interface TimelineTweenHandleProps {
  tweenId: string;
  onMouseDown(handle: Btwx.EventTweenHandle, e: any): void;
}

const TimelineTweenHandle = (props: TimelineTweenHandleProps): ReactElement => {
  const { tweenId, onMouseDown } = props;
  const handleSelected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.includes(tweenId) && state.layer.present.tweens.selected.handle[tweenId] !== 'delay');
  const selectedHandle = useSelector((state: RootState) => state.layer.present.tweens.selected.handle[tweenId]);
  const isSelected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.includes(tweenId) && state.layer.present.tweens.selected.handle[tweenId] === 'delay');

  return (
    <div
      id={`${tweenId}-handle-delay`}
      className={`c-timeline-tween-handle${
        isSelected
        ? `${' '}${'c-timeline-tween-handle--selected'}`
        : ''
      }${
        handleSelected
        ? `${' '}${`c-timeline-tween-handle--`}${selectedHandle}-selected`
        : ''
      }`}
      onMouseDown={(e) => onMouseDown('delay', e)} />
  );
}

export default TimelineTweenHandle;


// const animateLeft = () => {
//   let item = { 'x': 0 };
//   gsap.to(item, {
//     duration: 0.15,
//     ['x']: 50,
//     onUpdate: () => {
//       gsap.set(ref.current, { background: `linear-gradient(to right, ${theme.palette.primary} 0%, ${theme.listItemRootBackground} ${Math.round(item['x'])}%)` });
//     },
//     ease: 'power1.out'
//   });
// }

// const animateRight = () => {
//   let item = { 'x': 0 };
//   gsap.to(item, {
//     duration: 0.15,
//     ['x']: 50,
//     onUpdate: () => {
//       gsap.set(ref.current, { background: `linear-gradient(to left, ${theme.palette.primary} 0%, ${theme.listItemRootBackground} ${item['x']}%)` });
//     },
//     ease: 'power1.out'
//   });
// }

// useEffect(() => {
//   switch(selectedHandle) {
//     case 'delay':
//       animateLeft();
//       break;
//     case 'duration':
//       animateRight();
//       break;
//   }
// }, [selectedHandle]);

// /* eslint-disable @typescript-eslint/no-use-before-define */
// import React, { ReactElement, useEffect, useState, forwardRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import gsap from 'gsap';
// import { Draggable } from 'gsap/Draggable';
// import { RootState } from '../store/reducers';
// import { setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
// import { setLayerTweenDelay, setLayersTweenTiming, selectLayerEventTweens, deselectLayerEventTweens } from '../store/actions/layer';

// gsap.registerPlugin(Draggable);

// interface TimelineTweenHandleProps {
//   tweenId: string;
// }

// const TimelineTweenHandle = forwardRef((props: TimelineTweenHandleProps, ref: any): ReactElement => {
//   const themeUnit = 4;
//   const { tweenId } = props;
//   const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
//   const selected = useSelector((state: RootState) => state.layer.present.tweens.selected);
//   const handleSelected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.includes(tweenId) && state.layer.present.tweens.selected.handle[tweenId] !== 'both');
//   const selectedHandle = useSelector((state: RootState) => state.layer.present.tweens.selected.handle[tweenId]);
//   const isSelected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.includes(tweenId) && state.layer.present.tweens.selected.handle[tweenId] === 'both');
//   const dispatch = useDispatch();

//   const positionHandle = () => {
//     const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
//     gsap.set(tweenHandleElement, {x: (tween.delay * 100) * themeUnit, width: (tween.duration * 100) * themeUnit});
//   }

//   const killHandle = () => {
//     const tweenHandleElement = getHandle();
//     if (tweenHandleElement) {
//       tweenHandleElement.kill();
//     }
//   }

//   const getHandle = (): globalThis.Draggable => {
//     const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
//     if (Draggable.get(tweenHandleElement)) {
//       return Draggable.get(tweenHandleElement);
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
//     const tweenHandleElement = document.getElementById(`${tweenId}-handle-tween`);
//     const leftHandleElement = document.getElementById(`${tweenId}-handle-left`);
//     const rightHandleElement = document.getElementById(`${tweenId}-handle-right`);
//     const leftHandleTooltipElement = document.getElementById(`${tweenId}-tooltip-left`);
//     const timelineElement = document.getElementById(`${tweenId}-timeline`);
//     const guide = document.getElementById('event-drawer-guide');
//     const handle = Draggable.create(tweenHandleElement, {
//       type: 'x',
//       zIndexBoost: false,
//       bounds: {
//         minX: 0,
//         maxX: timelineElement.clientWidth - tweenHandleElement.clientWidth,
//         minY: timelineElement.clientHeight,
//         maxY: timelineElement.clientHeight
//       },
//       autoScroll: 1,
//       liveSnap: {
//         x: function(value): number {
//           return Math.round(value / themeUnit) * themeUnit;
//         }
//       },
//       // onDragStart: function() {
//       //   dispatch(setEventDrawerTweenEditing({id: tweenId}));
//       //   gsap.set(guide, {x: (gsap.getProperty(rightHandleElement, 'x') as number) + (themeUnit * 4)});
//       //   gsap.set(leftHandleTooltipElement, {display: 'inline'});
//       //   leftHandleTooltipElement.innerHTML = `${(gsap.getProperty(leftHandleElement, 'x') as number / 4) / 100}s`;
//       //   document.body.style.cursor = 'grabbing';
//       // },
//       // onRelease: function() {
//       //   dispatch(setEventDrawerTweenEditing({id: null}));
//       //   gsap.set(leftHandleTooltipElement, {display: 'none'});
//       //   document.body.style.cursor = 'auto';
//       // },
//       onDrag: function() {
//         gsap.set(guide, {
//           x: (gsap.getProperty(rightHandleElement, 'x') as number) + (themeUnit * 4)
//         });
//         gsap.set([leftHandleElement, rightHandleElement], {
//           x: `+=${this.deltaX}`
//         });
//         // leftHandleTooltipElement.innerHTML = `${(gsap.getProperty(leftHandleElement, 'x') as number / 4) / 100}s`;
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
//             [tweenId]: 'both'
//           }
//         }));
//       }
//     } else {
//       if (!isSelected) {
//         dispatch(selectLayerEventTweens({
//           tweens: [tweenId],
//           handle: {
//             [tweenId]: 'both'
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
//       id={`${tweenId}-handle-tween`}
//       ref={ref}
//       className={`c-timeline-tween-handle${
//         isSelected
//         ? `${' '}${'c-timeline-tween-handle--selected'}`
//         : ''
//       }${
//         handleSelected
//         ? `${' '}${`c-timeline-tween-handle--`}${selectedHandle === 'delay' ? 'left' : 'right'}-selected`
//         : ''
//       }`}
//       onMouseDown={handleMouseDown} />
//   );
// });

// export default TimelineTweenHandle;


// // const animateLeft = () => {
// //   let item = { 'x': 0 };
// //   gsap.to(item, {
// //     duration: 0.15,
// //     ['x']: 50,
// //     onUpdate: () => {
// //       gsap.set(ref.current, { background: `linear-gradient(to right, ${theme.palette.primary} 0%, ${theme.listItemRootBackground} ${Math.round(item['x'])}%)` });
// //     },
// //     ease: 'power1.out'
// //   });
// // }

// // const animateRight = () => {
// //   let item = { 'x': 0 };
// //   gsap.to(item, {
// //     duration: 0.15,
// //     ['x']: 50,
// //     onUpdate: () => {
// //       gsap.set(ref.current, { background: `linear-gradient(to left, ${theme.palette.primary} 0%, ${theme.listItemRootBackground} ${item['x']}%)` });
// //     },
// //     ease: 'power1.out'
// //   });
// // }

// // useEffect(() => {
// //   switch(selectedHandle) {
// //     case 'delay':
// //       animateLeft();
// //       break;
// //     case 'duration':
// //       animateRight();
// //       break;
// //   }
// // }, [selectedHandle]);