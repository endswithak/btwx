import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableLayersHorizontalFlip, disableLayersHorizontalFlip } from '../store/actions/layer';
import { canFlipSeleted } from '../store/selectors/layer';
import Button from './Button';

const HorizontalFlipInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const horizontalFlipValue = useSelector((state: RootState) => state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.horizontalFlip));
  const disabled = useSelector((state: RootState) => !canFlipSeleted(state));
  const [horizontalFlip, setHorizontalFlip] = useState<boolean>(horizontalFlipValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setHorizontalFlip(horizontalFlipValue);
  }, [horizontalFlipValue]);

  const handleClick = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (horizontalFlip) {
      dispatch(disableLayersHorizontalFlip({layers: selected}));
    } else {
      dispatch(enableLayersHorizontalFlip({layers: selected}));
    }
    setHorizontalFlip(!horizontalFlip);
  };

  return (
    <Button
      active={horizontalFlip}
      onClick={handleClick}
      icon='horizontal-flip'
      disabled={disabled} />
  );
}

export default HorizontalFlipInput;