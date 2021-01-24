import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerCustomBounceTweenSquash } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

interface EaseEditorBounceSquashInputProps {
  setInputInfo(inputInfo: { type: string; description: string }): void;
}

const EaseEditorBounceSquashInput = (props: EaseEditorBounceSquashInputProps): ReactElement => {
  const { setInputInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const squashValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].customBounce.squash : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'customBounce' : true);
  const [squash, setSquash] = useState(squashValue);
  const dispatch = useDispatch();

  const handleSquashChange = (e: any): void => {
    const target = e.target;
    setSquash(target.value);
  };

  const handleSquashSubmit = (e: any): void => {
    try {
      const squashRounded = Math.round(squash);
      if (squashRounded !== squashValue) {
        let newSquash = squashRounded;
        if (squashRounded < 0) {
          newSquash = 0;
        }
        dispatch(setLayerCustomBounceTweenSquash({id: id, squash: newSquash}));
        setSquash(newSquash);
      } else {
        setSquash(squashValue);
      }
    } catch(error) {
      setSquash(squashValue);
    }
  }

  const handleFocus = () => {
    setInputInfo({
      type: 'Number',
      description: 'Controls how long the squash should last (the gap between bounces, when it appears “stuck”).'
    });
  }

  const handleBlur = () => {
    setInputInfo(null);
  }

  useEffect(() => {
    setSquash(squashValue);
  }, [squashValue]);

  return (
    <SidebarInput
      value={squash}
      disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleSquashChange}
      onSubmit={handleSquashSubmit}
      submitOnBlur
      bottomLabel='Squash' />
  );
}

export default EaseEditorBounceSquashInput;