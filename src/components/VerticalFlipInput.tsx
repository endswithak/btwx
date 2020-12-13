import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableLayersVerticalFlip, disableLayersVerticalFlip } from '../store/actions/layer';
import { canFlipSeleted } from '../store/selectors/layer';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

const VerticalFlipInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const verticalFlipValue = useSelector((state: RootState) => state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.verticalFlip));
  const disabled = useSelector((state: RootState) => !canFlipSeleted(state));
  const [verticalFlip, setVerticalFlip] = useState<boolean>(verticalFlipValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setVerticalFlip(verticalFlipValue);
  }, [verticalFlipValue]);

  const handleClick = (e: any) => {
    if (verticalFlip) {
      dispatch(disableLayersVerticalFlip({layers: selected}));
    } else {
      dispatch(enableLayersVerticalFlip({layers: selected}));
    }
    setVerticalFlip(!verticalFlip);
  };

  return (
    <SidebarToggleButton
      active={verticalFlip}
      onClick={handleClick}
      disabled={disabled}>
      <Icon name='vertical-flip' small />
    </SidebarToggleButton>
  );
}

export default VerticalFlipInput;