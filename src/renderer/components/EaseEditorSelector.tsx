/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import EaseEditorSelectorInput from './EaseEditorSelectorInput';
import EaseEditorSelectorDropdown from './EaseEditorSelectorDropdown';
import { EaseEditorSelectorItemProps } from './EaseEditorSelectorItem';

interface EaseEditorSelectorProps {
  items: EaseEditorSelectorItemProps[];
  selectedItem: EaseEditorSelectorItemProps;
  onOpen?: any;
  onClose?: any;
}

const EaseEditorSelector = (props: EaseEditorSelectorProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const { items, selectedItem, onOpen, onClose } = props;
  const [isOpen, setIsOpen] = useState(false);

  const onMouseDown = (event: any): void => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown);
    return (): void => {
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (onOpen) {
        onOpen();
      }
    } else {
      if (onClose) {
        onClose();
      }
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      className='c-ease-editor__selector'>
      <EaseEditorSelectorInput
        text={selectedItem.label}
        isOpen={isOpen}
        setIsOpen={setIsOpen} />
      <EaseEditorSelectorDropdown
        items={items}
        selectedItem={selectedItem}
        isOpen={isOpen}
        setIsOpen={setIsOpen} />
    </div>
  );
}

export default EaseEditorSelector;