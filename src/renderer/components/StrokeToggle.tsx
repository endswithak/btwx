import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedStrokeEnabled } from '../store/selectors/layer';
import { enableLayersStroke, disableLayersStroke } from '../store/actions/layer';
import StyleToggle from './StyleToggle';

const StrokeToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const enabledValue = useSelector((state: RootState) => selectedStrokeEnabled(state));
  const [enabled, setEnabled] = useState<boolean>(enabledValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
  }, [enabledValue, selected]);

  const handleToggleClick = () => {
    if (enabled) {
      dispatch(disableLayersStroke({layers: selected}));
    } else {
      dispatch(enableLayersStroke({layers: selected}));
    }
  };

  return (
    <StyleToggle
      style='stroke'
      styleEnabled={enabled}
      setStyleEnabled={handleToggleClick} />
  );
}

export default StrokeToggle;