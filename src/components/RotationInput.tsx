import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarInput from './SidebarInput';

const RotationInput = (): ReactElement => {
  const globalState = useContext(store);
  const [rotation, setRotation] = useState<string | number>(0);
  const { selection } = globalState;

  const getRotation = () => {
    switch(selection.length) {
      case 0:
        return '';
      case 1:
        return Math.round(selection[0].paperItem.rotation);
      default:
        return 'multi';
    }
  }

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setRotation(target.value);
  };

  useEffect(() => {
    setRotation(getRotation());
  }, [selection]);

  return (
    <SidebarInput
      value={rotation}
      onChange={handleChange}
      label={'°'}
      disabled={selection.length > 1 || selection.length === 0} />
  );
}

export default RotationInput;