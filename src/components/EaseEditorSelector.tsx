/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize';
import { RootState } from '../store/reducers';
import { setLayerTweenEase } from '../store/actions/layer';
import { DEFAULT_TWEEN_EASE_OPTIONS } from '../constants';
import EaseEditorSelectorInput from './EaseEditorSelectorInput';
import EaseEditorSelectorDropdown from './EaseEditorSelectorDropdown';
import { EaseEditorSelectorItemProps } from './EaseEditorSelectorItem';

interface EaseEditorSelectorProps {
  items: EaseEditorSelectorItemProps[];
  selectedItem: EaseEditorSelectorItemProps;
}

const EaseEditorSelector = (props: EaseEditorSelectorProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const { items, selectedItem } = props;
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