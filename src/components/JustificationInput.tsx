import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersJustification } from '../store/actions/layer';
import { getSelectedJustification } from '../store/selectors/layer';
import { setTextSettingsJustification } from '../store/actions/textSettings';
import { DEFAULT_JUSTIFICATION_OPTIONS } from '../constants';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const JustificationInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const justificationValue = useSelector((state: RootState) => getSelectedJustification(state));
  const [justification, setJustification] = useState(justificationValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setJustification(justificationValue);
  }, [justificationValue, selected]);

  const handleChange = (e: any): void => {
    if (e.target.value !== justification) {
      dispatch(setLayersJustification({layers: selected, justification: e.target.value as Btwx.Jusftification}));
      setJustification(e.target.value);
      dispatch(setTextSettingsJustification({justification: e.target.value as Btwx.Jusftification}));
    }
  };

  const options = DEFAULT_JUSTIFICATION_OPTIONS.map((option) => (
    <ToggleButtonGroup.Button
      key={option}
      value={option}>
      <Icon
        name={`justify-${option}`}
        size='small' />
    </ToggleButtonGroup.Button>
  ));

  return (
    <Form inline>
      <Form.Group controlId='control-justification'>
        <ToggleButtonGroup
          type='radio'
          name='justification'
          size='small'
          value={justification}
          onChange={handleChange}>
          { options }
        </ToggleButtonGroup>
        <Form.Label>
          Alignment
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default JustificationInput;