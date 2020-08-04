import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerYPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerY } from '../store/actions/layer';
import { getLayerScope, getPositionInArtboard } from '../store/selectors/layer';

interface YInputProps {
  selected?: string[];
  yValue?: number;
  artboardParent?: em.Artboard;
  setLayerY?(payload: SetLayerYPayload): LayerTypes;
}

const YInput = (props: YInputProps): ReactElement => {
  const { selected, setLayerY, yValue, artboardParent } = props;
  const [y, setY] = useState(props.yValue);

  useEffect(() => {
    setY(yValue);
  }, [yValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setY(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const nextY = evaluate(`${y}`);
      if (nextY !== yValue && !isNaN(nextY)) {
        const nextYValue = Math.round(artboardParent ? nextY + (artboardParent.frame.y - (artboardParent.frame.height / 2)) : nextY);
        setLayerY({id: selected[0], y: nextYValue});
        setY(nextY);
      } else {
        setY(yValue);
      }
    } catch(error) {
      setY(yValue);
    }
  }

  return (
    <SidebarInput
      value={y}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label={'Y'}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const artboardParent = ((): em.Artboard => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1: {
        const layerScope = getLayerScope(layer.present, layer.present.selected[0]);
        if (layerScope.some((id: string) => layer.present.allArtboardIds.includes(id))) {
          const artboard = layerScope.find((id: string) => layer.present.allArtboardIds.includes(id));
          return layer.present.byId[artboard] as em.Artboard;
        } else {
          return null;
        }
      }
      default:
        return null;
    }
  })();
  const yValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1: {
        const layerItem = layer.present.byId[layer.present.selected[0]];
        if (artboardParent) {
          return getPositionInArtboard(layerItem, artboardParent).y;
        } else {
          return Math.round(layerItem.frame.y);
        }
      }
      default:
        return 'multi';
    }
  })();
  return { selected, yValue, artboardParent };
};

export default connect(
  mapStateToProps,
  { setLayerY }
)(YInput);