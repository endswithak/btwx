import React, { ReactElement } from 'react';
import { paperMain } from '../canvas';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getShapeItemSegments } from '../store/selectors/layer';
import Icon from './Icon';

interface IconProps {
  id: string;
  name?: string;
  style?: any;
  size?: Btwx.SizeVariant;
  shapeId?: string;
  variant?: Btwx.TextColorVariant;
  outline?: boolean;
  path?: string;
}

const ShapeIcon = (props: IconProps): ReactElement => {
  const { id, name, style, size, shapeId, variant, outline, path } = props;
  const segmentMap = useSelector((state: RootState) => getShapeItemSegments(state, id));
  const closed = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[id] as Btwx.Shape | Btwx.CompoundShape).closed);
  const getShapeIcon = (segmentMap: {
    segments: number[][][][];
    closedMap: boolean[];
  }): string => {
    const layerIcon = new paperMain.CompoundPath({
      insert: false,
      closed: closed,
      children: segmentMap.segments.map((pathSegments, index) =>
        new paperMain.Path({
          segments: pathSegments,
          closed: segmentMap.closedMap[index]
        })
      )
    });
    layerIcon.fitBounds(new paperMain.Rectangle({
      point: new paperMain.Point(0,0),
      size: new paperMain.Size(24,24)
    }));
    return layerIcon.pathData;
  }
  return (
    <Icon
      name='shape'
      size={size}
      variant={variant}
      outline={outline}
      path={getShapeIcon(segmentMap)} />
  )
}

export default ShapeIcon;