import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetLayersJustificationPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersJustification } from '../store/actions/layer';
import { TextSettingsTypes, SetTextSettingsJustificationPayload } from '../store/actionTypes/textSettings';
import { setTextSettingsJustification } from '../store/actions/textSettings';
import { ThemeContext } from './ThemeProvider';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarButtonGroup from './SidebarButtonGroup';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

interface JustificationInputProps {
  selected?: string[];
  justificationValue?: em.Jusftification | 'multi';
  setLayersJustification?(payload: SetLayersJustificationPayload): LayerTypes;
  setTextSettingsJustification?(payload: SetTextSettingsJustificationPayload): TextSettingsTypes;
}

const JustificationInput = (props: JustificationInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { selected, justificationValue, setLayersJustification, setTextSettingsJustification } = props;
  const [justification, setJustification] = useState(justificationValue);

  useEffect(() => {
    setJustification(justificationValue);
  }, [justificationValue, selected]);

  const handleClick = (justificationButtonValue: em.Jusftification) => {
    setLayersJustification({layers: selected, justification: justificationButtonValue as em.Jusftification})
    setJustification(justificationButtonValue);
    setTextSettingsJustification({justification: justificationButtonValue as em.Jusftification});
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

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: em.Text[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const justificationValues: em.Jusftification[] = layerItems.reduce((result, current) => {
    return [...result, current.textStyle.justification];
  }, []);
  const justificationValue = justificationValues.every((justification: em.Jusftification) => justification === justificationValues[0]) ? justificationValues[0] : 'multi';
  return { selected, justificationValue };
};

export default connect(
  mapStateToProps,
  { setLayersJustification, setTextSettingsJustification }
)(JustificationInput);