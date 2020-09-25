import React, { ReactElement, useEffect } from 'react';
import { paperMain } from '../canvas';

const TextTool = (): ReactElement => {

  useEffect(() => {
    return () => {
      const tooltip = paperMain.project.getItem({ data: { id: 'Tooltip' } });
      const guides = paperMain.project.getItems({data: { id: 'Guide' }});
      const measureGuides = paperMain.project.getItems({data: { id: 'MeasureGuide' }});
      if (tooltip) {
        tooltip.remove();
      }
      if (guides.length > 0) {
        guides.forEach(guide => guide.remove());
      }
      if (measureGuides.length > 0) {
        measureGuides.forEach(measureGuide => measureGuide.remove());
      }
    }
  });

  return (
    <></>
  );
}

export default TextTool;