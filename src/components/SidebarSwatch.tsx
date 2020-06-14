import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
// import { connect } from 'react-redux';
// import { OpenColorEditorPayload, ColorEditorTypes } from '../store/actionTypes/colorEditor';
// import { openColorEditor } from '../store/actions/colorEditor';
// import { OpenFillEditorPayload, FillEditorTypes } from '../store/actionTypes/fillEditor';
// import { openFillEditor } from '../store/actions/fillEditor';
import { ThemeContext } from './ThemeProvider';
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
  active?: boolean;
  //onChange?(color: string): void;
  //onClose?(color: string): void;
}

const SidebarSwatch = (props: SidebarSwatchProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const swatchRef = useRef<HTMLDivElement>(null);
  const { style, active, bottomLabel, disabled, onClick } = props;
  const handleClick = () => {
    const bounding = swatchRef.current.getBoundingClientRect();
    onClick(bounding);
    //openFillEditor({fill, layer, x: bounding.x - 228, y: bounding.y > paperMain.view.bounds.height / 2 ? bounding.y - 208 : bounding.y + 4});
  }
  return (
    <div
      className='c-sidebar-input'
      ref={swatchRef}>
      <div className='c-sidebar-input__inner'>
        <button
          className='c-sidebar-swatch'
          onClick={handleClick}
          disabled={disabled}
          style={{
            boxShadow: active
            ? `0 0 0 1px ${theme.palette.primary}`
            : 'none',
            ...style
          }} />
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
    </div>
  );
}

export default SidebarSwatch;