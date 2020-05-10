export const OPEN_ANIMATION_DRAWER = 'OPEN_ANIMATION_DRAWER';
export const CLOSE_ANIMATION_DRAWER = 'CLOSE_ANIMATION_DRAWER';

export interface OpenAnimationDrawer {
  type: typeof OPEN_ANIMATION_DRAWER;
}

export interface CloseAnimationDrawer {
  type: typeof CLOSE_ANIMATION_DRAWER;
}

export type AnimationDrawerTypes = OpenAnimationDrawer | CloseAnimationDrawer;