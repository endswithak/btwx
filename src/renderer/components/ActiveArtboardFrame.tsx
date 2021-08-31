import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import getTheme from '../theme';
import { getActiveArtboardBounds } from '../store/selectors/layer';
import { activateUI } from './CanvasUI';

export const activeArtboardFrameId = 'activeArtboardFrame';

export const activeArtboardFrameJSON = `[
  "Group", {
    "applyMatrix": true,
    "name": "Active Artboard Frame",
    "data": {
      "id": "${activeArtboardFrameId}",
      "type": "UIElement"
    }
  }
]`;

export const getActiveArtboardFrame = (): paper.Group =>
  paperMain.projects[0].getItem({ data: { id: activeArtboardFrameId } }) as paper.Group;

export const clearActiveArtboardFrame = () => {
  const activeArtboardFrame = getActiveArtboardFrame();
  if (activeArtboardFrame) {
    activeArtboardFrame.removeChildren();
  }
}

export const updateActiveArtboardFrame = ({
  bounds,
  themeName
}: {
  bounds: paper.Rectangle;
  themeName: Btwx.ThemeName;
}): void => {
  activateUI();
  clearActiveArtboardFrame();
  const theme = getTheme(themeName);
  if (bounds) {
    const activeArtboardFrame = getActiveArtboardFrame();
    const topLeft = bounds.topLeft;
    const bottomRight = bounds.bottomRight;
    const gap = 4 * (1 / paperMain.view.zoom);
    new paperMain.Path.Rectangle({
      from: topLeft.subtract(new paperMain.Point(gap, gap)),
      to: bottomRight.add(new paperMain.Point(gap, gap)),
      radius: 2 * (1 / paperMain.view.zoom),
      strokeColor: theme.palette.primary,
      strokeWidth: 4 * (1 / paperMain.view.zoom),
      parent: activeArtboardFrame
    });
  }
};

const ActiveArtboardFrame = (): ReactElement => {
  const themeName = useSelector((state: RootState) => state.preferences.theme);
  const activeArtboardBounds = useSelector((state: RootState) => getActiveArtboardBounds(state));
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);

  useEffect(() => {
    updateActiveArtboardFrame({
      bounds: activeArtboardBounds,
      themeName
    });
    return () => {
      clearActiveArtboardFrame();
    }
  }, [activeArtboardBounds, zoom, themeName]);

  return null;
}

export default ActiveArtboardFrame;