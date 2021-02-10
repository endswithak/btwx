/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import EaseEditorSelectorItem from './EaseEditorSelectorItem';
import { EaseEditorSelectorItemProps } from './EaseEditorSelectorItem';

interface EaseEditorSelectorDropdownProps {
  isOpen: boolean;
  items: EaseEditorSelectorItemProps[];
  selectedItem: EaseEditorSelectorItemProps;
  setIsOpen(isOpen: boolean): void;
}

const EaseEditorSelectorDropdown = ({
  items,
  selectedItem,
  isOpen,
  setIsOpen
}: EaseEditorSelectorDropdownProps): ReactElement => (
  <>
    {
      isOpen
      ? <div className='c-ease-editor-selector__dropdown'>
          {
            items.map((item, index) => (
              <EaseEditorSelectorItem
                key={index}
                {...item}
                isActive={selectedItem.label === item.label}
                setIsOpen={setIsOpen} />
            ))
          }
        </div>
      : null
    }
  </>
);

export default EaseEditorSelectorDropdown;