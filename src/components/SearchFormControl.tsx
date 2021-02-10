/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, forwardRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import Icon from './Icon';
import IconButton from './IconButton';
import Form from './Form';
import { FormControlProps } from './FormControl';

export interface SearchInputProps extends FormControlProps {
  onChangeDebounce?(value: string): void;
  onClear?(): void;
}

const SearchFormControl = forwardRef(function SearchInput({
  onChangeDebounce,
  onClear,
  ...rest
}: SearchInputProps, ref: any) {
  const { value, isActive, onFocus, onBlur } = rest;
  const [currentValue, setCurrentValue] = useState<string>(value as string);

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
      if (onBlur) {
        onBlur(e);
      }
    }
  }

  const handleFocus = (e: any): void => {
    if (!isActive) {
      if (onFocus) {
        onFocus(e);
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
    <Form.Control
      {...rest}
      ref={ref}
      as='input'
      value={currentValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      required
      leftReadOnly
      search
      left={
        <Form.Text>
          <Icon
            name='search'
            size='small'
            variant={isActive ? 'primary' : null} />
        </Form.Text>
      }
      right={
        currentValue.length > 0
        ? <Form.Text>
            <IconButton
              iconName='close-small'
              size='small'
              onClick={handleClear} />
          </Form.Text>
        : null
      } />
  );
});

export default SearchFormControl;