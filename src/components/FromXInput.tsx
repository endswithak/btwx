import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLinesFromXPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLinesFromX } from '../store/actions/layer';

interface FromXInputProps {
  selected?: string[];
  xValue?: number | 'multi';
  setLinesFromX?(payload: SetLinesFromXPayload): LayerTypes;
}

const FromXInput = (props: FromXInputProps): ReactElement => {
  const { selected, setLinesFromX, xValue } = props;
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
        setLinesFromX({layers: selected, x: Math.round(nextX)});
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

const mapStateToProps = (state: RootState): {
  selected: string[];
  xValue: number | 'multi';
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const xValue = selected.reduce((result: number | 'multi', current: string) => {
    const layerItem = layer.present.byId[current] as Btwx.Line;
    if (!result) {
      result = layerItem.from.x;
    }
    if (result && layerItem.from.x !== result) {
      result = 'multi';
    }
    return result;
  }, null);
  return { selected, xValue };
};

export default connect(
  mapStateToProps,
  { setLinesFromX }
)(FromXInput);