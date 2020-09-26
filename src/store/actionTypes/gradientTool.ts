export const ENABLE_GRADIENT_TOOL = 'ENABLE_GRADIENT_TOOL';
export const DISABLE_GRADIENT_TOOL = 'DISABLE_GRADIENT_TOOL';

export interface EnableGradientToolPayload {
  handle: em.GradientHandle;
}

interface EnableGradientTool {
  type: typeof ENABLE_GRADIENT_TOOL;
  payload: EnableGradientToolPayload;
}

interface DisableGradientTool {
  type: typeof DISABLE_GRADIENT_TOOL;
}

export type GradientToolTypes = EnableGradientTool |
                                DisableGradientTool;