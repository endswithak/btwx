// import { remote } from 'electron';
// import React, { useContext, useEffect, ReactElement, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import tinyColor from 'tinycolor2';
// import { RootState } from '../store/reducers';
// import { closeContextMenu } from '../store/actions/contextMenu';
// import { ThemeContext } from './ThemeProvider';
// import ContextMenuItem from './ContextMenuItem';
// import ContextMenuEmptyState from './ContextMenuEmptyState';
// import ContextMenuHead from './ContextMenuHead';
// import ContextMenuDivider from './ContextMenuDivider';

// interface ContextMenuProps {
//   options: Electron.MenuItem[];
//   onClose?(props: any): void;
// }

// const ContextMenu = (props: ContextMenuProps): ReactElement => {
//   const { options, onClose } = props;
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const menu = remote.Menu.buildFromTemplate(options);
//     menu.popup({
//       callback: () => {
//         dispatch(closeContextMenu());
//       }
//     });
//   }, []);

//   return (
//     <></>
//   );
// }

// export default ContextMenu;

import React, { useContext, useEffect, ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeContextMenu } from '../store/actions/contextMenu';
import { ThemeContext } from './ThemeProvider';
import ContextMenuItem from './ContextMenuItem';
import ContextMenuEmptyState from './ContextMenuEmptyState';
import ContextMenuHead from './ContextMenuHead';
import ContextMenuDivider from './ContextMenuDivider';

interface ContextMenuProps {
  options: {
    type: 'MenuItem' | 'MenuHead' | 'MenuDivider';
    text: string;
    disabled: boolean;
    hidden: boolean;
    onClick(): void;
    checked?: boolean;
    backButton?: boolean;
    backButtonClick?(): void;
    onMouseEnter?(): void;
    onMouseLeave?(): void;
  }[];
  emptyState?: string;
}

const ContextMenu = (props: ContextMenuProps): ReactElement => {
  const ref = useRef(null);
  const theme = useContext(ThemeContext);
  const { options, emptyState } = props;
  const initialX = useSelector((state: RootState) => state.contextMenu.x);
  const initialY = useSelector((state: RootState) => state.contextMenu.y);
  const visibleOptions = options.filter(option => !option.hidden);
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
  const dispatch = useDispatch();

  const handleMouseDown = (e: any) => {
    if (e.buttons !== 2 && !ref.current.contains(e.target)) {
      dispatch(closeContextMenu());
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
        width: 232,
        background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString(),
        boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16)`,
        left: x,
        top: y,
        transform: `translate(4px, -24px)`
      }}>
      {
        options.length > 0
        ? options.map((option: {type: 'MenuItem' | 'MenuHead' | 'MenuDivider'; text: string; onClick(): void; disabled: boolean; hidden: boolean; checked?: boolean; backButton: boolean; backButtonClick(): void; onMouseEnter(): void; onMouseLeave(): void }, index: number) => {
            if (!option.hidden) {
              switch(option.type) {
                case 'MenuItem': {
                  return (
                    <ContextMenuItem
                      key={index}
                      disabled={option.disabled}
                      checked={option.checked}
                      onClick={option.onClick}
                      onMouseEnter={option.onMouseEnter}
                      onMouseLeave={option.onMouseLeave}
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

export default ContextMenu;