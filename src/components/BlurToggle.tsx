import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedBlurEnabled } from '../store/selectors/layer';
import { enableLayersBlur, disableLayersBlur } from '../store/actions/layer';
import StyleToggle from './StyleToggle';

const BlurToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const enabledValue = useSelector((state: RootState) => selectedBlurEnabled(state));
  const [enabled, setEnabled] = useState<boolean>(enabledValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
  }, [enabledValue, selected]);

  const handleToggleClick = () => {
    if (enabled) {
      dispatch(disableLayersBlur({layers: selected}));
    } else {
      dispatch(enableLayersBlur({layers: selected}));
    }
  };

  return (
    <StyleToggle
      style='blur'
      styleEnabled={enabled}
      setStyleEnabled={handleToggleClick} />
  );
}

export default BlurToggle;