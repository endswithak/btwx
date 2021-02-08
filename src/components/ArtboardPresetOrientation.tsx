import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardPresetDeviceOrientation } from '../store/actions/documentSettings';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const ArtboardPresetOrientation = (): ReactElement => {
  const orientation = useSelector((state: RootState) => state.documentSettings.artboardPresets.orientation);
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    if (e.target.value !== orientation) {
      dispatch(setArtboardPresetDeviceOrientation({orientation: e.target.value}));
    }
  };

  return (
    <Form inline>
      <Form.Group controlId='control-orientation'>
        <ToggleButtonGroup
          type='radio'
          name='orientation'
          size='small'
          value={orientation}
          onChange={handleChange}>
          <ToggleButtonGroup.Button value='Portrait'>
            <Icon
              name='orientation-portrait'
              size='small' />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value='Landscape'>
            <Icon
              name='orientation-landscape'
              size='small' />
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup>
      </Form.Group>
    </Form>
  );
}

export default ArtboardPresetOrientation;