import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerLeadingPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerLeading } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { TextSettingsTypes, SetTextSettingsLeadingPayload } from '../store/actionTypes/textSettings';
import { setTextSettingsLeading } from '../store/actions/textSettings';

interface LeadingInputProps {
  selected?: string[];
  leadingValue?: number;
  setLayerLeading?(payload: SetLayerLeadingPayload): LayerTypes;
  setTextSettingsLeading?(payload: SetTextSettingsLeadingPayload): TextSettingsTypes;
}

const LeadingInput = (props: LeadingInputProps): ReactElement => {
  const { selected, setLayerLeading, leadingValue } = props;
  const [leading, setLeading] = useState<string | number>(props.leadingValue);

  useEffect(() => {
    setLeading(leadingValue);
  }, [leadingValue, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setLeading(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      let nextLeading = evaluate(`${leading}`);
      if (nextLeading !== leadingValue && !isNaN(nextLeading)) {
        if (nextLeading < 1) {
          nextLeading = 1;
        }
        setLayerLeading({id: selected[0], leading: nextLeading});
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
      disabled={selected.length > 1 || selected.length === 0}
      bottomLabel={'Leading'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const leadingValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1:
        return (layer.present.byId[layer.present.selected[0]] as em.Text).textStyle.leading;
      default:
        return null;
    }
  })();
  return { selected, leadingValue };
};

export default connect(
  mapStateToProps,
  { setLayerLeading, setTextSettingsLeading }
)(LeadingInput);