import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarInput from './SidebarInput';

const XInput = (): ReactElement => {
  const globalState = useContext(store);
  const [x, setX] = useState<string | number>(0);
  const { selection } = globalState;

  const getX = () => {
    switch(selection.length) {
      case 0:
        return '';
      case 1:
        return Math.round(selection[0].paperItem.position.x);
      default:
        return 'multi';
    }
  }

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setX(target.value);
  };

  useEffect(() => {
    setX(getX());
  }, [selection]);

  return (
    <SidebarInput
      value={x}
      onChange={handleChange}
      label={'X'}
      disabled={selection.length > 1 || selection.length === 0} />
  );
}

export default XInput;