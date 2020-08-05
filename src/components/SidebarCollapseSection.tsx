import React, { useContext, ReactElement } from 'react';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionHead from './SidebarSectionHead';
import IconButton from './IconButton';
import { ThemeContext } from './ThemeProvider';

interface SidebarCollapseSectionProps {
  header: string;
  collapsed: boolean;
  onClick(): void;
  actions?: ReactElement | ReactElement[];
  children: ReactElement | ReactElement[];
}

const SidebarCollapseSection = (props: SidebarCollapseSectionProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { header, actions, children, onClick, collapsed } = props;

  return (
    <SidebarSectionWrap bottomBorder whiteSpace>
      <SidebarSection>
        <SidebarSectionRow>
          <SidebarSectionColumn width='50%'>
            <SidebarSectionRow>
              <SidebarSectionHead text={header} />
            </SidebarSectionRow>
          </SidebarSectionColumn>
          <SidebarSectionColumn width='50%'>
            <SidebarSectionRow justifyContent='flex-end'>
              <>
                { actions }
                <IconButton
                  onClick={onClick}
                  variant='small'
                  icon={
                    collapsed
                    ? 'M8,18.2858147 L8.57963457,19 L15.9992289,11.9992726 L8.58041828,5.00073931 C8.58001654,5.00036033 8.57938365,5.00037878 8.57900467,5.00078052 C8.57898763,5.00079858 8.57897127,5.00081727 8.57895562,5.00083655 L8,5.71418532 L8,5.71418532 L14.6635524,12 L8,18.2858147 Z'
                    : 'M5.71418532,8 L5,8.57963457 L12,15.998458 C12.000379,15.9988597 12.0010119,15.9988781 12.0014136,15.998499 C12.0014277,15.9984857 12.0014414,15.998472 12.0014547,15.9984579 L19,8.57963457 L19,8.57963457 L18.2858147,8 L12,14.6635524 L5.71418532,8 Z'
                  } />
              </>
            </SidebarSectionRow>
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <SidebarSection>
          {
            !collapsed
            ? <>
                { children }
              </>
            : null
          }
        </SidebarSection>
      </SidebarSection>
    </SidebarSectionWrap>
  );
}

export default SidebarCollapseSection;