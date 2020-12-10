import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersYPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersY } from '../store/actions/layer';
import { getPositionInArtboard } from '../store/selectors/layer';

interface YInputProps {
  selected?: string[];
  yValue?: number | 'multi';
  setLayersY?(payload: SetLayersYPayload): LayerTypes;
}

const YInput = (props: YInputProps): ReactElement => {
  const { selected, setLayersY, yValue } = props;
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
        setLayersY({layers: selected, y: Math.round(nextY)});
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
      result = layerItem.frame.y;
    }
    if (result && layerItem.frame.y !== result) {
      result = 'multi';
    }
    return result;
  }, null);
  return { selected, yValue };
};

export default connect(
  mapStateToProps,
  { setLayersY }
)(YInput);