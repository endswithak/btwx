import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { OpenColorEditorPayload, ColorEditorTypes } from '../store/actionTypes/colorEditor';
import { openColorEditor } from '../store/actions/colorEditor';

interface SidebarSwatchProps {
  color: string;
  onClick?(): void;
  prop?: em.ColorEditorProp;
  layer?: string;
  openColorEditor?(payload: OpenColorEditorPayload): ColorEditorTypes;
  disabled?: boolean;
  onChange?(color: string): void;
  //blendMode: number | FileFormat.BlendMode;
}

const SidebarSwatch = (props: SidebarSwatchProps): ReactElement => {
  const swatchRef = useRef<HTMLButtonElement>(null);
  const { color, prop, layer, openColorEditor, disabled, onChange, onClick } = props;
  const handleClick = () => {
    const bounding = swatchRef.current.getBoundingClientRect();
    onClick();
    openColorEditor({color, layer, prop, onChange, x: bounding.x + 4, y: bounding.y - 241});
  }
  return (
    <button
      ref={swatchRef}
      className='c-sidebar-swatch'
      onClick={handleClick}
      disabled={disabled}>
      <div className='c-sidebar-swatch__inner'>
        <div
          className='c-sidebar-swatch__color'
          style={{background: color}} />
        {/* <SidebarSwatchBlendMode
          blendMode={blendMode} /> */}
      </div>
    </button>
  );
}

export default connect(
  null,
  { openColorEditor }
)(SidebarSwatch);