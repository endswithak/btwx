import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardPresetDevicePlatform } from '../store/actions/documentSettings';
import { DEVICES } from '../constants';
import Form from './Form';
import Icon from './Icon';

const SidebarArtboardPlatformSelector = (): ReactElement => {
  const formRef = useRef<HTMLFormElement>(null);
  const formControlRef = useRef<HTMLSelectElement>(null);
  const platformValue = useSelector((state: RootState) => state.documentSettings.artboardPresets.platform);
  const optionValues = useSelector((state: RootState) => [
    ...DEVICES,
    {
      type: 'Custom',
      categories: [{
        type: 'Custom',
        devices: state.documentSettings.artboardPresets.allIds.reduce((result: Btwx.ArtboardPreset[], current) => {
          result = [...result, state.documentSettings.artboardPresets.byId[current]];
          return result;
        }, [])
      }]
    }
  ]);
  const [platform, setPlatform] = useState(platformValue);
  const dispatch = useDispatch();

  const options = optionValues.map((device) => ({
    value: device.type,
    label: device.type
  })).map((option, index) => (
    <option
      key={index}
      value={option.value}>
      { option.label }
    </option>
  ));

  const handleChange = (e: any): void => {
    if (e.target.value !== 'multi') {
      setPlatform(e.target.value);
      dispatch(setArtboardPresetDevicePlatform({platform: e.target.value}));
    }
  }

  useEffect(() => {
    setPlatform(platformValue);
  }, [platformValue]);

  return (
    <Form
      ref={formRef}
      inline
      validated={true}>
      <Form.Group controlId='blend-mode'>
        <Form.Control
          ref={formControlRef}
          as='select'
          value={platform}
          size='small'
          onChange={handleChange}
          required
          rightReadOnly
          right={
            <Form.Text>
              <Icon
                name='list-toggle'
                size='small' />
            </Form.Text>
          }>
          { options }
        </Form.Control>
      </Form.Group>
    </Form>
  );
}

export default SidebarArtboardPlatformSelector;