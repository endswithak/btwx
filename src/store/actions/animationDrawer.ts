import {
  OPEN_ANIMATION_DRAWER,
  CLOSE_ANIMATION_DRAWER,
  AnimationDrawerTypes
} from '../actionTypes/animationDrawer';

export const openAnimationDrawer = (): AnimationDrawerTypes => ({
  type: OPEN_ANIMATION_DRAWER
});

export const closeAnimationDrawer = (): AnimationDrawerTypes => ({
  type: CLOSE_ANIMATION_DRAWER
});