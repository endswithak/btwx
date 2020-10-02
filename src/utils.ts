import { BrowserWindow, remote } from 'electron';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { PREVIEW_PREFIX } from './constants';

gsap.registerPlugin(ScrollToPlugin);

export const bufferToBase64 = (buffer: Buffer) => {
  return btoa(
    new Uint8Array(buffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
};

export const isBetween = (x: number, min: number, max: number): boolean => {
  return x >= min && x <= max;
};

export const layerInScrollView = (id: string) => {
  const layerDomItem = document.getElementById(id);
  const rect = layerDomItem.getBoundingClientRect();
  const top = rect.top;
  const height = 32;
  const bottom = top + height;
  const parent = document.getElementById('sidebar-scroll-left');
  const parentRect = parent.getBoundingClientRect();
  return top <= parentRect.top
         ? parentRect.top - top <= height
         : bottom - parentRect.bottom <= height;
};

export const scrollToLayer = (id: string) => {
  const leftSidebar = document.getElementById('sidebar-scroll-left');
  const layerDomItem = document.getElementById(id);
  if (leftSidebar && layerDomItem && !layerInScrollView(id)) {
    gsap.set(leftSidebar, {
      scrollTo: {
        y: layerDomItem
      }
    });
  }
};

export const isPreviewWindow = (): boolean => {
  const currentWindow = remote.getCurrentWindow();
  const hasParent = currentWindow.getParentWindow();
  const previewPrefix = currentWindow.getTitle().startsWith(PREVIEW_PREFIX);
  return hasParent && previewPrefix;
};

export const getPreviewWindow = (): BrowserWindow => {
  const currentWindow = remote.getCurrentWindow();
  const childWindows = currentWindow.getChildWindows();
  return childWindows.find((window) => window.getTitle().startsWith(PREVIEW_PREFIX));
};