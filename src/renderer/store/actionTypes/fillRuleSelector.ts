export const OPEN_FILL_RULE_SELECTOR = 'OPEN_FILL_RULE_SELECTOR';
export const CLOSE_FILL_RULE_SELECTOR = 'CLOSE_FILL_RULE_SELECTOR';

export interface OpenFillRuleSelectorPayload {
  x: number;
  y: number;
}

export interface OpenFillRuleSelector {
  type: typeof OPEN_FILL_RULE_SELECTOR;
  payload: OpenFillRuleSelectorPayload;
}

export interface CloseFillRuleSelector {
  type: typeof CLOSE_FILL_RULE_SELECTOR;
}

export type FillRuleSelectorTypes = OpenFillRuleSelector | CloseFillRuleSelector;