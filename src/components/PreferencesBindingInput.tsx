import {ipcRenderer} from 'electron';
import React, { ReactElement, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import ListItem from './ListItem';
import AcceleratorFormGroup from './AcceleratorFormGroup';
import IconButton from './IconButton';

interface PreferencesBindingInputProps {
  title: string;
  icon?: string;
  binding: string;
  storeKey: string;
  onChange({binding}: {binding: any}): void;
}

const PreferencesBindingInput = (props: PreferencesBindingInputProps): ReactElement => {
  const formControlRef = useRef<HTMLInputElement>(null);
  const { title, icon, binding, storeKey, onChange } = props;
  const [defaultBinding, setDefaultBinding] = useState('');
  const isDefaultRegistered = useSelector((state: RootState) => state.keyBindings.allBindings.includes(defaultBinding) && defaultBinding !== '');
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newBinding: any): void => {
    dispatch(onChange({binding: newBinding}));
  }

  const handleReset = (): void => {
    if (!isDefaultRegistered) {
      dispatch(onChange({binding: defaultBinding}));
    }
  }

  useEffect(() => {
    ipcRenderer.invoke('getElectronStore', `keyBindings.defaults.${storeKey}`).then((defaultBinding: string) => {
      setDefaultBinding(defaultBinding ? defaultBinding : '');
    });
  }, [binding]);

  return (
    <ListItem>
      <ListItem.Icon
        name={icon} />
      <ListItem.Body>
        <ListItem.Text>
          { title }
        </ListItem.Text>
      </ListItem.Body>
      <ListItem.Right>
        <AcceleratorFormGroup
          ref={formControlRef}
          controlId={`control-insert-${binding}`}
          value={binding}
          size='small'
          onSubmitSuccess={handleSubmitSuccess} />
      </ListItem.Right>
      <ListItem.Right>
        <IconButton
          onClick={handleReset}
          disabled={(!defaultBinding && !binding) || isDefaultRegistered}
          iconName='rewind'
          size='small' />
      </ListItem.Right>
    </ListItem>
  );
}

export default PreferencesBindingInput;