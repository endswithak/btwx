import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { getSelectedStrokeDashArrayGap, selectedStrokeEnabled } from '../store/selectors/layer';
import { setLayersStrokeDashArrayGap } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const StrokeDashArrayGapInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeDashArrayGapValue = useSelector((state: RootState) => getSelectedStrokeDashArrayGap(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state));
  const [dashArrayGap, setDashArrayGap] = useState(strokeDashArrayGapValue !== 'multi' ? Math.round(strokeDashArrayGapValue) : strokeDashArrayGapValue);
  const dispatch = useDispatch();

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
        dispatch(setLayersStrokeDashArrayGap({layers: selected, strokeDashArrayGap: Math.round(nextGap)}));
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

export default StrokeDashArrayGapInput;