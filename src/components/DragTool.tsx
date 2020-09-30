import React, { ReactElement, useEffect } from 'react';
import { paperMain } from '../canvas';

const DragTool = (): ReactElement => {

  useEffect(() => {
    return (): void => {
      const guides = paperMain.project.getItems({data: { id: 'Guide' }});
      const measureGuides = paperMain.project.getItems({data: { id: 'MeasureGuide' }});
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

export default DragTool;