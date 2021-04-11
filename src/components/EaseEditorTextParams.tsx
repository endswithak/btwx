import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedTextTweensScramble } from '../store/selectors/layer';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionRow from './SidebarSectionRow';
import EaseEditorTextDelimiterInput from './EaseEditorTextDelimiterInput';
import EaseEditorScrambleTextDelimiterInput from './EaseEditorScrambleTextDelimiterInput';
import EaseEditorScrambleTextSpeedInput from './EaseEditorScrambleTextSpeedInput';
import EaseEditorScrambleTextRTLInput from './EaseEditorScrambleTextRTLInput';
import EaseEditorScrambleTextCharsInput from './EaseEditorScrambleTextCharsInput';
import EaseEditorScrambleTextCustomCharsInput from './EaseEditorScrambleTextCustomCharsInput';

interface EaseEditorTextParamsProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorTextParams = (props: EaseEditorTextParamsProps): ReactElement => {
  const { setParamInfo } = props;
  const scrambleValue = useSelector((state: RootState) => getSelectedTextTweensScramble(state));

  switch(scrambleValue) {
    case true:
      return (
        <>
          <SidebarSectionRow>
            <SidebarSectionColumn width='33.33%'>
              <EaseEditorScrambleTextDelimiterInput
                setParamInfo={setParamInfo} />
            </SidebarSectionColumn>
            <SidebarSectionColumn width='33.33%'>
              <EaseEditorScrambleTextSpeedInput
                setParamInfo={setParamInfo} />
            </SidebarSectionColumn>
            <SidebarSectionColumn width='33.33%'>
              <EaseEditorScrambleTextRTLInput
                setParamInfo={setParamInfo} />
            </SidebarSectionColumn>
          </SidebarSectionRow>
          <SidebarSectionRow>
            <SidebarSectionColumn width='66.66%'>
              <EaseEditorScrambleTextCharsInput
                setParamInfo={setParamInfo} />
            </SidebarSectionColumn>
            <SidebarSectionColumn width='33.33%'>
              <EaseEditorScrambleTextCustomCharsInput
                setParamInfo={setParamInfo} />
            </SidebarSectionColumn>
          </SidebarSectionRow>
        </>
      );
    case false:
      return (
        <SidebarSectionRow>
          <SidebarSectionColumn width='33.33%'>
            <EaseEditorTextDelimiterInput
              setParamInfo={setParamInfo} />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
          </SidebarSectionColumn>
        </SidebarSectionRow>
      );
    case 'multi':
      return null;
  }
}

export default EaseEditorTextParams;