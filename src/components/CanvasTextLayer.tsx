import React, { ReactElement, useEffect, useState } from 'react';
import tinyColor from 'tinycolor2';
import { getPaperStyle, getPaperParent, getTextAbsPoint, getLayerAbsBounds, getPaperLayerIndex, getLayerTextContent } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayerContainer, { CanvasLayerContainerProps } from './CanvasLayerContainer';
import CanvasLayerFrame from './CanvasLayerFrame';
import CanvasLayerStyle from './CanvasLayerStyle';
import CanvasLayerTransform from './CanvasLayerTransform';
import CanvasMaskableLayer from './CanvasMaskableLayer';
import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';

interface CanvasTextLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

const CanvasTextLayer = (props: CanvasLayerContainerProps & CanvasTextLayerProps & { layerItem: Btwx.Text }): ReactElement => {
  const { id, paperScope, layerItem, parentItem, artboardItem, projectIndex, rendered, tweening, setRendered } = props;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const [prevText, setPrevText] = useState(layerItem.text);
  const [prevTweening, setPrevTweening] = useState(tweening);

  const getPaperLayer = (): {
    paperLayer: paper.Group;
    textLinesGroup: paper.Group;
    textBackground: paper.Path.Rectangle;
  } => {
    const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
    const paperLayer = paperProject.getItem({data: {id: layerItem.id}}) as paper.Group;
    if (paperLayer) {
      const textLinesGroup = paperLayer.getItem({data:{id:'textLines'}}) as paper.Group;
      const textBackground = paperLayer.getItem({data:{id:'textBackground'}}) as paper.Path.Rectangle;
      return {
        paperLayer,
        textLinesGroup,
        textBackground
      };
    } else {
      return {
        paperLayer: null,
        textLinesGroup: null,
        textBackground: null
      }
    }
  }

  const createText = (): paper.Group => {
    const absPoint = getTextAbsPoint(layerItem.point, artboardItem.frame);
    const textContainer = new paperLayerScope.Group({
      name: layerItem.name,
      insert: false,
      data: {
        id,
        type: 'Layer',
        layerType: 'Text',
        scope: layerItem.scope
      },
      children: [
        new paperLayerScope.Path.Rectangle({
          rectangle: getLayerAbsBounds(layerItem.frame, artboardItem.frame),
          // fillColor: tinyColor('#fff').setAlpha(0.01).toHslString(),
          // blendMode: 'multiply',
          fillColor: tinyColor('red').setAlpha(0.25).toHslString(),
          data: { id: 'textBackground', type: 'LayerChild', layerType: 'Text' }
        }),
        new paperLayerScope.Group({
          data: { id: 'textLines', type: 'LayerChild', layerType: 'Text' },
          children: layerItem.lines.reduce((result: paper.PointText[], current: Btwx.TextLine, index: number) => {
            const line = new paperLayerScope.PointText({
              point: new paperLayerScope.Point(absPoint.x, absPoint.y + (index * layerItem.textStyle.leading)),
              content: getLayerTextContent(current.text, layerItem.textStyle.textTransform),
              data: {
                id: 'textLine',
                type: 'LayerChild',
                layerType: 'Text'
              },
              ...getPaperStyle({
                style: layerItem.style,
                textStyle: layerItem.textStyle,
                isLine: false,
                layerFrame: layerItem.frame,
                artboardFrame: artboardItem.frame
              })
            });
            line.leading = layerItem.textStyle.fontSize;
            line.skew(new paperLayerScope.Point(-layerItem.textStyle.oblique, 0));
            line.leading = layerItem.textStyle.leading;
            return [...result, line];
          }, [])
        })
      ]
    });
    textContainer.children[0].bounds = textContainer.children[1].bounds;
    textContainer.scale(layerItem.transform.horizontalFlip ? -1 : 1, layerItem.transform.verticalFlip ? -1 : 1);
    textContainer.rotation = layerItem.transform.rotation;
    return textContainer;
  }

  useEffect(() => {
    getPaperParent({
      paperScope,
      projectIndex,
      parent: layerItem.parent,
      isParentArtboard: layerItem.parent === layerItem.artboard,
      masked: layerItem.masked,
      underlyingMask: layerItem.underlyingMask
    }).insertChild(
      getPaperLayerIndex(layerItem, parentItem),
      createText()
    );
    setRendered(true);
    return (): void => {
      const { paperLayer } = getPaperLayer();
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  useEffect(() => {
    if (prevTweening !== tweening && paperScope === 'preview') {
      if (!tweening) {
        const { paperLayer } = getPaperLayer();
        paperLayer.replaceWith(createText());
      }
      setPrevTweening(tweening);
    }
  }, [tweening]);

  useEffect(() => {
    if (rendered && prevText !== layerItem.text) {
      const { paperLayer, textLinesGroup, textBackground } = getPaperLayer();
      const absPoint = getTextAbsPoint(layerItem.point, artboardItem.frame);
      paperLayer.rotation = -layerItem.transform.rotation;
      textLinesGroup.removeChildren();
      for(let i = 0; i < layerItem.lines.length; i++) {
        const lineItem = layerItem.lines[i];
        const linePaperLayer = new paperLayerScope.PointText({
          parent: textLinesGroup,
          point: new paperLayerScope.Point(absPoint.x, absPoint.y + (i * layerItem.textStyle.leading)),
          content: getLayerTextContent(lineItem.text, layerItem.textStyle.textTransform),
          data: {
            id: 'textLine',
            type: 'LayerChild',
            layerType: 'Text'
          },
          ...getPaperStyle({
            style: layerItem.style,
            textStyle: layerItem.textStyle,
            isLine: false,
            layerFrame: layerItem.frame,
            artboardFrame: artboardItem.frame
          })
        });
        linePaperLayer.leading = layerItem.textStyle.fontSize;
        linePaperLayer.skew(new paperLayerScope.Point(-layerItem.textStyle.oblique, 0));
        linePaperLayer.leading = layerItem.textStyle.leading;
      }
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevText(layerItem.text);
    }
  }, [layerItem.text]);

  return (
    <>
      <CanvasMaskableLayer
        layerItem={layerItem as Btwx.MaskableLayer}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      <CanvasLayerTransform
        layerItem={layerItem}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      <CanvasLayerFrame
        layerItem={layerItem}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      <CanvasLayerStyle
        layerItem={layerItem}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      {
        paperScope === 'preview' && rendered && !tweening && !prevTweening
        ? layerItem.events.map((eventId) => (
            <CanvasPreviewLayerEvent
              key={eventId}
              eventId={eventId} />
          ))
        : null
      }
    </>
  );
}

export default CanvasLayerContainer(CanvasTextLayer);