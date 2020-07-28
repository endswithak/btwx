import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import InsertButton from './InsertButton';
import MaskButton from './MaskButton';
import PreviewButton from './PreviewButton';
import UngroupButton from './UngroupButton';
import MoveBackwardButton from './MoveBackwardButton';
import TweensButton from './TweensButton';
import GroupButton from './GroupButton';
import MoveForwardButton from './MoveForwardButton';
import ZoomButton from './ZoomButton';
import UniteButton from './UniteButton';
import SubtractButton from './SubtractButton';
import IntersectButton from './IntersectButton';
import ExcludeButton from './ExcludeButton';

const Topbar = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div
      className='c-topbar'
      style={{
        background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
        boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <div className='c-topbar__button-group'>
        <InsertButton />
      </div>
      <div className='c-topbar__button-group'>
        <ZoomButton />
      </div>
      <div className='c-topbar__button-group'>
        <MaskButton />
        <MoveForwardButton />
        <MoveBackwardButton />
        <GroupButton />
        <UngroupButton />
      </div>
      <div className='c-topbar__button-group'>
        <UniteButton />
        <SubtractButton />
        <IntersectButton />
        <ExcludeButton />
      </div>
      <div className='c-topbar__button-group'>
        <TweensButton />
        <PreviewButton />
      </div>
    </div>
  );
}

export default Topbar;