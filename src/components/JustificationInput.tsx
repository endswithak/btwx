import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersJustification } from '../store/actions/layer';
import { getSelectedJustification } from '../store/selectors/layer';
import { setTextSettingsJustification } from '../store/actions/textSettings';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarButtonGroup from './SidebarButtonGroup';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

const JustificationInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const justificationValue = useSelector((state: RootState) => getSelectedJustification(state));
  const [justification, setJustification] = useState(justificationValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setJustification(justificationValue);
  }, [justificationValue, selected]);

  const handleClick = (justificationButtonValue: Btwx.Jusftification): void => {
    dispatch(setLayersJustification({layers: selected, justification: justificationButtonValue as Btwx.Jusftification}));
    setJustification(justificationButtonValue);
    dispatch(setTextSettingsJustification({justification: justificationButtonValue as Btwx.Jusftification}));
  };

  return (
    <SidebarButtonGroup bottomLabel='Alignment'>
      <SidebarSectionRow>
        <SidebarSectionColumn width='33.33%'>
          <SidebarToggleButton
            onClick={() => handleClick('left')}
            active={'left' === justification}>
            <Icon name='justify-left' />
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn width='33.33%'>
          <SidebarToggleButton
            onClick={() => handleClick('center')}
            active={'center' === justification}>
            <Icon name='justify-center' />
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn width='33.33%'>
          <SidebarToggleButton
            onClick={() => handleClick('right')}
            active={'right' === justification}>
            <Icon name='justify-right' />
          </SidebarToggleButton>
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarButtonGroup>
  );
}

export default JustificationInput;