import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { getSelectedStrokeDashOffset, selectedStrokeEnabled } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import { setLayersStrokeDashOffset } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const StrokeDashOffsetInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeDashOffsetValue = useSelector((state: RootState) => getSelectedStrokeDashOffset(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state));
  const [dashOffset, setDashOffset] = useState(strokeDashOffsetValue !== 'multi' ? Math.round(strokeDashOffsetValue) : strokeDashOffsetValue);
  const dispatch = useDispatch();

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
        dispatch(setLayersStrokeDashOffset({layers: selected, strokeDashOffset: Math.round(nextDashOffset)}));
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
      bottomLabel={'Offset'} />
  );
}

export default StrokeDashOffsetInput;