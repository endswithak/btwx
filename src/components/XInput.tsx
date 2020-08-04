import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerXPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerX } from '../store/actions/layer';
import { getLayerScope, getPositionInArtboard } from '../store/selectors/layer';

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
      if (nextX !== xValue && !isNaN(nextX)) {
        const nextXValue = Math.round(artboardParent ? nextX + (artboardParent.frame.x - (artboardParent.frame.width / 2)) : nextX);
        setLayerX({id: selected[0], x: nextXValue});
        setX(nextX);
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
  const xValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1: {
        const layerItem = layer.present.byId[layer.present.selected[0]];
        if (artboardParent) {
          return getPositionInArtboard(layerItem, artboardParent).x;
        } else {
          return Math.round(layerItem.frame.x);
        }
      }
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