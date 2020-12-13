import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { getSelectedStrokeWidth, selectedStrokeEnabled } from '../store/selectors/layer';
import { setLayersStrokeWidth } from '../store/actions/layer';

const StrokeWidthInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeWidthValue = useSelector((state: RootState) => getSelectedStrokeWidth(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state));
  const [strokeWidth, setStrokeWidth] = useState(strokeWidthValue !== 'multi' ? Math.round(strokeWidthValue) : strokeWidthValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setStrokeWidth(strokeWidthValue !== 'multi' ? Math.round(strokeWidthValue) : strokeWidthValue);
  }, [strokeWidthValue, selected]);

  const handleStrokeWidthChange = (e: any): void => {
    const target = e.target;
    setStrokeWidth(target.value);
  };

  const handleStrokeWidthSubmit = (e: any): void => {
    try {
      const nextStrokeWidth = mexp.eval(`${strokeWidth}`) as any;
      if (nextStrokeWidth !== strokeWidthValue) {
        dispatch(setLayersStrokeWidth({layers: selected, strokeWidth: Math.round(nextStrokeWidth)}));
        setStrokeWidth(Math.round(nextStrokeWidth));
      } else {
        setStrokeWidth(strokeWidthValue !== 'multi' ? Math.round(strokeWidthValue) : strokeWidthValue);
      }
    } catch(error) {
      setStrokeWidth(strokeWidthValue !== 'multi' ? Math.round(strokeWidthValue) : strokeWidthValue);
    }
  };

  return (
    <SidebarInput
      value={strokeWidth}
      onChange={handleStrokeWidthChange}
      onSubmit={handleStrokeWidthSubmit}
      submitOnBlur
      disabled={disabled}
      bottomLabel={'Width'} />
  );
}

export default StrokeWidthInput;