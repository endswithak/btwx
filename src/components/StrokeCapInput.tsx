import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedStrokeEnabled, getSelectedStrokeCap } from '../store/selectors/layer';
import { setLayersStrokeCap } from '../store/actions/layer';
import { DEFAULT_STROKE_CAP_OPTIONS } from '../constants';
import ButtonGroupInput from './ButtonGroupInput';

const StrokeCapInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeCapValue = useSelector((state: RootState) => getSelectedStrokeCap(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state));
  const [strokeCap, setStrokeCap] = useState<Btwx.StrokeCap | 'multi'>(strokeCapValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setStrokeCap(strokeCapValue);
  }, [strokeCapValue, disabled, selected]);

  const handleClick = (strokeCapType: Btwx.StrokeCap): void => {
    dispatch(setLayersStrokeCap({layers: selected, strokeCap: strokeCapType}));
    setStrokeCap(strokeCapType);
  };

  const options = DEFAULT_STROKE_CAP_OPTIONS.map((option, index) => ({
    icon: `stroke-cap-${option}`,
    active: strokeCap === option,
    onClick: () => handleClick(option)
  }));

  return (
    <ButtonGroupInput
      buttons={options}
      label='Cap'
      disabled={disabled} />
  );
}

export default StrokeCapInput;