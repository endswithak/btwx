import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedTweensYoyo } from '../store/selectors/layer';
import { setLayersTweenYoyo } from '../store/actions/layer';
import ToggleIconButton from './ToggleIconButton';

const EaseEditorYoyoInput = (): ReactElement => {
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const yoyoValue = useSelector((state: RootState) => getSelectedTweensYoyo(state));
  const [yoyo, setYoyo] = useState(yoyoValue && yoyoValue !== 'multi' ? yoyoValue : false);
  const dispatch = useDispatch();

  useEffect(() => {
    setYoyo(yoyoValue && yoyoValue !== 'multi' ? yoyoValue : false);
  }, [yoyoValue, selectedTweens]);

  const handleChange = (e: any): void => {
    setYoyo(!yoyo);
    dispatch(setLayersTweenYoyo({
      tweens: selectedTweens,
      yoyo: !yoyo
    }));
  }

  return (
    <ToggleIconButton
      value={yoyo}
      type='checkbox'
      onChange={handleChange}
      size='small'
      checked={yoyo}
      label='yoyo'
      iconName='yoyo'
      activeIconName='yoyo' />
  );
}

export default EaseEditorYoyoInput;