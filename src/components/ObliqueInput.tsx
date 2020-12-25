import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { setLayersOblique } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices, getSelectedOblique, getSelectedById } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';

const ObliqueInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const obliqueValue = useSelector((state: RootState) => getSelectedOblique(state));
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [oblique, setOblique] = useState(obliqueValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setOblique(obliqueValue);
  }, [obliqueValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setOblique(target.value);
  };

  const handleSliderChange = (e: any): void => {
    handleChange(e);
    Object.keys(selectedById).forEach((key) => {
      const layerItem = selectedById[key] as Btwx.Text;
      const paperLayer = getPaperLayer(layerItem.id, selectedProjectIndices[layerItem.id]);
      const textContent = paperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
      const startPosition = textContent.position;
      textContent.rotation = -layerItem.transform.rotation;
      const newPointText = new uiPaperScope.PointText({
        content: textContent.content,
        point: textContent.point,
        style: textContent.style,
        insert: false,
        data: textContent.data
      });
      newPointText.skew(new uiPaperScope.Point(-e.target.value, 0));
      textContent.replaceWith(newPointText);
      newPointText.rotation = layerItem.transform.rotation;
      newPointText.position = startPosition;
    });
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextOblique = mexp.eval(`${oblique}`) as any;
      if (nextOblique !== obliqueValue) {
        if (nextOblique > 14) {
          nextOblique = 14;
        }
        if (nextOblique < 0) {
          nextOblique = 0;
        }
        dispatch(setLayersOblique({layers: selected, oblique: nextOblique}));
        setOblique(nextOblique as any);
      }
    } catch(error) {
      setOblique(obliqueValue);
    }
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'66.66%'}>
        <SidebarSlider
          value={oblique !== 'multi' ? oblique : 0}
          step={1}
          max={14}
          min={0}
          onChange={handleSliderChange}
          onMouseUp={handleSubmit}
          bottomSpace />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={oblique}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitOnBlur
          label='°'
          bottomLabel='Oblique' />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default ObliqueInput;