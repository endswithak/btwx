import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
// import { connect } from 'react-redux';
// import { OpenColorEditorPayload, ColorEditorTypes } from '../store/actionTypes/colorEditor';
// import { openColorEditor } from '../store/actions/colorEditor';
// import { OpenFillEditorPayload, FillEditorTypes } from '../store/actionTypes/fillEditor';
// import { openFillEditor } from '../store/actions/fillEditor';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';
//import { paperMain } from '../canvas';

interface SidebarSwatchProps {
  //color: string;
  style?: any;
  //fill?: em.Fill;
  //colorEditor?: any;
  //fillEditor?: any;
  onClick?(bounding: DOMRect): void;
  //prop?: em.ColorEditorProp;
  //layer?: string;
  bottomLabel?: string;
  //openColorEditor?(payload: OpenColorEditorPayload): ColorEditorTypes;
  //openFillEditor?(payload: OpenFillEditorPayload): FillEditorTypes;
  disabled?: boolean;
  isActive?: boolean;
  //onChange?(color: string): void;
  //onClose?(color: string): void;
}

const Swatch = styled.div<SidebarSwatchProps>`
  .c-sidebar-swatch {
    box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
    :hover {
      box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
    }
  }
  .c-sidebar-input__bottom-label {
    color: ${props => props.theme.text.base};
  }
`;

const SidebarSwatch = (props: SidebarSwatchProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const swatchRef = useRef<HTMLDivElement>(null);
  const { style, isActive, bottomLabel, disabled, onClick } = props;
  const handleClick = () => {
    const bounding = swatchRef.current.getBoundingClientRect();
    onClick(bounding);
  }
  return (
    <Swatch
      className='c-sidebar-input'
      ref={swatchRef}
      isActive={isActive}
      theme={theme}>
      <div className='c-sidebar-input__inner'>
        <button
          className='c-sidebar-swatch'
          onClick={handleClick}
          disabled={disabled}
          style={style} />
        {
          bottomLabel
          ? <div
              className='c-sidebar-input__bottom-label'
              style={{
                color: theme.text.base
              }}>
              { bottomLabel }
            </div>
          : null
        }
      </div>
    </Swatch>
  );
}

export default SidebarSwatch;