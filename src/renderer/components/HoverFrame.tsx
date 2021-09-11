import React, { ReactElement, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { RootState } from '../store/reducers';
import { getHoverBounds } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import getTheme from '../theme';
import { activateUI } from './CanvasUI';

export const hoverFrameId = 'hoverFrame';

export const hoverFrameJSON = `[
  "Group", {
    "applyMatrix": true,
    "name": "Hover Frame",
    "data": {
      "id": "${hoverFrameId}",
      "type": "UIElement"
    }
  }
]`;

export const getHoverFrame = (): paper.Group =>
  paperMain.projects[0].getItem({ data: { id: hoverFrameId } }) as paper.Group;

export const clearHoverFrame = () => {
  const hoverFrame = getHoverFrame();
  if (hoverFrame) {
    hoverFrame.removeChildren();
  }
}

export const updateHoverFrame = ({
  hoverItem,
  themeName,
  artboardItem,
  pathData
}: {
  hoverItem: Btwx.Layer;
  themeName: Btwx.ThemeName;
  artboardItem?: Btwx.Artboard;
  pathData: string;
}): void => {
  activateUI();
  clearHoverFrame();
  if (hoverItem) {
    const hoverFrame = getHoverFrame();
    const theme = getTheme(themeName);
    const hoverFrameConstants = {
      strokeColor: theme.palette.primary,
      strokeWidth: 2 / paperMain.view.zoom,
      parent: hoverFrame
    }
    let hoverPosition = new paperMain.Point(hoverItem.frame.x, hoverItem.frame.y);
    let artboardPosition: paper.Point;
    if (artboardItem) {
      artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      hoverPosition = hoverPosition.add(artboardPosition);
    }
    const hoverItemBounds = new paperMain.Rectangle({
      from: new paperMain.Point(
        hoverPosition.x - (hoverItem.frame.width / 2),
        hoverPosition.y - (hoverItem.frame.height / 2)
      ),
      to: new paperMain.Point(
        hoverPosition.x + (hoverItem.frame.width / 2),
        hoverPosition.y + (hoverItem.frame.height / 2)
      )
    });
    switch(hoverItem.type) {
      case 'Shape':
      case 'CompoundShape':
        new paperMain.CompoundPath({
          ...hoverFrameConstants,
          // closed: (hoverItem as Btwx.Shape).closed,
          pathData
        });
        break;
      case 'Text': {
        const textLinesGroup = new paperMain.Group({
          children: [
            new paperMain.Path.Rectangle({
              rectangle: hoverItemBounds,
              blendMode: 'multiply',
              fill: '#fff'
            }),
            ...(hoverItem as Btwx.Text).lines.reduce((result, current) => {
              return [
                ...result,
                new paperMain.Path.Line({
                  from: (() => {
                    switch((hoverItem as Btwx.Text).textStyle.justification) {
                      case 'left':
                        return new paperMain.Point(current.anchor.x, current.anchor.y).add(artboardPosition);
                      case 'center':
                        return new paperMain.Point(current.anchor.x - (current.frame.width / 2), current.anchor.y).add(artboardPosition);
                      case 'right':
                        return new paperMain.Point(current.anchor.x - current.frame.width, current.anchor.y).add(artboardPosition);
                    }
                  })(),
                  to: (() => {
                    switch((hoverItem as Btwx.Text).textStyle.justification) {
                      case 'left':
                        return new paperMain.Point(current.anchor.x + current.frame.width, current.anchor.y).add(artboardPosition);
                      case 'center':
                        return new paperMain.Point(current.anchor.x + (current.frame.width / 2), current.anchor.y).add(artboardPosition);
                      case 'right':
                        return new paperMain.Point(current.anchor.x, current.anchor.y).add(artboardPosition);
                    }
                  })(),
                  strokeColor: theme.palette.primary,
                  strokeWidth: 2 / paperMain.view.zoom,
                  parent: textLinesGroup
                })
              ]
            }, [])
          ],
          insert: false
        });
        textLinesGroup.rotation = hoverItem.transform.rotation;
        textLinesGroup.scale(hoverItem.transform.horizontalFlip ? -1 : 1, hoverItem.transform.verticalFlip ? -1 : 1);
        textLinesGroup.parent = hoverFrame;
        break;
      }
      default:
        new paperMain.Path.Rectangle({
          ...hoverFrameConstants,
          from: hoverItemBounds.topLeft,
          to: hoverItemBounds.bottomRight,
        });
        break;
    }
  }
};

const HoverFrame = (): ReactElement => {
  const themeName = useSelector((state: RootState) => state.preferences.theme);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const hoverBounds = useSelector((state: RootState) => getHoverBounds(state));
  const hoverItem = useSelector((state: RootState) => state.layer.present.hover && state.layer.present.byId[state.layer.present.hover] ? state.layer.present.byId[state.layer.present.hover] : null);
  const artboardItem = useSelector((state: RootState) => state.layer.present.hover && state.layer.present.byId[state.layer.present.hover] && state.layer.present.byId[state.layer.present.hover].type !== 'Artboard' ? state.layer.present.byId[state.layer.present.byId[state.layer.present.hover].artboard] : null) as Btwx.Artboard;
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const pathData = useSelector((state: RootState) => hoverItem && (hoverItem.type === 'Shape' || hoverItem.type === 'CompoundShape') && state.pathData.byId[hoverItem.id] && state.pathData.byId[hoverItem.id].pathData);

  const debounceUpdateHoverFrame = useCallback(debounce(({hoverItem, artboardItem, themeName, pathData}) => {
    updateHoverFrame({
      hoverItem,
      artboardItem,
      themeName,
      pathData
    });
  }, 125, {
    'leading': false,
    'trailing': true
  }), []);

  useEffect(() => {
    debounceUpdateHoverFrame.cancel();
    debounceUpdateHoverFrame({
      hoverItem,
      artboardItem,
      themeName,
      pathData
    });
    return (): void => {
      debounceUpdateHoverFrame.cancel();
      clearHoverFrame();
    }
  }, [hover, hoverItem, zoom, hoverBounds, themeName, pathData]);

  return null;
}

export default HoverFrame;