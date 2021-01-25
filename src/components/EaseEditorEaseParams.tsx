import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionRow from './SidebarSectionRow';
import EaseEditorPowerInput from './EaseEditorPowerInput';
import EaseEditorBounceStrengthInput from './EaseEditorBounceStrengthInput';
import EaseEditorBounceSquashInput from './EaseEditorBounceSquashInput';
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
  const easeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease : null);

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
                    <EaseEditorWiggleWigglesInput />
                  </SidebarSectionColumn>
                  <SidebarSectionColumn width='33.33%'>
                    <EaseEditorWiggleTypeInput />
                  </SidebarSectionColumn>
                  <SidebarSectionColumn width='33.33%'>
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