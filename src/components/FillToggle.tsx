import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedFillEnabled } from '../store/selectors/layer';
import { enableLayersFill, disableLayersFill } from '../store/actions/layer';
import StyleToggle from './StyleToggle';

const FillToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const enabledValue = useSelector((state: RootState) => selectedFillEnabled(state));
  const [enabled, setEnabled] = useState<boolean>(enabledValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
  }, [enabledValue, selected]);

  const handleToggleClick = () => {
    if (enabled) {
      dispatch(disableLayersFill({layers: selected}));
    } else {
      dispatch(enableLayersFill({layers: selected}));
    }
  };

  return (
    <StyleToggle
      style='fill'
      styleEnabled={enabled}
      setStyleEnabled={handleToggleClick} />
  );
}

export default FillToggle;