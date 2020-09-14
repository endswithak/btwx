import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
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
  const [dashOffset, setDashOffset] = useState(strokeDashOffsetValue);

  useEffect(() => {
    setDashOffset(strokeDashOffsetValue);
  }, [strokeDashOffsetValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setDashOffset(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      const nextDashOffset = evaluate(`${dashOffset}`);
      if (nextDashOffset !== strokeDashOffsetValue && !isNaN(nextDashOffset)) {
        setLayersStrokeDashOffset({layers: selected, strokeDashOffset: nextDashOffset});
        setDashOffset(nextDashOffset);
      } else {
        setDashOffset(strokeDashOffsetValue);
      }
    } catch(error) {
      setDashOffset(strokeDashOffsetValue);
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