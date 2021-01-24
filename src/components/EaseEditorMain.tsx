import React, { useContext, ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import EaseEditorMainHead from './EaseEditorMainHead';
import EaseEditorMainFoot from './EaseEditorMainFoot';
import EaseEditorMainBody from './EaseEditorMainBody';

const EaseEditorMain = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const [tab, setTab] = useState('ease');

  return (
    <div
      className='c-ease-editor__main'
      style={{
        height: 568,
        width: 400,
        background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
        borderRadius: `0 ${theme.unit}px ${theme.unit}px 0`,
      }}>
      <EaseEditorMainHead
        tab={tab}
        setTab={setTab} />
      <EaseEditorMainBody
        tab={tab} />
      <EaseEditorMainFoot />
      {/* <div className='c-ease-editor__preset-group'>
        <div
          className='c-ease-editor__preset c-ease-editor__preset--label'
          style={{
            color: theme.text.lighter
          }}>
          Ease
        </div>
        <SidebarSectionRow>
          <SidebarSectionColumn width='100%'>
            <EaseEditorEaseInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        {
          (() => {
            switch(easeValue) {
              case 'customBounce':
                return (
                  <SidebarSectionRow>
                    <SidebarSectionColumn width='50%'>
                      <EaseEditorBounceStrengthInput />
                    </SidebarSectionColumn>
                    <SidebarSectionColumn width='50%'>
                      <EaseEditorBounceSquashInput />
                    </SidebarSectionColumn>
                  </SidebarSectionRow>
                );
              case 'customWiggle':
                return (
                  <SidebarSectionRow>
                    <SidebarSectionColumn width='50%'>
                      <EaseEditorWiggleWigglesInput />
                    </SidebarSectionColumn>
                    <SidebarSectionColumn width='50%'>
                      <EaseEditorWiggleTypeInput />
                    </SidebarSectionColumn>
                  </SidebarSectionRow>
                );
              case 'rough':
                return (
                  <>
                    <SidebarSectionRow>
                      <SidebarSectionColumn width='50%'>
                        <EaseEditorRoughTaperInput />
                      </SidebarSectionColumn>
                      <SidebarSectionColumn width='50%'>
                        <EaseEditorRoughTemplateInput />
                      </SidebarSectionColumn>
                    </SidebarSectionRow>
                    <SidebarSectionRow>
                      <SidebarSectionColumn width='50%'>
                        <EaseEditorRoughPointsInput />
                      </SidebarSectionColumn>
                      <SidebarSectionColumn width='50%'>
                        <EaseEditorRoughStrengthInput />
                      </SidebarSectionColumn>
                    </SidebarSectionRow>
                  </>
                );
              case 'steps':
                return (
                  <SidebarSectionRow>
                    <SidebarSectionColumn width='50%'>
                      <EaseEditorStepsInput />
                    </SidebarSectionColumn>
                    <SidebarSectionColumn width='50%'>
                    </SidebarSectionColumn>
                  </SidebarSectionRow>
                );
              case 'slow':
                return (
                  <SidebarSectionRow>
                    <SidebarSectionColumn width='50%'>
                      <EaseEditorSlowLinearRatioInput />
                    </SidebarSectionColumn>
                    <SidebarSectionColumn width='50%'>
                      <EaseEditorSlowPowerInput />
                    </SidebarSectionColumn>
                  </SidebarSectionRow>
                );
              default:
                return (
                  <SidebarSectionRow>
                    <SidebarSectionColumn width='100%'>
                      <EaseEditorPowerInput />
                    </SidebarSectionColumn>
                  </SidebarSectionRow>
                );
            }
          })()
        }
      </div> */}
    </div>
  );
}

export default EaseEditorMain;