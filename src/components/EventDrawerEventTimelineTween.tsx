/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenHoverThunk, setEventDrawerTweenEditing } from '../store/actions/eventDrawer';
import { setLayersTweenTiming, deselectLayerEventTweens, selectLayerEventTweens } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import EventDrawerEventClearSelection from './EventDrawerEventClearSelection';

gsap.registerPlugin(Draggable);

interface EventDrawerEventTimelineTweenProps {
  tweenId: string;
}

const EventDrawerEventTimelineTween = (props: EventDrawerEventTimelineTweenProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId } = props;
  const editing = useSelector((state: RootState) => state.eventDrawer.tweenEditing === tweenId);
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const selected = useSelector((state: RootState) => state.layer.present.tweens.selected);
  const isSelected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.includes(tweenId));
  const selectedHandle = useSelector((state: RootState) => isSelected ? state.layer.present.tweens.selected.handle[tweenId] : null);
  const dispatch = useDispatch();

  const positionHandles = () => {
    const tweenHandleElement = document.getElementById(`${tweenId}-handle-delay`);
    const leftHandleElement = document.getElementById(`${tweenId}-handle-both`);
    const rightHandleElement = document.getElementById(`${tweenId}-handle-duration`);
    gsap.set(tweenHandleElement, {
      x: (tween.delay * 100) * theme.unit,
      width: (tween.duration * 100) * theme.unit
    });
    gsap.set(leftHandleElement, {
      x: (tween.delay * 100) * theme.unit
    });
    gsap.set(rightHandleElement, {
      x: ((tween.delay * 100) * theme.unit) + ((tween.duration * 100) * theme.unit) - theme.unit * 4
    });
  }

  const killDraggableHandle = (handle: Btwx.EventTweenHandle, id = tweenId) => {
    const handleDraggable = getDraggableHandle(handle, id);
    if (handleDraggable) {
      handleDraggable.kill();
    }
  }

  const getDraggableHandle = (handle: Btwx.EventTweenHandle, id = tweenId): globalThis.Draggable => {
    const element = document.getElementById(`${id}-handle-${handle}`);
    if (Draggable.get(element)) {
      return Draggable.get(element);
    } else {
      return null;
    }
  }

  const setupLeftDraggableHandle = (id = tweenId, guideHandle = false): globalThis.Draggable[] => {
    killDraggableHandle('both', id);
    const rightHandleElement = document.getElementById(`${id}-handle-duration`);
    const leftHandleElement = document.getElementById(`${id}-handle-both`);
    const tweenHandleElement = document.getElementById(`${id}-handle-delay`);
    const timelineElement = document.getElementById(`${id}-timeline`);
    const leftTooltipElement = document.getElementById(`${id}-tooltip-delay`);
    const guide = document.getElementById(`event-drawer-guide`);
    const handle = Draggable.create(leftHandleElement, {
      type: 'x',
      zIndexBoost: false,
      // cursor: 'pointer',
      // autoScroll: 1,
      bounds: {
        minX: 0,
        maxX: gsap.getProperty(rightHandleElement, 'x') as number,
        minY: timelineElement.clientHeight,
        maxY: timelineElement.clientHeight
      },
      minX: theme.unit,
      liveSnap: {
        x: function(value): number {
          return Math.round(value / theme.unit) * theme.unit;
        }
      },
      onRelease: function() {
        if (guideHandle) {
          // used to position drag z index element above others
          dispatch(setEventDrawerTweenEditing({id: null}));
          //
          gsap.set(leftTooltipElement, {display: 'none'});
          document.body.style.cursor = 'auto';
        }
      },
      onDragStart: function() {
        if (guideHandle) {
          // used to position drag z index element above others
          dispatch(setEventDrawerTweenEditing({id}));
          //
          gsap.set(guide, {x: this.x});
          gsap.set(leftTooltipElement, {display: 'inline'});
          leftTooltipElement.innerText = `${(this.x / 4) / 100}s`;
          document.body.style.cursor = 'grabbing';
        }
      },
      onDrag: function() {
        gsap.set(tweenHandleElement, {
          x: `+=${this.deltaX}`,
          width: `-=${this.deltaX}`
        });
        if (guideHandle) {
          gsap.set(guide, {
            x: `+=${this.deltaX}`
          });
          leftTooltipElement.innerText = `${(this.x / 4) / 100}s`;
        }
      }
    });
    return handle;
  }

  const setupRightDraggableHandle = (id = tweenId, guideHandle = false): globalThis.Draggable[] => {
    killDraggableHandle('duration', id);
    const rightHandleElement = document.getElementById(`${id}-handle-duration`);
    const leftHandleElement = document.getElementById(`${id}-handle-both`);
    const tweenHandleElement = document.getElementById(`${id}-handle-delay`);
    const timelineElement = document.getElementById(`${id}-timeline`);
    const rightTooltipElement = document.getElementById(`${id}-tooltip-duration`);
    const guide = document.getElementById(`event-drawer-guide`);
    const handle = Draggable.create(rightHandleElement, {
      type: 'x',
      zIndexBoost: false,
      // cursor: 'pointer',
      // autoScroll: 1,
      bounds: {
        minX: gsap.getProperty(leftHandleElement, 'x') as number,
        maxX: timelineElement.clientWidth - (theme.unit * 4),
        minY: timelineElement.clientHeight,
        maxY: timelineElement.clientHeight
      },
      liveSnap: {
        x: function(value): number {
          return Math.round(value / theme.unit) * theme.unit;
        }
      },
      onRelease: function() {
        if (guideHandle) {
          // used to position drag z index element above others
          dispatch(setEventDrawerTweenEditing({id: null}));
          //
          gsap.set(rightTooltipElement, {display: 'none'});
          document.body.style.cursor = 'auto';
        }
      },
      onDragStart: function() {
        if (guideHandle) {
          // used to position drag z index element above others
          dispatch(setEventDrawerTweenEditing({id}));
          //
          gsap.set(guide, {x: this.x + (theme.unit * 4)});
          gsap.set(rightTooltipElement, {display: 'inline'});
          rightTooltipElement.innerText = `${(tweenHandleElement.clientWidth / 4) / 100}s`;
          document.body.style.cursor = 'grabbing';
        }
      },
      onDrag: function() {
        gsap.set(tweenHandleElement, {
          width: `+=${this.deltaX}`
        });
        if (guideHandle) {
          gsap.set(guide, {
            x: `+=${this.deltaX}`
          });
          rightTooltipElement.innerHTML = `${(tweenHandleElement.clientWidth / 4) / 100}s`;
        }
      }
    });
    return handle;
  }

  const setupTweenDraggableHandle = (id = tweenId, guideHandle = false): globalThis.Draggable[] => {
    killDraggableHandle('delay', id);
    const rightHandleElement = document.getElementById(`${id}-handle-duration`);
    const leftHandleElement = document.getElementById(`${id}-handle-both`);
    const tweenHandleElement = document.getElementById(`${id}-handle-delay`);
    const timelineElement = document.getElementById(`${id}-timeline`);
    const leftTooltipElement = document.getElementById(`${id}-tooltip-delay`);
    const guide = document.getElementById(`event-drawer-guide`);
    const handle = Draggable.create(tweenHandleElement, {
      type: 'x',
      zIndexBoost: false,
      // cursor: 'pointer',
      bounds: {
        minX: 0,
        maxX: timelineElement.clientWidth - tweenHandleElement.clientWidth,
        minY: timelineElement.clientHeight,
        maxY: timelineElement.clientHeight
      },
      // autoScroll: 1,
      liveSnap: {
        x: function(value): number {
          return Math.round(value / theme.unit) * theme.unit;
        }
      },
      onRelease: function() {
        if (guideHandle) {
          // used to position drag z index element above others
          dispatch(setEventDrawerTweenEditing({id: null}));
          //
          gsap.set(leftTooltipElement, {display: 'none'});
          document.body.style.cursor = 'auto';
        }
      },
      onDragStart: function() {
        if (guideHandle) {
          // used to position drag z index element above others
          dispatch(setEventDrawerTweenEditing({id}));
          //
          gsap.set(guide, {x: (gsap.getProperty(rightHandleElement, 'x') as number) + (theme.unit * 4)});
          gsap.set(leftTooltipElement, {display: 'inline'});
          leftTooltipElement.innerText = `${(gsap.getProperty(leftHandleElement, 'x') as number / 4) / 100}s`;
          document.body.style.cursor = 'grabbing';
        }
      },
      onDrag: function() {
        gsap.set([leftHandleElement, rightHandleElement], {
          x: `+=${this.deltaX}`
        });
        if (guideHandle) {
          gsap.set(guide, {
            x: `+=${this.deltaX}`
          });
          leftTooltipElement.innerText = `${(gsap.getProperty(leftHandleElement, 'x') as number / 4) / 100}s`;
        }
      }
    });
    return handle;
  }

  const handleMouseEnter = (): void => {
    dispatch(setEventDrawerTweenHoverThunk({
      id: tweenId
    }));
  }

  const handleMouseLeave = (): void => {
    dispatch(setEventDrawerTweenHoverThunk({
      id: null
    }));
  }

  const handleDragEnd = (allIds: string[], handles: { [id: string]: Btwx.EventTweenHandle }) => {
    dispatch(setLayersTweenTiming({
      tweens: allIds,
      ...allIds.reduce((result, current) => {
        const tweenHandleElement = document.getElementById(`${current}-handle-delay`);
        const leftHandleElement = document.getElementById(`${current}-handle-both`);
        const rightHandleElement = document.getElementById(`${current}-handle-duration`);
        const handle = handles[current];
        const leftHandlePos = gsap.getProperty(leftHandleElement, 'x') as number;
        const rightHandlePos = gsap.getProperty(rightHandleElement, 'x') as number;
        // const duration = (((rightHandlePos + 4 * 4) - leftHandlePos) / 4) / 100;
        const duration = (tweenHandleElement.clientWidth / 4) / 100;
        const delay = (leftHandlePos / 4) / 100;
        switch(handle) {
          case 'delay': {
            return {
              ...result,
              delay: {
                ...result.delay,
                [current]: delay
              }
            }
          }
          case 'both':
            return {
              ...result,
              delay: {
                ...result.delay,
                [current]: delay
              },
              duration: {
                ...result.duration,
                [current]: duration
              }
            }
          case 'duration':
            return {
              ...result,
              duration: {
                ...result.duration,
                [current]: duration
              }
            }
        }
      }, { duration: {}, delay: {} })
    }));
  }

  const updateDraggables = (allIds: string[], handles: { [id: string]: Btwx.EventTweenHandle }, guideHandle: string, e) => {
    allIds.forEach((id) => {
      const isLastSelected = id === allIds[allIds.length - 1];
      const isGuideHandle = id === guideHandle;
      let draggable: globalThis.Draggable[];
      switch(handles[id]) {
        case 'both':
          draggable = setupLeftDraggableHandle(id, isGuideHandle);
          break;
        case 'duration':
          draggable = setupRightDraggableHandle(id, isGuideHandle);
          break;
        case 'delay':
          draggable = setupTweenDraggableHandle(id, isGuideHandle);
          break;
      }
      draggable[0].startDrag(e);
      if (isLastSelected) {
        draggable[0].addEventListener('dragend', function() {
          const distance = Math.abs(this.endX - this.startX);
          if (distance >= 4) {
            handleDragEnd(allIds, handles);
          }
        })
      }
    });
  }

  const handleHandleMouseDown = (handle: Btwx.EventTweenHandle, e: any): void => {
    const isHandleSelected = selected.allIds.includes(tweenId) && selected.handle[tweenId] === handle;
    let newSelection: string[];
    let newSelectionHandles: { [id: string]: Btwx.EventTweenHandle };
    if (e.metaKey) {
      if (isHandleSelected) {
        newSelection = selected.allIds.filter((id) => id !== tweenId);
        newSelectionHandles = Object.keys(selected.handle).reduce((result, current) => {
          if (current !== tweenId) {
            result = {
              ...result,
              [current]: selected.handle[current]
            }
          }
          return result;
        }, {});
        killDraggableHandle(handle, tweenId);
        dispatch(deselectLayerEventTweens({
          tweens: [tweenId]
        }));
      } else {
        newSelection = [...selected.allIds.filter((id) => id !== tweenId), tweenId];
        newSelectionHandles = {
          ...selected.handle,
          [tweenId]: handle
        }
        dispatch(selectLayerEventTweens({
          tweens: [tweenId],
          handle: {
            [tweenId]: handle
          }
        }));
      }
    } else {
      if (!isHandleSelected) {
        newSelection = [tweenId];
        newSelectionHandles = { [tweenId]: handle };
        selected.allIds.forEach((id) => {
          killDraggableHandle(selected.handle[id], id);
        });
        dispatch(selectLayerEventTweens({
          tweens: [tweenId],
          handle: { [tweenId]: handle },
          newSelection: true
        }));
      } else {
        newSelection = selected.allIds;
        newSelectionHandles = selected.handle;
      }
    }
    updateDraggables(newSelection, newSelectionHandles, tweenId, e);
  }

  useEffect(() => {
    positionHandles();
  }, [tween.delay, tween.duration]);

  return (
    <div
      id={`${tweenId}-timeline`}
      className='c-event-drawer-event-layer__tween-timeline'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        // used to position drag z index element above others
        zIndex: editing ? 3 : 2
      }}>
      <EventDrawerEventClearSelection />
      <div
        id={`${tweenId}-handle-delay`}
        className={`c-timeline-tween-handle${
          selectedHandle && selectedHandle === 'delay'
          ? `${' '}${'c-timeline-tween-handle--selected'}`
          : ''
        }${
          selectedHandle && selectedHandle !== 'delay'
          ? `${' '}${`c-timeline-tween-handle--handle-selected`}`
          : ''
        }`}
        onMouseDown={(e) => handleHandleMouseDown('delay', e)} />
      <div
        id={`${tweenId}-handle-both`}
        className={`c-timeline-handle c-timeline-handle--both${
          selectedHandle && selectedHandle === 'both'
          ? `${' '}c-timeline-handle--selected`
          : ''
        }`}
        onMouseDown={(e) => handleHandleMouseDown('both', e)}>
        <div className='c-timeline-handle__ellipse' />
        <span
          id={`${tweenId}-tooltip-delay`}
          className='c-timeline-handle__tooltip' />
      </div>
      <div
        id={`${tweenId}-handle-duration`}
        className={`c-timeline-handle c-timeline-handle--duration${
          selectedHandle && selectedHandle === 'duration'
          ? `${' '}c-timeline-handle--selected`
          : ''
        }`}
        onMouseDown={(e) => handleHandleMouseDown('duration', e)}>
        <div className='c-timeline-handle__ellipse' />
        <span
          id={`${tweenId}-tooltip-duration`}
          className='c-timeline-handle__tooltip' />
      </div>
    </div>
  );
}

export default EventDrawerEventTimelineTween;