import React, { ReactElement, useEffect } from 'react';
import { paperMain } from '../canvas';

const AreaSelectTool = (): ReactElement => {

  useEffect(() => {
    return () => {
      const tooltip = paperMain.project.getItem({ data: { id: 'Tooltip' } });
      const preview = paperMain.project.getItem({ data: { id: 'AreaSelectToolPreview' } });
      const guides = paperMain.project.getItems({data: { id: 'Guide' }});
      const measureGuides = paperMain.project.getItems({data: { id: 'MeasureGuide' }});
      if (tooltip) {
        tooltip.remove();
      }
      if (preview) {
        preview.remove();
      }
      if (guides.length > 0) {
        guides.forEach(guide => guide.remove());
      }
      if (measureGuides.length > 0) {
        measureGuides.forEach(measureGuide => measureGuide.remove());
      }
    }
  }, []);

  return (
    <></>
  );
}

export default AreaSelectTool;