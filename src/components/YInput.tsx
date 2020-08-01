import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerYPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerY } from '../store/actions/layer';
import { getPaperLayer, getLayerScope } from '../store/selectors/layer';

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
      if (nextY !== artboardParent ? artboardParent.frame.y - yValue : yValue && !isNaN(nextY)) {
        const paperLayer = getPaperLayer(selected[0]);
        const nextYValue = artboardParent ? nextY + (artboardParent.frame.y - (artboardParent.frame.height / 2)) : nextY;
        paperLayer.position.y = nextYValue;
        setLayerY({id: selected[0], y: nextYValue});
        setY(nextYValue);
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
  const artboardParent = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1: {
        const layerScope = getLayerScope(layer.present, layer.present.selected[0]);
        const containsArtboard = layer.present.allArtboardIds.includes(layerScope[0]);
        return containsArtboard ? layer.present.byId[layerScope[0]] : null;
      }
      default:
        return null;
    }
  })();
  const yValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return artboardParent ? Math.round(layer.present.byId[layer.present.selected[0]].frame.y - (artboardParent.frame.y - (artboardParent.frame.height / 2))) : Math.round(layer.present.byId[layer.present.selected[0]].frame.y);
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