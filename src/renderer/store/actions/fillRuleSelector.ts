import {
  OPEN_FILL_RULE_SELECTOR,
  CLOSE_FILL_RULE_SELECTOR,
  OpenFillRuleSelectorPayload,
  FillRuleSelectorTypes
} from '../actionTypes/fillRuleSelector';

export const openFillRuleSelector = (payload: OpenFillRuleSelectorPayload): FillRuleSelectorTypes => ({
  type: OPEN_FILL_RULE_SELECTOR,
  payload
});

export const closeFillRuleSelector = (): FillRuleSelectorTypes => ({
  type: CLOSE_FILL_RULE_SELECTOR
});