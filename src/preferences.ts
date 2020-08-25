/* eslint-disable @typescript-eslint/no-use-before-define */
import { systemPreferences, nativeTheme } from 'electron';
import {
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  DEFAULT_RIGHT_SIDEBAR_WIDTH,
  DEFAULT_TWEEN_DRAWER_HEIGHT,
  DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH
} from './constants';

const isMac = process.platform === 'darwin';

export default (() => {
  if (isMac) {
    if (!systemPreferences.getUserDefault('theme', 'string')) {
      systemPreferences.setUserDefault('theme', 'string', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    }
    if (!systemPreferences.getUserDefault('leftSidebarWidth', 'integer')) {
      systemPreferences.setUserDefault('leftSidebarWidth', 'integer', DEFAULT_LEFT_SIDEBAR_WIDTH as any);
    }
    if (!systemPreferences.getUserDefault('rightSidebarWidth', 'integer')) {
      systemPreferences.setUserDefault('rightSidebarWidth', 'integer', DEFAULT_RIGHT_SIDEBAR_WIDTH as any);
    }
    if (!systemPreferences.getUserDefault('tweenDrawerHeight', 'integer')) {
      systemPreferences.setUserDefault('tweenDrawerHeight', 'integer', DEFAULT_TWEEN_DRAWER_HEIGHT as any);
    }
    if (!systemPreferences.getUserDefault('tweenDrawerLayersWidth', 'integer')) {
      systemPreferences.setUserDefault('tweenDrawerLayersWidth', 'integer', DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH as any);
    }
  }
})();