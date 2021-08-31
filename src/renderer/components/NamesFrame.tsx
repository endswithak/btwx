import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getAllArtboardItems } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { activateUI } from './CanvasUI';

export const namesFrameId = 'namesFrame';

export const namesFrameJSON = `[
  "Group", {
    "applyMatrix": true,
    "name": "Name Frame",
    "data":{
      "id": "${namesFrameId}",
      "type": "UIElement"
    }
  }
]`;

export const getNamesFrame = (): paper.Group =>
  paperMain.projects[0].getItem({ data: { id: namesFrameId } }) as paper.Group;

export const clearNamesFrame = () => {
  const namesFrame = getNamesFrame();
  if (namesFrame) {
    namesFrame.removeChildren();
  }
}

export const updateNamesFrame = (artboards: { [id: string]: Btwx.Artboard }): void => {
  activateUI();
  clearNamesFrame();
  if (artboards) {
    const namesFrame = getNamesFrame();
    Object.keys(artboards).forEach((id: string) => {
      const artboardItem = artboards[id];
      // const paperLayer = getPaperLayer(artboardItem.id, artboardItem.projectIndex);
      // const artboardBackground = paperLayer.getItem({data: {id: 'artboardBackground'}});
      const bottomLeft = new paperMain.Point(artboardItem.frame.x - (artboardItem.frame.width / 2), artboardItem.frame.y + (artboardItem.frame.height / 2));
      const text = new paperMain.PointText({
        point: bottomLeft.add(new paperMain.Point(0, 24 * (1 / paperMain.view.zoom))),
        content: artboardItem.name,
        fillColor: '#999',
        fontSize: 12 * (1 / paperMain.view.zoom),
        fontFamily: 'Space Mono',
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: artboardItem.id,
          elementId: namesFrameId
        }
      });
      const textBackground = new paperMain.Path.Rectangle({
        from: text.bounds.topLeft,
        to: text.bounds.bottomRight,
        fillColor: '#fff',
        opacity: 0,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: artboardItem.id,
          elementId: namesFrameId
        }
      });
      const textContainer = new paperMain.Group({
        parent: namesFrame,
        children: [textBackground, text],
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: artboardItem.id,
          elementId: namesFrameId
        }
      });
    });
  }
};

const NamesFrame = (): ReactElement => {
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const artboards = useSelector((state: RootState) => getAllArtboardItems(state));

  useEffect(() => {
    updateNamesFrame(artboards);
    return (): void => {
      clearNamesFrame();
    }
  }, [zoom, artboards]);

  return null;
}

export default NamesFrame;