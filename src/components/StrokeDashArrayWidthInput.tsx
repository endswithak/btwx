import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
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
  const [dashArrayWidth, setDashArrayWidth] = useState(strokeDashArrayWidthValue !== 'multi' ? Math.round(strokeDashArrayWidthValue) : strokeDashArrayWidthValue);

  useEffect(() => {
    setDashArrayWidth(strokeDashArrayWidthValue !== 'multi' ? Math.round(strokeDashArrayWidthValue) : strokeDashArrayWidthValue);
  }, [strokeDashArrayWidthValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setDashArrayWidth(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const nextDash = mexp.eval(`${dashArrayWidth}`) as any;
      if (nextDash !== strokeDashArrayWidthValue) {
        setLayersStrokeDashArrayWidth({layers: selected, strokeDashArrayWidth: Math.round(nextDash)});
        setDashArrayWidth(Math.round(nextDash));
      } else {
        setDashArrayWidth(strokeDashArrayWidthValue !== 'multi' ? Math.round(strokeDashArrayWidthValue) : strokeDashArrayWidthValue);
      }
    } catch(error) {
      setDashArrayWidth(strokeDashArrayWidthValue !== 'multi' ? Math.round(strokeDashArrayWidthValue) : strokeDashArrayWidthValue);
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
  const layerItems: (Btwx.Shape | Btwx.Image | Btwx.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const strokeDashArrayValues = layerItems.reduce((result: (number[])[], current: Btwx.Shape | Btwx.Image | Btwx.Text) => {
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