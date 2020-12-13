import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { getSelectedStrokeDashArrayWidth, selectedStrokeEnabled } from '../store/selectors/layer';
import { setLayersStrokeDashArrayWidth } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const StrokeDashArrayWidthInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeDashArrayWidthValue = useSelector((state: RootState) => getSelectedStrokeDashArrayWidth(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state));
  const [dashArrayWidth, setDashArrayWidth] = useState(strokeDashArrayWidthValue !== 'multi' ? Math.round(strokeDashArrayWidthValue) : strokeDashArrayWidthValue);
  const dispatch = useDispatch();

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
        dispatch(setLayersStrokeDashArrayWidth({layers: selected, strokeDashArrayWidth: Math.round(nextDash)}));
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

export default StrokeDashArrayWidthInput;