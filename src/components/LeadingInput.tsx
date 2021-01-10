import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { setLayersLeadingThunk } from '../store/actions/layer';
import { getSelectedLeading } from '../store/selectors/layer';
import { setTextSettingsLeading } from '../store/actions/textSettings';
import SidebarInput from './SidebarInput';

const LeadingInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const leadingValue = useSelector((state: RootState) => getSelectedLeading(state));
  const [leading, setLeading] = useState(leadingValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setLeading(leadingValue);
  }, [leadingValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setLeading(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      let nextLeading = mexp.eval(`${leading}`) as any;
      if (nextLeading !== leadingValue) {
        if (nextLeading < 1) {
          nextLeading = 1;
        }
        dispatch(setLayersLeadingThunk({layers: selected, leading: Math.round(nextLeading)}));
        dispatch(setTextSettingsLeading({leading: Math.round(nextLeading)}));
        setLeading(Math.round(nextLeading));
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

export default LeadingInput;