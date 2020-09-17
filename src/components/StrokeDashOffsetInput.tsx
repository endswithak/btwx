import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersStrokeDashOffsetPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersStrokeDashOffset } from '../store/actions/layer';

interface StrokeDashOffsetInputProps {
  strokeDashOffsetValue?: number | 'multi';
  selected?: string[];
  disabled?: boolean;
  setLayersStrokeDashOffset?(payload: SetLayersStrokeDashOffsetPayload): LayerTypes;
}

const StrokeDashOffsetInput = (props: StrokeDashOffsetInputProps): ReactElement => {
  const { selected, disabled, strokeDashOffsetValue, setLayersStrokeDashOffset } = props;
  const [dashOffset, setDashOffset] = useState(strokeDashOffsetValue !== 'multi' ? Math.round(strokeDashOffsetValue) : strokeDashOffsetValue);

  useEffect(() => {
    setDashOffset(strokeDashOffsetValue !== 'multi' ? Math.round(strokeDashOffsetValue) : strokeDashOffsetValue);
  }, [strokeDashOffsetValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setDashOffset(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      const nextDashOffset = mexp.eval(`${dashOffset}`) as any;
      if (nextDashOffset !== strokeDashOffsetValue) {
        setLayersStrokeDashOffset({layers: selected, strokeDashOffset: Math.round(nextDashOffset)});
        setDashOffset(Math.round(nextDashOffset));
      } else {
        setDashOffset(strokeDashOffsetValue !== 'multi' ? Math.round(strokeDashOffsetValue) : strokeDashOffsetValue);
      }
    } catch(error) {
      setDashOffset(strokeDashOffsetValue !== 'multi' ? Math.round(strokeDashOffsetValue) : strokeDashOffsetValue);
    }
  };

  return (
    <SidebarInput
      value={dashOffset}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      disabled={disabled}
      bottomLabel={'Dash Offset'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: (em.Shape | em.Image | em.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const strokeDashOffsetValues = layerItems.reduce((result: number[], current: em.Shape | em.Image | em.Text) => {
    return [...result, current.style.strokeOptions.dashOffset];
  }, []);
  const strokeDashOffsetValue = strokeDashOffsetValues.every((dashOffset: number) => dashOffset === strokeDashOffsetValues[0]) ? strokeDashOffsetValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.stroke.enabled);
  return { selected, strokeDashOffsetValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersStrokeDashOffset }
)(StrokeDashOffsetInput);