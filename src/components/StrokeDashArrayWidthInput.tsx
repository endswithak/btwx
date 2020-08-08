import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersStrokeDashArrayWidthPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersStrokeDashArrayWidth } from '../store/actions/layer';

interface StrokeDashArrayWidthInputProps {
  selected?: string[];
  strokeDashArrayWidthValue?: number | 'multi';
  disabled?: boolean;
  setLayersStrokeDashArrayWidth?(payload: SetLayersStrokeDashArrayWidthPayload): LayerTypes;
}

const StrokeDashArrayWidthInput = (props: StrokeDashArrayWidthInputProps): ReactElement => {
  const { selected, setLayersStrokeDashArrayWidth, strokeDashArrayWidthValue, disabled } = props;
  const [dashArrayWidth, setDashArrayWidth] = useState(strokeDashArrayWidthValue);

  useEffect(() => {
    setDashArrayWidth(strokeDashArrayWidthValue);
  }, [strokeDashArrayWidthValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setDashArrayWidth(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const nextDash = evaluate(`${dashArrayWidth}`);
      if (nextDash !== strokeDashArrayWidthValue && !isNaN(nextDash)) {
        setLayersStrokeDashArrayWidth({layers: selected, strokeDashArrayWidth: nextDash});
        setDashArrayWidth(nextDash);
      } else {
        setDashArrayWidth(strokeDashArrayWidthValue);
      }
    } catch(error) {
      setDashArrayWidth(strokeDashArrayWidthValue);
    }
  }

  return (
    <SidebarInput
      value={dashArrayWidth}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      disabled={disabled}
      bottomLabel={'Dash'} />
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
  const strokeDashArrayWidthValues = strokeDashArrayValues.reduce((result: number[], current: number[]) => {
    return [...result, current[0]];
  }, []);
  const strokeDashArrayWidthValue = strokeDashArrayWidthValues.every((gap: number) => gap === strokeDashArrayWidthValues[0]) ? strokeDashArrayWidthValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.stroke.enabled);
  return { selected, strokeDashArrayWidthValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersStrokeDashArrayWidth }
)(StrokeDashArrayWidthInput);