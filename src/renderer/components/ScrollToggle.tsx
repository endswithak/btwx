import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedScrollEnabled } from '../store/selectors/layer';
import { enableGroupsScroll, disableGroupsScroll } from '../store/actions/layer';
import StyleToggle from './StyleToggle';

const ScrollToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const enabledValue = useSelector((state: RootState) => selectedScrollEnabled(state));
  const [enabled, setEnabled] = useState<boolean>(enabledValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
  }, [enabledValue, selected]);

  const handleToggleClick = () => {
    if (enabled) {
      dispatch(disableGroupsScroll({
        layers: selected
      }));
    } else {
      dispatch(enableGroupsScroll({
        layers: selected
      }));
    }
  };

  return (
    <StyleToggle
      style='scroll'
      styleEnabled={enabled}
      setStyleEnabled={handleToggleClick} />
  );
}

export default ScrollToggle;