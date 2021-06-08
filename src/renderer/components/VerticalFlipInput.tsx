import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersVerticalFlipThunk } from '../store/actions/layer';
import { canFlipSeleted } from '../store/selectors/layer';
import Form from './Form';
import ToggleButton from './ToggleButton';
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

  const handleChange = (e: any) => {
    dispatch(setLayersVerticalFlipThunk({layers: selected, enabled: !verticalFlip}));
    setVerticalFlip(!verticalFlip);
  };

  return (
    <Form inline>
      <Form.Group controlId='control-vertical-flip'>
        <ToggleButton
          type='checkbox'
          value={verticalFlip}
          isActive={verticalFlip}
          checked={verticalFlip}
          onChange={handleChange}
          size='small'
          disabled={disabled}>
          <Icon
            name='flip-vertically'
            size='small' />
        </ToggleButton>
      </Form.Group>
    </Form>
  );
}

export default VerticalFlipInput;