import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerTextTweenDelimiter } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

interface EaseEditorTextDelimiterInputProps {
  setInputInfo(inputInfo: { type: string; description: string }): void;
}

const EaseEditorTextDelimiterInput = (props: EaseEditorTextDelimiterInputProps): ReactElement => {
  const { setInputInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const delimiterValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].text.delimiter : null);
  const [delimiter, setDelimiter] = useState(delimiterValue);
  const dispatch = useDispatch();

  const handlePointsChange = (e: any): void => {
    const target = e.target;
    setDelimiter(target.value);
  };

  const handleDelimiterSubmit = (e: any): void => {
    if (typeof delimiter === 'string') {
      dispatch(setLayerTextTweenDelimiter({id: id, delimiter: delimiter}));
      setDelimiter(delimiter);
    } else {
      setDelimiter(delimiterValue);
    }
  }

  const handleFocus = () => {
    setInputInfo({
      type: 'String',
      description: `The character that should be used to split the text up. The default is "", so each character is isolated but if you'd prefer to animate in word-by-word instead you can use " "`
    });
  }

  const handleBlur = () => {
    setInputInfo(null);
  }

  useEffect(() => {
    setDelimiter(delimiterValue);
  }, [delimiterValue]);

  return (
    <SidebarInput
      value={delimiter}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handlePointsChange}
      onSubmit={handleDelimiterSubmit}
      submitOnBlur
      bottomLabel='Delimiter' />
  );
}

export default EaseEditorTextDelimiterInput;