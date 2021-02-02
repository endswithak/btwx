import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersJustification } from '../store/actions/layer';
import { getSelectedJustification } from '../store/selectors/layer';
import { setTextSettingsJustification } from '../store/actions/textSettings';
import { DEFAULT_JUSTIFICATION_OPTIONS } from '../constants';
import ButtonGroupInput from './ButtonGroupInput';

const JustificationInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const justificationValue = useSelector((state: RootState) => getSelectedJustification(state));
  const [justification, setJustification] = useState(justificationValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setJustification(justificationValue);
  }, [justificationValue, selected]);

  const handleClick = (justificationButtonValue: Btwx.Jusftification): void => {
    dispatch(setLayersJustification({layers: selected, justification: justificationButtonValue as Btwx.Jusftification}));
    setJustification(justificationButtonValue);
    dispatch(setTextSettingsJustification({justification: justificationButtonValue as Btwx.Jusftification}));
  };

  const options = DEFAULT_JUSTIFICATION_OPTIONS.map((option, index) => ({
    icon: `justify-${option}`,
    active: justification === option,
    onClick: () => handleClick(option)
  }));

  return (
    <ButtonGroupInput
      buttons={options}
      label='Alignment' />
  );
}

export default JustificationInput;