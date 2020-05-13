import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { closeContextMenu, openContextMenu } from '../store/actions/contextMenu';
import ContextMenu from './ContextMenu';

interface TweenSelectProps {
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

const TweenEventSelect = (props: TweenSelectProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { contextMenu, openContextMenu, closeContextMenu } = props;

  const tweenEventSelectOptions = [{
    text: 'Click',
    onClick: () => {
      closeContextMenu();
      openContextMenu({
        ...contextMenu,
        type: 'TweenEventDestination',
        data: {
          tweenEvent: 'click'
        }
      });
    }
  },{
    text: 'Double Click',
    onClick: () => {
      closeContextMenu();
      openContextMenu({
        ...contextMenu,
        type: 'TweenEventDestination',
        data: {
          tweenEvent: 'doubleclick'
        }
      });
    }
  },{
    text: 'Mouse Enter',
    onClick: () => {
      closeContextMenu();
      openContextMenu({
        ...contextMenu,
        type: 'TweenEventDestination',
        data: {
          tweenEvent: 'mouseenter'
        }
      });
    }
  },{
    text: 'Mouse Leave',
    onClick: () => {
      closeContextMenu();
      openContextMenu({
        ...contextMenu,
        type: 'TweenEventDestination',
        data: {
          tweenEvent: 'mouseleave'
        }
      });
    }
  }];

  return (
    <ContextMenu
      options={tweenEventSelectOptions}
      type='TweenEvent' />
  );
}

const mapStateToProps = (state: RootState) => {
  const { contextMenu } = state;
  return { contextMenu };
};

export default connect(
  mapStateToProps,
  { openContextMenu, closeContextMenu }
)(TweenEventSelect);