import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

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

export const scrollToLayer = (id: string) => {
  const leftSidebar = document.getElementById('sidebar-scroll-left');
  const layerDomItem = document.getElementById(id);
  if (layerDomItem) {
    gsap.set(leftSidebar, {
      scrollTo: {
        y: layerDomItem
      }
    });
  }
};