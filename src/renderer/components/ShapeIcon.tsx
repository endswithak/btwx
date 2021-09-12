import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getShapeItemPathData } from '../utils';
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
  const pathData = useSelector((state: RootState) => state.layer.present.byId[id] && getShapeItemPathData({id, layersById: state.layer.present.byId, icon: true}));
  // const closed = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[id] as Btwx.Shape | Btwx.CompoundShape).closed);

  return (
    <Icon
      name='shape'
      size={size}
      variant={variant}
      outline={outline}
      path={pathData} />
  )
}

export default ShapeIcon;