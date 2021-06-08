import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import ButtonGroup, { ButtonGroupProps } from './ButtonGroup';

interface ButtonGroupInputProps extends ButtonGroupProps {
  label: string;
}

const ButtonGroupInput = (props: ButtonGroupInputProps): ReactElement => {
  const { buttons, disabled, label } = props;
  const theme = useContext(ThemeContext);

  return (
    <div className='c-input'>
      <div className='c-input__button-group'>
        <ButtonGroup
          buttons={buttons}
          disabled={disabled}
          ariaLabel={label} />
        <div
          className='c-input__label'
          style={{
            color: theme.text.base
          }}>
          { label }
        </div>
      </div>
    </div>
  );
}

export default ButtonGroupInput;