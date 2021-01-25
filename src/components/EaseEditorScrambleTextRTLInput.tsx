/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerScrambleTextTweenRightToLeft } from '../store/actions/layer';
import SidebarSelect from './SidebarSelect';

interface EaseEditorScrambleTextRTLInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorScrambleTextRTLInput = (props: EaseEditorScrambleTextRTLInputProps): ReactElement => {
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const rtlValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].scrambleText.rightToLeft : null);
  const dispatch = useDispatch();

  const rtlOptions = [{
    value: 'enabled',
    label: 'Enabled'
  },{
    value: 'disabled',
    label: 'Disabled'
  }];

  const [rtl, setRTL] = useState(rtlValue !== null ? rtlValue ? rtlOptions.find((option) => option.value === 'enabled') : rtlOptions.find((option) => option.value === 'disabled') : null);

  useEffect(() => {
    setRTL(rtlValue !== null ? rtlValue ? rtlOptions.find((option) => option.value === 'enabled') : rtlOptions.find((option) => option.value === 'disabled') : null);
  }, [rtlValue]);

  const handleSelectorChange = (selectedOption: { value: string; label: string }): void => {
    if ((selectedOption.value === 'enabled' && !rtlValue) || (selectedOption.value === 'disabled' && rtlValue)) {
      setRTL(selectedOption);
      dispatch(setLayerScrambleTextTweenRightToLeft({id: id, rightToLeft: selectedOption.value === 'enabled'}));
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'Boolean',
      description: 'If enabled, the text will be revealed from right to left'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  return (
    <SidebarSelect
      value={rtl}
      onChange={handleSelectorChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      options={rtlOptions}
      placeholder='multi'
      bottomLabel='RTL' />
  );
}

export default EaseEditorScrambleTextRTLInput;