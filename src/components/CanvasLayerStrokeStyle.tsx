import React, { ReactElement, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';

interface CanvasLayerStrokeStyleProps {
  id: string;
}

interface CanvasLayerStrokeStyleStateProps {
  layerType: Btwx.LayerType;
  isLine: boolean;
  projectIndex: number;
  layerFrame: Btwx.Frame;
  artboardFrame: Btwx.Frame;
  strokeEnabled: boolean;
  strokeFillType: Btwx.FillType;
  strokeColor: Btwx.Color;
  strokeGradientType: Btwx.GradientType;
  strokeGradientOrigin: Btwx.Point;
  strokeGradientDestination: Btwx.Point;
  strokeGradientStops: Btwx.GradientStop[];
  strokeWidth: number;
}

const CanvasLayerStrokeStyle = (props: CanvasLayerStrokeStyleProps & CanvasLayerStrokeStyleStateProps): ReactElement => {
  const { id, layerType, isLine, projectIndex, layerFrame, artboardFrame, strokeEnabled, strokeFillType, strokeColor, strokeGradientType, strokeGradientOrigin, strokeGradientDestination, strokeGradientStops, strokeWidth } = props;
  // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  // const layerType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type);
  // const isLine = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Line');
  // const projectIndex = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
  // // frames
  // const layerFrame = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].frame);
  // const artboardFrame = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).frame);
  // // stroke
  // const strokeEnabled = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.enabled);
  // const strokeWidth = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.width);
  // const strokeFillType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.fillType);
  // const strokeColor = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.color);
  // const strokeGradientType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.gradient.gradientType);
  // const strokeGradientOrigin = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.gradient.origin);
  // const strokeGradientDestination = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.gradient.destination);
  // const strokeGradientStops = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.gradient.stops);

  const getStyleLayer = (): paper.Item => {
    let paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
    if (paperLayer) {
      if (layerType === 'Text') {
        paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
      }
      if (layerType === 'Artboard') {
        paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
      }
    }
    return paperLayer;
  }

  useEffect(() => {
    const paperLayer = getStyleLayer();
    if (paperLayer) {
      if (strokeEnabled) {
        const layerPosition = new uiPaperScope.Point(layerFrame.x, layerFrame.y);
        const artboardPosition = new uiPaperScope.Point(artboardFrame.x, artboardFrame.y);
        const layerAbsPosition = layerPosition.add(artboardPosition);
        switch(strokeFillType) {
          case 'color':
            paperLayer.strokeColor = {
              hue: strokeColor.h,
              saturation: strokeColor.s,
              lightness: strokeColor.l,
              alpha: strokeColor.a
            } as paper.Color;
            break;
          case 'gradient':
            paperLayer.strokeColor  = {
              gradient: {
                stops: strokeGradientStops.reduce((result, current) => {
                  result = [
                    ...result,
                    new uiPaperScope.GradientStop({
                      hue: current.color.h,
                      saturation: current.color.s,
                      lightness: current.color.l,
                      alpha: current.color.a
                    } as paper.Color, current.position)
                  ];
                  return result;
                }, []) as paper.GradientStop[],
                radial: strokeGradientType === 'radial'
              },
              origin: new uiPaperScope.Point(
                (strokeGradientOrigin.x * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x,
                (strokeGradientOrigin.y * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y
              ),
              destination: new uiPaperScope.Point(
                (strokeGradientDestination.x * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x,
                (strokeGradientDestination.y * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y
              )
            } as Btwx.PaperGradientFill;
            break;
        }
      } else {
        paperLayer.strokeColor = null;
      }
    }
  }, [
      strokeEnabled, strokeFillType, strokeColor, strokeGradientType,
      strokeGradientOrigin, strokeGradientDestination, strokeGradientStops,
      layerFrame
     ]
  );

  useEffect(() => {
    const paperLayer = getStyleLayer();
    if (paperLayer) {
      paperLayer.strokeWidth = strokeWidth;
    }
  }, [strokeWidth]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasLayerStrokeStyleProps): CanvasLayerStrokeStyleStateProps => {
  const layerItem = state.layer.present.byId[ownProps.id];
  const artboardItem = layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null;
  const isLine = layerItem ? layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' : null;
  const layerType = layerItem ? layerItem.type : null;
  const projectIndex = layerItem ? artboardItem.projectIndex : null;
  const layerFrame = layerItem ? layerItem.frame : null;
  const artboardFrame = layerItem ? artboardItem.frame : null;
  const strokeEnabled = layerItem ? layerItem.style.stroke.enabled : null;
  const strokeFillType = layerItem ? layerItem.style.stroke.fillType : null;
  const strokeColor = layerItem ? layerItem.style.stroke.color : null;
  const strokeGradientType = layerItem ? layerItem.style.stroke.gradient.gradientType : null;
  const strokeGradientOrigin = layerItem ? layerItem.style.stroke.gradient.origin : null;
  const strokeGradientDestination = layerItem ? layerItem.style.stroke.gradient.destination : null;
  const strokeGradientStops = layerItem ? layerItem.style.stroke.gradient.stops : null;
  const strokeWidth = layerItem ? layerItem.style.stroke.width : null;
  return {
    layerType,
    isLine,
    projectIndex,
    layerFrame,
    artboardFrame,
    strokeEnabled,
    strokeFillType,
    strokeColor,
    strokeGradientType,
    strokeGradientOrigin,
    strokeGradientDestination,
    strokeGradientStops,
    strokeWidth
  }
}

export default connect(
  mapStateToProps
)(CanvasLayerStrokeStyle);