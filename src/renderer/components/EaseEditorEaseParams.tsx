import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedTweensEase } from '../store/selectors/layer';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionRow from './SidebarSectionRow';
import EaseEditorPowerInput from './EaseEditorPowerInput';
import EaseEditorBounceStrengthInput from './EaseEditorBounceStrengthInput';
import EaseEditorBounceSquashInput from './EaseEditorBounceSquashInput';
import EaseEditorWiggleStrengthInput from './EaseEditorWiggleStrengthInput';
import EaseEditorWiggleWigglesInput from './EaseEditorWiggleWigglesInput';
import EaseEditorWiggleTypeInput from './EaseEditorWiggleTypeInput';
import EaseEditorStepsInput from './EaseEditorStepsInput';
import EaseEditorRoughPointsInput from './EaseEditorRoughPointsInput';
import EaseEditorRoughStrengthInput from './EaseEditorRoughStrengthInput';
import EaseEditorRoughTaperInput from './EaseEditorRoughTaperInput';
import EaseEditorRoughTemplateInput from './EaseEditorRoughTemplateInput';
import EaseEditorSlowLinearRatioInput from './EaseEditorSlowLinearRatioInput';
import EaseEditorSlowPowerInput from './EaseEditorSlowPowerInput';

interface EaseEditorEaseParamsProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorEaseParams = (props: EaseEditorEaseParamsProps): ReactElement => {
  const { setParamInfo } = props;
  const easeValue = useSelector((state: RootState) => getSelectedTweensEase(state));

  return (
    <>
      {
        (() => {
          switch(easeValue) {
            case 'customBounce':
              return (
                <SidebarSectionRow>
                  <SidebarSectionColumn width='33.33%'>
                    <EaseEditorBounceStrengthInput
                      setParamInfo={setParamInfo} />
                  </SidebarSectionColumn>
                  <SidebarSectionColumn width='33.33%'>
                    <EaseEditorBounceSquashInput
                      setParamInfo={setParamInfo} />
                  </SidebarSectionColumn>
                  <SidebarSectionColumn width='33.33%'>
                  </SidebarSectionColumn>
                </SidebarSectionRow>
              );
            case 'customWiggle':
              return (
                <SidebarSectionRow>
                  <SidebarSectionColumn width='33.33%'>
                    <EaseEditorWiggleStrengthInput
                      setParamInfo={setParamInfo} />
                  </SidebarSectionColumn>
                  <SidebarSectionColumn width='33.33%'>
                    <EaseEditorWiggleWigglesInput
                      setParamInfo={setParamInfo} />
                  </SidebarSectionColumn>
                  <SidebarSectionColumn width='33.33%'>
                    <EaseEditorWiggleTypeInput
                      setParamInfo={setParamInfo} />
                  </SidebarSectionColumn>
                </SidebarSectionRow>
              );
            case 'rough':
              return (
                <>
                  <SidebarSectionRow>
                    <SidebarSectionColumn width='33.33%'>
                      <EaseEditorRoughPointsInput
                        setParamInfo={setParamInfo} />
                    </SidebarSectionColumn>
                    <SidebarSectionColumn width='33.33%'>
                      <EaseEditorRoughStrengthInput
                        setParamInfo={setParamInfo} />
                    </SidebarSectionColumn>
                    <SidebarSectionColumn width='33.33%'>
                      <EaseEditorRoughTaperInput
                        setParamInfo={setParamInfo} />
                    </SidebarSectionColumn>
                  </SidebarSectionRow>
                  <SidebarSectionRow>
                    <SidebarSectionColumn width='100%'>
                      <EaseEditorRoughTemplateInput
                        setParamInfo={setParamInfo} />
                    </SidebarSectionColumn>
                  </SidebarSectionRow>
                </>
              );
            case 'steps':
              return (
                <SidebarSectionRow>
                  <SidebarSectionColumn width='33.33%'>
                    <EaseEditorStepsInput
                      setParamInfo={setParamInfo} />
                  </SidebarSectionColumn>
                  <SidebarSectionColumn width='33.33%'>
                  </SidebarSectionColumn>
                  <SidebarSectionColumn width='33.33%'>
                  </SidebarSectionColumn>
                </SidebarSectionRow>
              );
            case 'slow':
              return (
                <SidebarSectionRow>
                  <SidebarSectionColumn width='33.33%'>
                    <EaseEditorSlowLinearRatioInput
                      setParamInfo={setParamInfo} />
                  </SidebarSectionColumn>
                  <SidebarSectionColumn width='33.33%'>
                    <EaseEditorSlowPowerInput
                      setParamInfo={setParamInfo} />
                  </SidebarSectionColumn>
                  <SidebarSectionColumn width='33.33%'>
                  </SidebarSectionColumn>
                </SidebarSectionRow>
              );
            case 'multi':
              return null;
            default:
              return (
                <EaseEditorPowerInput />
              );
          }
        })()
      }
    </>
  );
}

export default EaseEditorEaseParams;