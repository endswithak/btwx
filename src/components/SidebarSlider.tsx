import React, { useContext, ReactElement } from 'react';
import { store } from '../store';
import Slider from 'rc-slider';

interface SidebarSliderProps {
  value: number;
  onChange(value: number): void;
}

const SidebarSlider = (props: SidebarSliderProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div className='c-sidebar-input'>
      <Slider
        value={props.value}
        onChange={props.onChange}
        handleStyle={[{
          background: theme.backgroundInverse.z6,
          borderColor: theme.backgroundInverse.z6,
          boxShadow: `0 0 5px ${theme.background.z0}`
        }]}
        trackStyle={[{
          background: theme.palette.primary
        }]}
        railStyle={{
          background: theme.background.z4
        }} />
    </div>
  );
}

export default SidebarSlider;