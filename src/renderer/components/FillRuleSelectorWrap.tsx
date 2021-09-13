import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import FillRuleSelector from './FillRuleSelector';

const FillRuleSelectorWrap = (): ReactElement => {
  const isOpen = useSelector((state: RootState) => state.fillRuleSelector.isOpen);
  return (
    isOpen
    ? <FillRuleSelector />
    : null
  );
}

export default FillRuleSelectorWrap;