import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersLeadingPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersLeading } from '../store/actions/layer';
import { TextSettingsTypes, SetTextSettingsLeadingPayload } from '../store/actionTypes/textSettings';
import { setTextSettingsLeading } from '../store/actions/textSettings';

interface LeadingInputProps {
  selected?: string[];
  leadingValue?: number | 'multi';
  setLayersLeading?(payload: SetLayersLeadingPayload): LayerTypes;
  setTextSettingsLeading?(payload: SetTextSettingsLeadingPayload): TextSettingsTypes;
}

const LeadingInput = (props: LeadingInputProps): ReactElement => {
  const { selected, setLayersLeading, leadingValue } = props;
  const [leading, setLeading] = useState(props.leadingValue);

  useEffect(() => {
    setLeading(leadingValue);
  }, [leadingValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setLeading(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      let nextLeading = evaluate(`${leading}`);
      if (nextLeading !== leadingValue && !isNaN(nextLeading)) {
        if (nextLeading < 1) {
          nextLeading = 1;
        }
        setLayersLeading({layers: selected, leading: nextLeading});
        setTextSettingsLeading({leading: nextLeading});
        setLeading(nextLeading);
      } else {
        setLeading(leadingValue);
      }
    } catch(error) {
      setLeading(leadingValue);
    }
  }

  return (
    <SidebarInput
      value={leading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      bottomLabel={'Leading'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: em.Text[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const leadingValues: number[] = layerItems.reduce((result, current) => {
    return [...result, current.textStyle.leading];
  }, []);
  const leadingValue = leadingValues.every((leading: number) => leading === leadingValues[0]) ? leadingValues[0] : 'multi';
  return { selected, leadingValue };
};

export default connect(
  mapStateToProps,
  { setLayersLeading, setTextSettingsLeading }
)(LeadingInput);