import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { OpenColorEditorPayload, ColorEditorTypes } from '../store/actionTypes/colorEditor';
import { openColorEditor } from '../store/actions/colorEditor';
import { ThemeContext } from './ThemeProvider';
import { paperMain } from '../canvas';

interface SidebarSwatchProps {
  color: string;
  colorEditor?: any;
  onClick?(): void;
  //prop?: em.ColorEditorProp;
  layer?: string;
  bottomLabel?: string;
  openColorEditor?(payload: OpenColorEditorPayload): ColorEditorTypes;
  disabled?: boolean;
  onChange?(color: string): void;
  onClose?(color: string): void;
}

const SidebarSwatch = (props: SidebarSwatchProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const swatchRef = useRef<HTMLDivElement>(null);
  const { color, colorEditor, layer, bottomLabel, openColorEditor, disabled, onChange, onClose, onClick } = props;
  const handleClick = () => {
    const bounding = swatchRef.current.getBoundingClientRect();
    onClick();
    openColorEditor({color, layer, onChange, onClose, x: bounding.x - 228, y: bounding.y > paperMain.view.bounds.height / 2 ? bounding.y - 208 : bounding.y + 4});
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
            background: color,
            boxShadow: colorEditor.layer === layer
            ? `0 0 0 1px ${theme.palette.primary}`
            : 'none'
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

const mapStateToProps = (state: RootState) => {
  const { colorEditor } = state;
  return { colorEditor };
};

export default connect(
  mapStateToProps,
  { openColorEditor }
)(SidebarSwatch);