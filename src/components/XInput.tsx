import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersXPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersX } from '../store/actions/layer';
import { getPositionInArtboard } from '../store/selectors/layer';

interface XInputProps {
  selected?: string[];
  xValue?: number | 'multi';
  setLayersX?(payload: SetLayersXPayload): LayerTypes;
}

const XInput = (props: XInputProps): ReactElement => {
  const { selected, setLayersX, xValue } = props;
  const [x, setX] = useState(xValue !== 'multi' ? Math.round(xValue as number) : xValue);

  useEffect(() => {
    setX(xValue !== 'multi' ? Math.round(xValue as number) : xValue);
  }, [xValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setX(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      const nextX = mexp.eval(`${x}`) as any;
      if (nextX !== xValue) {
        setLayersX({layers: selected, x: Math.round(nextX)});
        setX(Math.round(nextX));
      } else {
        setX(xValue !== 'multi' ? Math.round(xValue as number) : xValue);
      }
    } catch(error) {
      setX(xValue !== 'multi' ? Math.round(xValue as number) : xValue);
    }
  }

  return (
    <SidebarInput
      value={x}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label={'X'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  // const artboardParents = selected.reduce((result: Btwx.Artboard[], current: string) => {
  //   const layerItem = layer.present.byId[current];
  //   const layerScope = layerItem.scope;
  //   if (layerScope.length > 1 && layer.present.byId[layerScope[1]].type === 'Artboard') {
  //     result = [...result, layer.present.byId[layerScope[1]] as Btwx.Artboard];
  //   } else {
  //     result = [...result, null];
  //   }
  //   return result;
  // }, []);
  const xValues = selected.reduce((result: number[], current: string, index: number) => {
    const layerItem = layer.present.byId[current];
    // const parent = artboardParents[index];
    // if (parent) {
    //   result = [...result, getPositionInArtboard(layerItem, parent).x];
    // } else {
    //   result = [...result, layerItem.frame.x];
    // }
    result = [...result, layerItem.frame.x];
    return result;
  }, []);
  const xValue = (() => {
    if (xValues.every((value: number) => value === xValues[0])) {
      return xValues[0];
    } else {
      return 'multi';
    }
  })();
  return { selected, xValue };
};

export default connect(
  mapStateToProps,
  { setLayersX }
)(XInput);