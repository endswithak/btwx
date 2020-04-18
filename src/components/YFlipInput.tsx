import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarFlippedButton from './SidebarFlippedButton';

const YFlipInput = (): ReactElement => {
  const globalState = useContext(store);
  const [flipped, setFlipped] = useState<boolean>(false);
  const { selection } = globalState;

  const getFlipped = () => {
    switch(selection.length) {
      case 0:
        return false;
      case 1:
        return selection[0].paperItem.scaling.y === -1;
      default:
        return false;
    }
  }

  const handleClick = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setFlipped(!flipped);
  };

  useEffect(() => {
    setFlipped(getFlipped());
  }, [selection]);

  return (
    <SidebarFlippedButton
      text={'|'}
      active={flipped}
      onClick={handleClick}
      disabled={selection.length > 1 || selection.length === 0} />
  );
}

export default YFlipInput;