/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useState, forwardRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';
import IconButton from './IconButton';
// import TextInput, { TextInputProps } from './TextInput';

interface StyledDivProps {
  active: boolean;
}

const StyledDiv = styled.div<StyledDivProps>`
  box-shadow: 0 1px 0 0 ${props => props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5};
  .c-input__field {
    background: none;
    box-shadow: none;
  }
  :hover {
    .c-input__field {
      box-shadow: none;
    }
    .c-search-input__icon {
      svg {
        fill: ${props => props.active ? props.theme.palette.primary : props.theme.text.base};
      }
    }
  }
  :focus {
    .c-input__field {
      box-shadow: none;
    }
  }
  .c-search-input__icon {
    svg {
      fill: ${props => props.active ? props.theme.palette.primary : props.theme.text.lighter};
    }
  }
`;

export interface SearchInputProps extends TextInputProps {
  value: any;
  active: boolean;
  onChangeDebounce?(value: string): void;
  onClear?(): void;
}

const SearchInput = forwardRef(function SearchInput(props: SearchInputProps, ref: any) {
  const theme = useContext(ThemeContext);
  const { value, active, field, onClear, onChangeDebounce } = props;
  const [currentValue, setCurrentValue] = useState(value);

  const debounceChange = useCallback(
    debounce((value: string) => {
      onChangeDebounce(value);
    }, 100),
    [onChangeDebounce]
  );

  const handleChange = (e: any): void => {
    const target = e.target;
    setCurrentValue(target.value);
    debounceChange(target.value);
  };

  const handleBlur = (e: any): void => {
    if (currentValue.replace(/\s/g, '').length === 0) {
      setCurrentValue('');
      if (field.onBlur) {
        field.onBlur(e);
      }
    }
  }

  const handleFocus = (e: any): void => {
    if (!active) {
      if (field.onFocus) {
        field.onFocus(e);
      }
    }
  }

  const handleClear = (): void => {
    setCurrentValue('');
    debounceChange('');
    if (onClear) {
      onClear();
    }
  }

  return (
    <StyledDiv
      className='c-search-input'
      active={active}
      theme={theme}>
      <div className='c-search-input__icon'>
        <Icon
          name='search'
          size='small' />
      </div>
      {/* <TextInput
        field={{
          ...props.field,
          value: currentValue,
          onChange: (e): void => handleChange(e),
          onBlur: (e): void => handleBlur(e),
          onFocus: (e): void => handleFocus(e)
        }}
        ref={ref} /> */}
      {
        currentValue.length > 0
        ? <div className='c-sidebar-search__clear'>
            <IconButton
              icon='close-small'
              size='small'
              onClick={handleClear} />
          </div>
        : null
      }
    </StyledDiv>
  );
});

export default SearchInput;