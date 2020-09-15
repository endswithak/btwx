import React, { useContext, useEffect, ReactElement, useRef } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { ContextMenuState } from '../store/reducers/contextMenu';
import { ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { closeContextMenu } from '../store/actions/contextMenu';
import ContextMenuItem from './ContextMenuItem';
import ContextMenuEmptyState from './ContextMenuEmptyState';
import ContextMenuHead from './ContextMenuHead';
import ContextMenuDivider from './ContextMenuDivider';
import tinyColor from 'tinycolor2';

interface ContextMenuProps {
  options: {
    type: 'MenuItem' | 'MenuHead' | 'MenuDivider';
    text: string;
    disabled: boolean;
    hidden: boolean;
    onClick(): void;
    backButton?: boolean;
    backButtonClick?(): void;
  }[];
  emptyState?: string;
  contextMenu?: ContextMenuState;
  x?: number;
  y?: number;
  closeContextMenu?(): ContextMenuTypes;
}

const ContextMenu = (props: ContextMenuProps): ReactElement => {
  const ref = useRef(null);
  const theme = useContext(ThemeContext);
  const { options, contextMenu, emptyState, closeContextMenu, x, y } = props;

  const handleMouseDown = (e: any) => {
    if (e.buttons !== 2 && !ref.current.contains(e.target)) {
      closeContextMenu();
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', closeContextMenu);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', closeContextMenu);
    }
  }, []);

  return (
    <div
      className='c-context-menu'
      id='context-menu'
      ref={ref}
      style={{
        width: 224,
        background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString(),
        boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16)`,
        left: x,
        top: y,
        transform: `translate(4px, -24px)`
      }}>
      {
        options.length > 0
        ? options.map((option: {type: 'MenuItem' | 'MenuHead' | 'MenuDivider'; text: string; onClick(): void; disabled: boolean; hidden: boolean; backButton: boolean; backButtonClick(): void }, index: number) => {
            if (!option.hidden) {
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
                      text={option.text}
                      backButton={option.backButton}
                      backButtonClick={option.backButtonClick} />
                  )
                }
                case 'MenuDivider': {
                  return (
                    <ContextMenuDivider
                      key={index} />
                  )
                }
              }
            }
          })
        : emptyState
          ? <ContextMenuEmptyState
              text={emptyState} />
          : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: ContextMenuProps) => {
  const { contextMenu } = state;
  const initialX = contextMenu.x;
  const initialY = contextMenu.y;
  const visibleOptions = ownProps.options.filter(option => !option.hidden);
  const menuHeight = visibleOptions.reduce((result, current) => {
    switch(current.type) {
      case 'MenuHead':
      case 'MenuItem':
        return result + 24;
      case 'MenuDivider':
        return result + 8;
      default:
        return result;
    }
  }, 0);
  const menuWidth = 224;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  let x;
  let y;
  if (initialX + menuWidth > windowWidth) {
    x = initialX - menuWidth;
  } else {
    x = initialX;
  }
  if (initialY + menuHeight > windowHeight) {
    if (initialY + (menuHeight / 2) > windowHeight) {
      y = initialY - menuHeight;
    } else {
      y = initialY - (menuHeight / 2);
    }
  } else {
    y = initialY;
  }
  return { contextMenu, x, y };
};

export default connect(
  mapStateToProps,
  { closeContextMenu }
)(ContextMenu);