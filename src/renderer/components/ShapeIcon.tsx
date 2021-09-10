import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
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
  const iconPathData = useSelector((state: RootState) => state.layer.present.byId[id] && state.pathData.byId[id] && state.pathData.byId[id].icon);
  // const closed = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[id] as Btwx.Shape | Btwx.CompoundShape).closed);

  return (
    <Icon
      name='shape'
      size={size}
      variant={variant}
      outline={outline}
      path={iconPathData} />
  )
}

export default ShapeIcon;