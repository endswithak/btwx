import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedStrokeEnabled, getSelectedStrokeJoin } from '../store/selectors/layer';
import { setLayersStrokeJoin } from '../store/actions/layer';
import { DEFAULT_STROKE_JOIN_OPTIONS } from '../constants';
import ButtonGroupInput from './ButtonGroupInput';

const StrokeJoinInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeJoinValue = useSelector((state: RootState) => getSelectedStrokeJoin(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state) || (state.layer.present.selected.every((id) => state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Line')));
  const [strokeJoin, setStrokeJoin] = useState<Btwx.StrokeJoin | 'multi'>(strokeJoinValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setStrokeJoin(strokeJoinValue);
  }, [strokeJoinValue, disabled, selected]);

  const handleClick = (strokeJoinType: Btwx.StrokeJoin): void => {
    dispatch(setLayersStrokeJoin({layers: selected, strokeJoin: strokeJoinType}));
    setStrokeJoin(strokeJoinType);
  };

  const options = DEFAULT_STROKE_JOIN_OPTIONS.map((option, index) => ({
    icon: `stroke-join-${option}`,
    active: strokeJoin === option,
    onClick: () => handleClick(option)
  }));

  return (
    <ButtonGroupInput
      buttons={options}
      label='Join'
      disabled={disabled} />
  );
}

export default StrokeJoinInput;