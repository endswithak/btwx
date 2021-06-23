import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getScrollFrameBounds } from '../store/selectors/layer';
import { updateScrollFrame } from '../store/actions/layer';
import { disableScrollFrameTool } from '../store/actions/scrollFrameTool';
import { paperMain } from '../canvas';

const ScrollFrame = (): ReactElement => {
  const themeName = useSelector((state: RootState) => state.preferences.theme);
  const scrollFrameId = useSelector((state: RootState) => state.scrollFrameTool.id);
  const scrollFrameBounds: paper.Rectangle = useSelector((state: RootState) => getScrollFrameBounds(state));
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const dispatch = useDispatch();

  const onMouseDown = (event: any): void => {
    if ((event.target.id as string).startsWith('canvas')) {
      const eventPoint = paperMain.view.getEventPoint(event);
      const hitResult = paperMain.project.hitTest(eventPoint);
      if (!hitResult || !(hitResult.item && hitResult.item.data && hitResult.item.data.elementId === 'scrollFrame')) {
        dispatch(disableScrollFrameTool());
      }
    } else if (event.target.id !== 'control-scroll-resize') {
      dispatch(disableScrollFrameTool());
    }
  }

  useEffect(() => {
    updateScrollFrame({
      bounds: scrollFrameBounds,
      handle: 'all',
      themeName
    });
    return () => {
      const scrollFrame = paperMain.projects[0].getItem({ data: { id: 'scrollFrame' } });
      scrollFrame.removeChildren();
    }
  }, [themeName, scrollFrameBounds, zoom, scrollFrameId]);

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown);
    return (): void => {
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  return null;
}

export default ScrollFrame;