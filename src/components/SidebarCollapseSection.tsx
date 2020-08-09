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
                    ? 'M8.54725139,4.50184057 C8.40702241,4.51116302 8.27836793,4.57776654 8.19072815,4.68575017 L7.61177252,5.39909894 L7.55855217,5.47924325 C7.45443579,5.67448947 7.49032678,5.92076112 7.65690583,6.07789728 L13.935,12 L7.65690583,17.9221027 C7.46652977,18.1016869 7.44684832,18.397693 7.61177252,18.6009011 L8.19140709,19.3150864 C8.37467444,19.5408956 8.71124816,19.5632536 8.92277357,19.3636697 L16.3423679,12.3629423 C16.5515308,12.1655875 16.5515136,11.8329004 16.3423302,11.6355673 L8.92351955,4.63703405 C8.82235665,4.54160206 8.68601772,4.49261536 8.54725139,4.50184057 Z'
                    : 'M17.9221027,7.65690583 L11.9999918,13.935 L6.07789728,7.65690583 C5.89831309,7.46652977 5.60230705,7.44684832 5.39909894,7.61177252 L4.68491362,8.19140709 C4.45910436,8.37467444 4.43674641,8.71124816 4.63633033,8.92277357 L11.6363303,16.341597 C11.7119065,16.421695 11.8112262,16.4740318 11.9191557,16.4917589 L12.0014807,16.4984579 C12.1391366,16.4984579 12.2707002,16.4416915 12.36516,16.3415592 L19.3637053,8.92273584 C19.5632531,8.7112047 19.5408797,8.37466147 19.3150864,8.19140709 L18.6009011,7.61177252 C18.397693,7.44684832 18.1016869,7.46652977 17.9221027,7.65690583 Z'
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