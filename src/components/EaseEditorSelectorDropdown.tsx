/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useContext } from 'react';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import EaseEditorSelectorItem from './EaseEditorSelectorItem';
import { EaseEditorSelectorItemProps } from './EaseEditorSelectorItem';

interface EaseEditorSelectorDropdownProps {
  isOpen: boolean;
  items: EaseEditorSelectorItemProps[];
  selectedItem: EaseEditorSelectorItemProps;
  setIsOpen(isOpen: boolean): void;
}

const EaseEditorSelectorDropdown = (props: EaseEditorSelectorDropdownProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { items, selectedItem, isOpen, setIsOpen } = props;

  return (
    <>
      {
        isOpen
        ? <div
            className='c-ease-editor-selector__dropdown'
            style={{
              background: tinyColor(theme.name === 'dark'
              ? theme.background.z1
              : theme.background.z2).setAlpha(0.77).toRgbString(),
              boxShadow: `0 0 0 1px ${theme.name === 'dark'
              ? theme.background.z4
              : theme.background.z5
              }, 0 4px 16px 0 rgba(0,0,0,0.16)`
            }}>
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
}

export default EaseEditorSelectorDropdown;