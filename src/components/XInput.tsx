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

const mapStateToProps = (state: RootState): {
  selected: string[];
  xValue: number | 'multi';
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const xValue = selected.reduce((result: number | 'multi', current: string) => {
    const layerItem = layer.present.byId[current] as Btwx.Line;
    if (!result) {
      result = layerItem.frame.x;
    }
    if (result && layerItem.frame.x !== result) {
      result = 'multi';
    }
    return result;
  }, null);
  return { selected, xValue };
};

export default connect(
  mapStateToProps,
  { setLayersX }
)(XInput);