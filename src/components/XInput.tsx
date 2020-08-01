import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerXPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerX } from '../store/actions/layer';
import { getPaperLayer, getLayerScope } from '../store/selectors/layer';

interface XInputProps {
  selected?: string[];
  xValue?: number;
  artboardParent?: em.Artboard;
  setLayerX?(payload: SetLayerXPayload): LayerTypes;
}

const XInput = (props: XInputProps): ReactElement => {
  const { selected, setLayerX, xValue, artboardParent } = props;
  const [x, setX] = useState(xValue);

  useEffect(() => {
    setX(xValue);
  }, [xValue, selected, artboardParent]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setX(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      const nextX = evaluate(`${x}`);
      if (nextX !== artboardParent ? artboardParent.frame.x - xValue : xValue && !isNaN(nextX)) {
        const paperLayer = getPaperLayer(selected[0]);
        const nextXValue = artboardParent ? nextX + (artboardParent.frame.x - (artboardParent.frame.width / 2)) : nextX;
        paperLayer.position.x = nextXValue;
        setLayerX({id: selected[0], x: nextXValue});
        setX(nextXValue);
      } else {
        setX(xValue);
      }
    } catch(error) {
      setX(xValue);
    }
  }

  return (
    <SidebarInput
      value={x}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label={'X'}
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
  const xValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return artboardParent ? Math.round(layer.present.byId[layer.present.selected[0]].frame.x - (artboardParent.frame.x - (artboardParent.frame.width / 2))) : Math.round(layer.present.byId[layer.present.selected[0]].frame.x);
      default:
        return 'multi';
    }
  })();
  return { selected, xValue, artboardParent };
};

export default connect(
  mapStateToProps,
  { setLayerX }
)(XInput);