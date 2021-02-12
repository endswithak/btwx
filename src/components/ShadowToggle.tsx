import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedShadowEnabled } from '../store/selectors/layer';
import { enableLayersShadow, disableLayersShadow } from '../store/actions/layer';
import StyleToggle from './StyleToggle';

const ShadowToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const enabledValue = useSelector((state: RootState) => selectedShadowEnabled(state));
  const [enabled, setEnabled] = useState<boolean>(enabledValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
  }, [enabledValue, selected]);

  const handleToggleClick = () => {
    if (enabled) {
      dispatch(disableLayersShadow({layers: selected}));
    } else {
      dispatch(enableLayersShadow({layers: selected}));
    }
  };

  return (
    <StyleToggle
      style='shadow'
      styleEnabled={enabled}
      setStyleEnabled={handleToggleClick} />
  );
}

export default ShadowToggle;