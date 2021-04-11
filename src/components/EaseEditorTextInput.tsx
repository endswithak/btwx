/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersTextTweenScramble } from '../store/actions/layer';
import { getSelectedTextTweensScramble } from '../store/selectors/layer';
import EaseEditorSelector from './EaseEditorSelector';

const EaseEditorTextInput = (): ReactElement => {
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const scrambleValue = useSelector((state: RootState) => getSelectedTextTweensScramble(state));
  const dispatch = useDispatch();

  const selectorOptions = [
    ...(scrambleValue === 'multi' ? [{ value: 'multi', label: 'multi', icon: 'text', onClick: () => { return; } }] : []),
    ...[{
      label: 'Text',
      icon: 'text',
      value: 'text',
      onClick: (): void => {
        dispatch(setLayersTextTweenScramble({
          tweens: selectedTweens,
          scramble: false
        }));
      }
    },{
      label: 'Scramble Text',
      icon: 'scramble-text',
      value: 'scrambleText',
      onClick: (): void => {
        dispatch(setLayersTextTweenScramble({
          tweens: selectedTweens,
          scramble: true
        }));
      }
    }]
  ]

  const [text, setText] = useState(scrambleValue !== null ? scrambleValue ? selectorOptions.find((option) => option.value === 'scrambleText') : selectorOptions.find((option) => option.value === 'text') : null);

  useEffect(() => {
    setText(scrambleValue !== null ? scrambleValue ? selectorOptions.find((option) => option.value === 'scrambleText') : selectorOptions.find((option) => option.value === 'text') : null);
  }, [scrambleValue]);

  return (
    <EaseEditorSelector
      items={selectorOptions}
      selectedItem={text} />
  );
}

export default EaseEditorTextInput;