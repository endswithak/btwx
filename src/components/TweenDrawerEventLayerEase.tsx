import React, { useContext, ReactElement } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { closeTweenEaseEditor } from '../store/actions/tweenDrawer';
import { TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';

Modal.setAppElement('#root');

interface TweenDrawerEventLayerEaseProps {
  tween?: em.Tween;
  easeEditor?: {
    isOpen: boolean;
    x: number;
    y: number;
    id: string;
  };
  closeTweenEaseEditor?(): TweenDrawerTypes;
}

const TweenDrawerEventLayerEase = (props: TweenDrawerEventLayerEaseProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tween, easeEditor, closeTweenEaseEditor } = props;

  const handleCloseRequest = () => {
    closeTweenEaseEditor();
  }

  return (
    <Modal
      className='c-tween-drawer-event__ease'
      overlayClassName='c-context-menu__overlay'
      isOpen={easeEditor.isOpen}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleCloseRequest}
      style={{
        content: {
          background: theme.background.z4,
          width: 200,
          height: 200,
          top: easeEditor.y,
          left: easeEditor.x
        }
      }}
      contentLabel='ease-editor'>

    </Modal>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer } = state;
  const tween = layer.present.tweenById[tweenDrawer.easeEdit.id];
  const easeEditor = tweenDrawer.easeEdit;
  return { tween, easeEditor };
};

export default connect(
  mapStateToProps,
  { closeTweenEaseEditor }
)(TweenDrawerEventLayerEase);