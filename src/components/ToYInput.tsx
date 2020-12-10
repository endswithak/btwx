import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLinesToYPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLinesToY } from '../store/actions/layer';

interface ToYInputProps {
  selected?: string[];
  yValue?: number | 'multi';
  setLinesToY?(payload: SetLinesToYPayload): LayerTypes;
}

const ToYInput = (props: ToYInputProps): ReactElement => {
  const { selected, setLinesToY, yValue } = props;
  const [y, setY] = useState(yValue !== 'multi' ? Math.round(yValue as number) : yValue);

  useEffect(() => {
    setY(yValue !== 'multi' ? Math.round(yValue as number) : yValue);
  }, [yValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setY(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const nextY = mexp.eval(`${y}`) as any;
      if (nextY !== yValue) {
        setLinesToY({layers: selected, y: Math.round(nextY)});
        setY(Math.round(nextY));
      } else {
        setY(yValue !== 'multi' ? Math.round(yValue as number) : yValue);
      }
    } catch(error) {
      setY(yValue !== 'multi' ? Math.round(yValue as number) : yValue);
    }
  }

  return (
    <SidebarInput
      value={y}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label={'Y'} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  yValue: number | 'multi';
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const yValue = selected.reduce((result: number | 'multi', current: string) => {
    const layerItem = layer.present.byId[current] as Btwx.Line;
    if (!result) {
      result = layerItem.to.y;
    }
    if (result && layerItem.to.y !== result) {
      result = 'multi';
    }
    return result;
  }, null);
  return { selected, yValue };
};

export default connect(
  mapStateToProps,
  { setLinesToY }
)(ToYInput);