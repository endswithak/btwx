import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import chroma from 'chroma-js';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarInput from './SidebarInput';
import SidebarCheckbox from './SidebarCheckbox';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';

interface SidebarFillStyleProps {
  fill: paper.Layer;
  index: number;
}

const SidebarFillStyle = (props: SidebarFillStyleProps): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, selectedPaperLayer, theme, dispatch } = globalState;
  const [enabled, setEnabled] = useState<boolean>(false);
  const { fill } = props;
  const fillLayer = fill.lastChild as paper.Path | paper.CompoundPath;

  // const color = `rgba(${Math.round(fill.color.red * 255)}, ${Math.round(fill.color.green * 255)}, ${Math.round(fill.color.blue * 255)}, ${fill.color.alpha})`;
  // const hex = chroma(color).hex();
  // const opacity = fill.color.alpha * 100;
  // const blendMode = fill.contextSettings.blendMode;

  const color = `rgba(${Math.round(fillLayer.fillColor.red * 255)}, ${Math.round(fillLayer.fillColor.green * 255)}, ${Math.round(fillLayer.fillColor.blue * 255)}, ${fillLayer.fillColor.alpha})`;
  const hex = chroma(color).hex();
  const opacity = fillLayer.fillColor.alpha * 100;
  const blendMode = fillLayer.blendMode;

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setEnabled(target.checked);
  };

  useEffect(() => {
    setEnabled(fill.visible);
  }, [selectedLayer]);

  return (
    <SidebarSectionRow alignItems='center'>
      <SidebarSectionColumn width={'10%'} justifyContent={'center'}>
        <SidebarCheckbox
          id={`fill-${props.index}`}
          onChange={handleChange}
          checked={enabled} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'23%'}>
        <SidebarSwatch
          color={color}
          blendMode={blendMode} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'47%'}>
        <SidebarInput value={hex} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'20%'}>
        <SidebarInput value={opacity} label={'%'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarFillStyle;