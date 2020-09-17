import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersStrokeDashArrayGapPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersStrokeDashArrayGap } from '../store/actions/layer';

interface StrokeDashArrayGapInputProps {
  selected?: string[];
  strokeDashArrayGapValue?: number | 'multi';
  disabled?: boolean;
  setLayersStrokeDashArrayGap?(payload: SetLayersStrokeDashArrayGapPayload): LayerTypes;
}

const StrokeDashArrayGapInput = (props: StrokeDashArrayGapInputProps): ReactElement => {
  const { selected, setLayersStrokeDashArrayGap, disabled, strokeDashArrayGapValue } = props;
  const [dashArrayGap, setDashArrayGap] = useState(strokeDashArrayGapValue !== 'multi' ? Math.round(strokeDashArrayGapValue) : strokeDashArrayGapValue);

  useEffect(() => {
    setDashArrayGap(strokeDashArrayGapValue !== 'multi' ? Math.round(strokeDashArrayGapValue) : strokeDashArrayGapValue);
  }, [strokeDashArrayGapValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setDashArrayGap(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const nextGap = mexp.eval(`${dashArrayGap}`) as any;
      if (nextGap !== strokeDashArrayGapValue) {
        setLayersStrokeDashArrayGap({layers: selected, strokeDashArrayGap: Math.round(nextGap)});
        setDashArrayGap(Math.round(nextGap));
      } else {
        setDashArrayGap(strokeDashArrayGapValue !== 'multi' ? Math.round(strokeDashArrayGapValue) : strokeDashArrayGapValue);
      }
    } catch(error) {
      setDashArrayGap(strokeDashArrayGapValue !== 'multi' ? Math.round(strokeDashArrayGapValue) : strokeDashArrayGapValue);
    }
  }

  return (
    <SidebarInput
      value={dashArrayGap}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      disabled={disabled}
      bottomLabel={'Gap'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: (em.Shape | em.Image | em.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const strokeDashArrayValues = layerItems.reduce((result: (number[])[], current: em.Shape | em.Image | em.Text) => {
    return [...result, current.style.strokeOptions.dashArray];
  }, []);
  const strokeDashArrayGapValues = strokeDashArrayValues.reduce((result: number[], current: number[]) => {
    return [...result, current[1]];
  }, []);
  const strokeDashArrayGapValue = strokeDashArrayGapValues.every((gap: number) => gap === strokeDashArrayGapValues[0]) ? strokeDashArrayGapValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.stroke.enabled);
  return { selected, strokeDashArrayGapValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersStrokeDashArrayGap }
)(StrokeDashArrayGapInput);