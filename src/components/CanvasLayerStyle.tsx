import React, { ReactElement } from 'react';
import  CanvasLayerFillStyle from './CanvasLayerFillStyle';
import  CanvasLayerStrokeStyle from './CanvasLayerStrokeStyle';
import  CanvasLayerStrokeOptionsStyle from './CanvasLayerStrokeOptionsStyle';
import  CanvasLayerShadowStyle from './CanvasLayerShadowStyle';
import  CanvasLayerContextStyle from './CanvasLayerContextStyle';
import  CanvasLayerTextStyle from './CanvasLayerTextStyle';

interface CanvasLayerStyleProps {
  layerItem: Btwx.Layer;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerStyle = (props: CanvasLayerStyleProps): ReactElement => (
  <>
    <CanvasLayerContextStyle
      {...props} />
    <CanvasLayerFillStyle
      {...props} />
    <CanvasLayerStrokeStyle
      {...props} />
    <CanvasLayerStrokeOptionsStyle
      {...props} />
    <CanvasLayerShadowStyle
      {...props} />
    {
      props.layerItem.type === 'Text'
      ? <CanvasLayerTextStyle
          {...props}
          layerItem={props.layerItem as Btwx.Text} />
      : null
    }
  </>
)

export default CanvasLayerStyle;