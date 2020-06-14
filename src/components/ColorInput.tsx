import React, { ReactElement } from 'react';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';

interface ColorInputProps {
  layer: string;
  colorValue: string;
  swatchColorValue: string;
  //prop: em.ColorEditorProp;
  opacityValue: number | string;
  disabled?: boolean;
  onSwatchClick(): void;
  onSwatchChange(e: any): void;
  onSwatchClose?(editorColor: string): void;
  onColorChange(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onColorSubmit(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onOpacityChange(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
  onOpacitySubmit(e: React.SyntheticEvent<HTMLFormElement> | React.SyntheticEvent<HTMLInputElement>): void;
}

const ColorInput = (props: ColorInputProps): ReactElement => {
  const { layer, colorValue, swatchColorValue, opacityValue, disabled, onSwatchClick, onSwatchChange, onSwatchClose, onColorChange, onColorSubmit, onOpacityChange, onOpacitySubmit } = props;

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    onOpacityChange(e);
  };

  const handleColorChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    onColorChange(e);
  };

  const handleOpacitySubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    onOpacitySubmit(e);
  }

  const handleColorSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    onColorSubmit(e);
  };

  // const handleSwatchChange = (editorColor: string): void => {
  //   onSwatchChange(editorColor);
  // };

  // const handleSwatchClose = (editorColor: string): void => {
  //   onSwatchClose(editorColor);
  // };

  const handleSwatchClick = (): void => {
    onSwatchClick();
  };

  return (
    <div>
      <SidebarSectionRow alignItems='center'>
        <SidebarSectionColumn width={'33.33%'}>
          <SidebarSwatch
            //layer={layer}
            //prop={prop}
            color={swatchColorValue}
            //onChange={handleSwatchChange}
            //onClose={handleSwatchClose}
            onClick={handleSwatchClick}
            bottomLabel={'Color'} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'33.33%'}>
          <SidebarInput
            value={colorValue}
            onChange={handleColorChange}
            onSubmit={handleColorSubmit}
            submitOnBlur
            disabled={disabled}
            leftLabel={'#'}
            bottomLabel={'Hex'} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'33.33%'}>
          <SidebarInput
            value={opacityValue}
            onChange={handleOpacityChange}
            onSubmit={handleOpacitySubmit}
            submitOnBlur
            label={'%'}
            disabled={disabled}
            bottomLabel={'Opacity'} />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </div>
  );
}

export default ColorInput;