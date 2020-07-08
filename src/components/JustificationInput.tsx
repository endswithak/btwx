import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarToggleButton from './SidebarToggleButton';
import { RootState } from '../store/reducers';
import { SetLayerJustificationPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerJustification } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarButtonGroup from './SidebarButtonGroup';
import { TextSettingsTypes, SetTextSettingsJustificationPayload } from '../store/actionTypes/textSettings';
import { setTextSettingsJustification } from '../store/actions/textSettings';

interface JustificationInputProps {
  selected?: string[];
  justificationValue?: em.Jusftification;
  setLayerJustification?(payload: SetLayerJustificationPayload): LayerTypes;
  setTextSettingsJustification?(payload: SetTextSettingsJustificationPayload): TextSettingsTypes;
}

const JustificationInput = (props: JustificationInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { selected, justificationValue, setLayerJustification, setTextSettingsJustification } = props;
  const [justification, setJustification] = useState<em.Jusftification>(justificationValue);

  useEffect(() => {
    setJustification(justificationValue);
  }, [justificationValue, selected]);

  const handleClick = (justificationButtonValue: em.Jusftification) => {
    setLayerJustification({id: selected[0], justification: justificationButtonValue as em.Jusftification})
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
            </svg>
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn width='33.33%'>
          <SidebarToggleButton
            onClick={() => handleClick('center')}
            active={'center' === justification}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
            </svg>
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn width='33.33%'>
          <SidebarToggleButton
            onClick={() => handleClick('right')}
            active={'right' === justification}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
            </svg>
          </SidebarToggleButton>
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarButtonGroup>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const justificationValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1:
        return (layer.present.byId[layer.present.selected[0]] as em.Text).textStyle.justification;
      default:
        return null;
    }
  })();
  return { selected, justificationValue };
};

export default connect(
  mapStateToProps,
  { setLayerJustification, setTextSettingsJustification }
)(JustificationInput);