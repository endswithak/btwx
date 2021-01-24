import React, { ReactElement, useState, useContext } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import EaseEditorEaseInput from './EaseEditorEaseInput';
import EaseEditorTextInput from './EaseEditorTextInput';
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
import EaseEditorTextDelimiterInput from './EaseEditorTextDelimiterInput';
import EaseEditorScrambleTextDelimiterInput from './EaseEditorScrambleTextDelimiterInput';
import { ThemeContext } from './ThemeProvider';

gsap.registerPlugin(CustomEase);

interface EaseEditorMainBodyProps {
  tab: 'ease' | 'text';
}

const EaseEditorMainBody = (props: EaseEditorMainBodyProps): ReactElement => {
  const { tab } = props;
  const theme = useContext(ThemeContext);
  const easeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease : null);
  const scrambleValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].text.scramble : null);
  const showDescriptions = useSelector((state: RootState) => {
    if (state.easeEditor.tween) {
      switch(state.layer.present.tweens.byId[state.easeEditor.tween].ease) {
        case 'steps':
        case 'customBounce':
        case 'slow':
        case 'rough':
          return true;
        default:
          return false;
      }
    } else {
      return false;
    }
  });
  const [inputInfo, setInputInfo] = useState(null);

  return (
    <div
      className='c-ease-editor-main__section c-ease-editor-main__section--body'>
      {
        tab === 'ease'
        ? <EaseEditorEaseInput />
        : <EaseEditorTextInput />
      }
      <div className='c-ease-editor-body__inputs'>
        {
          tab === 'ease'
          ? (() => {
              switch(easeValue) {
                case 'customBounce':
                  return (
                    <SidebarSectionRow>
                      <SidebarSectionColumn width='33.33%'>
                        <EaseEditorBounceStrengthInput
                          setInputInfo={setInputInfo} />
                      </SidebarSectionColumn>
                      <SidebarSectionColumn width='33.33%'>
                        <EaseEditorBounceSquashInput
                          setInputInfo={setInputInfo} />
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
                          <EaseEditorRoughTaperInput
                            setInputInfo={setInputInfo} />
                        </SidebarSectionColumn>
                        {/* <SidebarSectionColumn width='33.33%'>
                          <EaseEditorRoughTemplateInput />
                        </SidebarSectionColumn> */}
                        <SidebarSectionColumn width='33.33%'>
                          <EaseEditorRoughPointsInput
                            setInputInfo={setInputInfo} />
                        </SidebarSectionColumn>
                        <SidebarSectionColumn width='33.33%'>
                          <EaseEditorRoughStrengthInput
                            setInputInfo={setInputInfo} />
                        </SidebarSectionColumn>
                      </SidebarSectionRow>
                      <SidebarSectionRow>
                        <SidebarSectionColumn width='100%'>
                          <EaseEditorRoughTemplateInput
                            setInputInfo={setInputInfo} />
                        </SidebarSectionColumn>
                      </SidebarSectionRow>
                    </>
                  );
                case 'steps':
                  return (
                    <SidebarSectionRow>
                      <SidebarSectionColumn width='33.33%'>
                        <EaseEditorStepsInput
                          setInputInfo={setInputInfo} />
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
                          setInputInfo={setInputInfo} />
                      </SidebarSectionColumn>
                      <SidebarSectionColumn width='33.33%'>
                        <EaseEditorSlowPowerInput
                          setInputInfo={setInputInfo} />
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
          : scrambleValue
            ? <SidebarSectionRow>
                <SidebarSectionColumn width='33.33%'>
                  <EaseEditorTextDelimiterInput
                    setInputInfo={setInputInfo} />
                </SidebarSectionColumn>
                <SidebarSectionColumn width='33.33%'>
                </SidebarSectionColumn>
                <SidebarSectionColumn width='33.33%'>
                </SidebarSectionColumn>
              </SidebarSectionRow>
            : <SidebarSectionRow>
                <SidebarSectionColumn width='33.33%'>
                  <EaseEditorScrambleTextDelimiterInput
                    setInputInfo={setInputInfo} />
                </SidebarSectionColumn>
                <SidebarSectionColumn width='33.33%'>
                </SidebarSectionColumn>
                <SidebarSectionColumn width='33.33%'>
                </SidebarSectionColumn>
              </SidebarSectionRow>
        }
      </div>
      {
        inputInfo
        ? (() => {
            return (
              <div className='c-ease-editor-body__input-description'>
                <div
                  className='c-ease-editor-body-input-description__type'
                  style={{
                    color: theme.text.light,
                    boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
                  }}>
                  { inputInfo.type }
                </div>
                <div
                  className='c-ease-editor-body-input-description__info'
                  style={{
                    color: theme.text.light,
                    boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
                  }}>
                  { inputInfo.description }
                </div>
              </div>
            )
          })()
        : null
      }
    </div>
  );
}

export default EaseEditorMainBody;