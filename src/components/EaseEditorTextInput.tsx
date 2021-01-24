/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerTextTweenScramble } from '../store/actions/layer';
import EaseEditorSelector from './EaseEditorSelector';

const EaseEditorTextInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const scrambleValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].text.scramble : null);
  const dispatch = useDispatch();

  const selectorOptions = [{
    label: 'Text',
    value: 'text',
    onClick: (): void => {
      dispatch(setLayerTextTweenScramble({id: id, scramble: false}));
    }
  },{
    label: 'Scramble Text',
    value: 'scrambleText',
    onClick: (): void => {
      dispatch(setLayerTextTweenScramble({id: id, scramble: true}));
    }
  }]

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