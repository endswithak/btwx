import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { closeContextMenu, openContextMenu } from '../store/actions/contextMenu';
import ContextMenu from './ContextMenu';

interface ContextMenuProps {
  contextMenu?: {
    id: string;
    isOpen: boolean;
    x: number;
    y: number;
    data: any;
  };
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
  closeContextMenu?(): ContextMenuTypes;
}

const AnimationSelectMenu = (props: ContextMenuProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { contextMenu, openContextMenu, closeContextMenu } = props;

  const animationSelectOptions = [{
    text: 'Click',
    onClick: () => {
      closeContextMenu();
      openContextMenu({
        ...contextMenu,
        type: 'AnimationArtboardSelect',
        data: {
          animationEvent: 'click'
        }
      });
    }
  },{
    text: 'Double Click',
    onClick: () => {
      closeContextMenu();
      openContextMenu({
        ...contextMenu,
        type: 'AnimationArtboardSelect',
        data: {
          animationEvent: 'doubleClick'
        }
      });
    }
  }];

  return (
    <ContextMenu
      options={animationSelectOptions}
      type='AnimationEventSelect' />
  );
}

const mapStateToProps = (state: RootState) => {
  const { contextMenu } = state;
  return { contextMenu };
};

export default connect(
  mapStateToProps,
  { openContextMenu, closeContextMenu }
)(AnimationSelectMenu);