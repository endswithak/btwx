/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { addArtboardPreset, updateArtboardPreset, setArtboardPresetDevicePlatform } from '../store/actions/documentSettings';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { ThemeContext } from './ThemeProvider';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

interface ArtboardPresetEditorWidthInputProps {
  width: number;
  setWidth(width: number): void;
}

const ArtboardPresetEditorWidthInput = (props: ArtboardPresetEditorWidthInputProps): ReactElement => {
  const formControlRef = useRef<HTMLInputElement>(null);
  const { width, setWidth } = props;
  const dispatch = useDispatch();

  const handleSubmitSuccess = (evaluation: any): void => {
    setWidth(evaluation);
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-x'
      value={width}
      size='small'
      right={<Form.Text>px</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
    // <SidebarInput
    //   value={width}
    //   onChange={handleWidthChange}
    //   onSubmit={handleSave}
    //   bottomLabel={'Width'}
    //   label='px'
    //   manualCanvasFocus />
  );
}

export default ArtboardPresetEditor;