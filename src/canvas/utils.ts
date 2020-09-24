import { paperMain } from './';

export const removeActiveTools = () => {
  paperMain.tools.forEach((tool) => {
    tool.remove();
  });
}