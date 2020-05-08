import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { ThemeContext } from './ThemeProvider';
import PreviewCanvas from './PreviewCanvas';
import { RootState } from '../store/reducers';
import { paperMain, paperPreview } from '../canvas';
import { LayerTypes, OpenAnimationSelectPayload } from '../store/actionTypes/layer';
import { closeAnimationSelect, openAnimationSelect } from '../store/actions/layer';
import AnimationSelectItem from './AnimationSelectItem';

Modal.setAppElement('#root');

interface AnimationSelectProps {
  animationSelect?: {
    isOpen: boolean;
    layer: string;
    x: number;
    y: number;
  };
  openAnimationSelect?(payload: OpenAnimationSelectPayload): LayerTypes;
  closeAnimationSelect?(): LayerTypes;
}

const AnimationSelect = (props: AnimationSelectProps): ReactElement => {
  const selectMenu = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { animationSelect, openAnimationSelect, closeAnimationSelect } = props;

  const animationSelectOptions = ['Click', 'Double Click', 'Mouse Enter', 'Mouse Leave'];

  const handleAfterOpen = () => {
    // const modal = document.getElementById('animation-select');
    // modal.focus();
  }

  const handleClick = (e) => {
    console.log(e);
  }

  const handleOnClose = () => {
    //paperMain.activate();
    //paper.install(paperMain)
    //paperMain.setup(document.getElementById('canvas-main') as HTMLCanvasElement);
  }

  return (
    <div
      className='c-animation-select-wrap'
      onClick={() => closeAnimationSelect()}
      style={{
        display: animationSelect.isOpen ? 'block' : 'none'
      }}>
      <Modal
        id='animation-select'
        className='c-animation-select'
        overlayClassName='c-animation-select__overlay'
        isOpen={animationSelect.isOpen}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onAfterOpen={handleAfterOpen}
        onRequestClose={() => closeAnimationSelect()}
        onAfterClose={handleOnClose}
        style={{
          content: {
            background: theme.background.z4,
            width: 200,
            height: (theme.unit * 8) * animationSelectOptions.length,
            top: animationSelect.y,
            left: animationSelect.x
          }
        }}
        contentLabel='select-animation'>
        {
          animationSelectOptions.map((option: string, index: number) => (
            <AnimationSelectItem
              key={index}
              onClick={handleClick}
              text={option} />
          ))
        }
      </Modal>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const animationSelect = layer.present.animationSelect;
  return { animationSelect };
};

export default connect(
  mapStateToProps,
  {
    closeAnimationSelect,
    openAnimationSelect
  }
)(AnimationSelect);