import React, { useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { ContextMenuState } from '../store/reducers/contextMenu';
import { ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { closeContextMenu } from '../store/actions/contextMenu';
import ContextMenuItem from './ContextMenuItem';
import ContextMenuEmptyState from './ContextMenuEmptyState';
import ContextMenuHead from './ContextMenuHead';
import tinyColor from 'tinycolor2';

interface ContextMenuProps {
  options: {
    text: string;
    disabled: boolean;
    onClick(): void;
  }[];
  emptyState?: string;
  contextMenu?: ContextMenuState;
  x?: number;
  y?: number;
  closeContextMenu?(): ContextMenuTypes;
}

const ContextMenu = (props: ContextMenuProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { options, contextMenu, emptyState, closeContextMenu, x, y } = props;

  useEffect(() => {
    document.addEventListener('keydown', closeContextMenu);
    return () => {
      document.removeEventListener('keydown', closeContextMenu);
    }
  }, []);

  return (
    <div className='c-context-menu-wrap'>
      <div
        className='c-context-menu__overlay'
        onMouseDown={closeContextMenu} />
      <div
        className='c-context-menu'
        id='context-menu'
        style={{
          width: 200,
          background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString(),
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16)`,
          left: x,
          top: y
        }}>
        {
          options.length > 0
          ? options.map((option: {type: 'MenuItem' | 'MenuHead'; text: string; onClick(): void; disabled: boolean}, index: number) => {
              switch(option.type) {
                case 'MenuItem': {
                  return (
                    <ContextMenuItem
                      key={index}
                      disabled={option.disabled}
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
          : emptyState
            ? <ContextMenuEmptyState
                text={emptyState} />
            : null
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