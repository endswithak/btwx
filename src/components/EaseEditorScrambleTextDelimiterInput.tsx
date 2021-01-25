import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerScrambleTextTweenDelimiter } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

interface EaseEditorScrambleTextDelimiterInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorScrambleTextDelimiterInput = (props: EaseEditorScrambleTextDelimiterInputProps): ReactElement => {
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const delimiterValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].scrambleText.delimiter : null);
  const [delimiter, setDelimiter] = useState(delimiterValue.length === 0 ? `""` : delimiterValue === ' ' ? `" "` : delimiterValue);
  const dispatch = useDispatch();

  const handlePointsChange = (e: any): void => {
    const target = e.target;
    setDelimiter(target.value);
  };

  const handleDelimiterSubmit = (e: any): void => {
    let newDelimiter = delimiter;
    if (newDelimiter === `""` || newDelimiter === `''`) {
      newDelimiter = '';
    }
    if (newDelimiter === `" "` || newDelimiter === `' '`) {
      newDelimiter = ' ';
    }
    if (newDelimiter !== delimiterValue) {
      dispatch(setLayerScrambleTextTweenDelimiter({id: id, delimiter: newDelimiter}));
      if (newDelimiter === ' ') {
        newDelimiter = `" "`;
      }
      if (newDelimiter === '') {
        newDelimiter = `""`;
      }
      setDelimiter(delimiter);
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'String',
      description: `The character that should be used to split the text up. The default is "", so each character is isolated but if you'd prefer to animate in word-by-word instead you can use " ".`
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  useEffect(() => {
    setDelimiter(delimiterValue.length === 0 ? `""` : delimiterValue === ' ' ? `" "` : delimiterValue);
  }, [delimiterValue]);

  return (
    <SidebarInput
      value={delimiter}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handlePointsChange}
      onSubmit={handleDelimiterSubmit}
      selectOnMount
      submitOnBlur
      manualCanvasFocus
      bottomLabel='Delimiter' />
  );
}

export default EaseEditorScrambleTextDelimiterInput;