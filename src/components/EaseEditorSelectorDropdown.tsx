/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import EaseEditorSelectorItem from './EaseEditorSelectorItem';
import { EaseEditorSelectorItemProps } from './EaseEditorSelectorItem';
import ListGroup from './ListGroup';
import ListItem from './ListItem';

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
}: EaseEditorSelectorDropdownProps): ReactElement => {

  const handleClick = (e: any, item: any): void => {
    item.onClick(e);
    setIsOpen(false);
  }

  return (
    <>
      {
        isOpen
        ? <div className='c-ease-editor-selector__dropdown'>
            <ListGroup>
              {
                items.map((item, index) => (
                  <ListItem
                    key={index}
                    interactive
                    isActive={selectedItem.label === item.label}
                    onClick={(e) => handleClick(e, item)}>
                    <ListItem.Icon
                      name={item.icon}
                      size='small' />
                    <ListItem.Body>
                      <ListItem.Text
                        size='small'>
                        { item.label }
                      </ListItem.Text>
                    </ListItem.Body>
                  </ListItem>
                ))
              }
            </ListGroup>
          </div>
        : null
      }
    </>
  );
};

export default EaseEditorSelectorDropdown;