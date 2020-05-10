import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { closeContextMenu, openContextMenu } from '../store/actions/contextMenu';
import ContextMenuItem from './ContextMenuItem';

Modal.setAppElement('#root');

interface ContextMenuProps {
  type: em.ContextMenu;
  options: {
    text: string;
    onClick(): void;
  }[];
  contextMenu?: {
    type: em.ContextMenu,
    id: string;
    isOpen: boolean;
    x: number;
    y: number;
  };
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
  closeContextMenu?(): ContextMenuTypes;
  onClose?(): void;
  onOpen?(): void;
}

const ContextMenu = (props: ContextMenuProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { options, contextMenu, openContextMenu, closeContextMenu, onClose, onOpen } = props;

  const handleAfterOpen = () => {

  }

  const handleCloseRequest = () => {
    closeContextMenu();
  }

  return (
    <Modal
      className='c-context-menu'
      overlayClassName='c-context-menu__overlay'
      isOpen={contextMenu.isOpen && contextMenu.type === props.type}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onAfterOpen={onOpen}
      onRequestClose={handleCloseRequest}
      onAfterClose={onClose}
      style={{
        content: {
          background: theme.background.z4,
          width: 200,
          height: (theme.unit * 8) * options.length,
          top: contextMenu.y,
          left: contextMenu.x
        }
      }}
      contentLabel='context-menu'>
      {
        options.map((option: {text: string; onClick(): void}, index: number) => (
          <ContextMenuItem
            key={index}
            onClick={option.onClick}
            text={option.text} />
        ))
      }
    </Modal>
  );
}

const mapStateToProps = (state: RootState) => {
  const { contextMenu } = state;
  return { contextMenu };
};

export default connect(
  mapStateToProps,
  { openContextMenu, closeContextMenu }
)(ContextMenu);