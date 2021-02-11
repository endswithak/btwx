import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableLayersHorizontalFlip, disableLayersHorizontalFlip } from '../store/actions/layer';
import { canFlipSeleted } from '../store/selectors/layer';
import Form from './Form';
import ToggleButton from './ToggleButton';
import Icon from './Icon';

const HorizontalFlipInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const horizontalFlipValue = useSelector((state: RootState) => state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.horizontalFlip));
  const disabled = useSelector((state: RootState) => !canFlipSeleted(state));
  const [horizontalFlip, setHorizontalFlip] = useState<boolean>(horizontalFlipValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setHorizontalFlip(horizontalFlipValue);
  }, [horizontalFlipValue]);

  const handleChange = (e: any): void => {
    if (horizontalFlip) {
      dispatch(disableLayersHorizontalFlip({layers: selected}));
    } else {
      dispatch(enableLayersHorizontalFlip({layers: selected}));
    }
    setHorizontalFlip(!horizontalFlip);
  };

  return (
    <Form inline>
      <Form.Group controlId='control-horizontal-flip'>
        <ToggleButton
          type='checkbox'
          value={horizontalFlip}
          isActive={horizontalFlip}
          checked={horizontalFlip}
          onChange={handleChange}
          size='small'
          disabled={disabled}>
          <Icon
            name='horizontal-flip'
            size='small' />
        </ToggleButton>
      </Form.Group>
    </Form>
  );
}

export default HorizontalFlipInput;