import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { ContextMenuState } from '../store/reducers/contextMenu';
import { ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { closeContextMenu } from '../store/actions/contextMenu';
import ContextMenuItem from './ContextMenuItem';
import ContextMenuHead from './ContextMenuHead';
import tinyColor from 'tinycolor2';

interface ContextMenuProps {
  options: {
    text: string;
    onClick(): void;
  }[];
  contextMenu?: ContextMenuState;
  x?: number;
  y?: number;
  closeContextMenu?(): ContextMenuTypes;
}

const ContextMenu = (props: ContextMenuProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { options, contextMenu, closeContextMenu, x, y } = props;

  const handleCloseRequest = () => {
    closeContextMenu();
  }

  return (
    <div className='c-context-menu-wrap'>
      <div
        className='c-context-menu__overlay'
        onMouseDown={handleCloseRequest} />
      <div
        className='c-context-menu'
        style={{
          width: 200,
          background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.88).toRgbString(),
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`,
          left: x,
          top: y
        }}>
        {
          options.map((option: {type: 'MenuItem' | 'MenuHead'; text: string; onClick(): void}, index: number) => {
            switch(option.type) {
              case 'MenuItem': {
                return (
                  <ContextMenuItem
                    key={index}
                    onClick={option.onClick}
                    text={option.text} />
                )
              }
              case 'MenuHead': {
                return (
                  <ContextMenuHead
                    key={index}
                    text={option.text} />
                )
              }
            }
          })
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: ContextMenuProps) => {
  const { contextMenu } = state;
  const initialX = contextMenu.x;
  const initialY = contextMenu.y;
  const menuHeight = (ownProps.options.length * 32) + 8;
  const menuWidth = 200;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  let x;
  let y;
  if (initialX + menuWidth > windowWidth) {
    x = initialX - (menuWidth - 16);
  } else {
    x = initialX;
  }
  if (initialY + menuHeight > windowHeight) {
    y = initialY - (menuHeight + 32);
  } else {
    y = initialY;
  }
  return { contextMenu, x, y };
};

export default connect(
  mapStateToProps,
  { closeContextMenu }
)(ContextMenu);