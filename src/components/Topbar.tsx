import React, { ReactElement } from 'react';
import InsertButton from './InsertButton';
import MaskButton from './MaskButton';
import PreviewButton from './PreviewButton';
import UngroupButton from './UngroupButton';
import MoveBackwardButton from './MoveBackwardButton';
import GroupButton from './GroupButton';
import MoveForwardButton from './MoveForwardButton';
import ZoomButton from './ZoomButton';
import UniteButton from './UniteButton';
import SubtractButton from './SubtractButton';
import IntersectButton from './IntersectButton';
import ExcludeButton from './ExcludeButton';
import ViewButton from './ViewButton';
import ZoomOutButton from './ZoomOutButton';
import ZoomInButton from './ZoomInButton';

const Topbar = (): ReactElement => (
  <div className='c-topbar'>
    <div className='c-topbar__button-group'>
      <InsertButton />
    </div>
    <div className='c-topbar__button-group'>
      <UniteButton />
      <SubtractButton />
      <IntersectButton />
      <ExcludeButton />
    </div>
    <div className='c-topbar__button-group'>
      <MaskButton />
      <MoveForwardButton />
      <MoveBackwardButton />
      <GroupButton />
      <UngroupButton />
    </div>
    <div className='c-topbar__button-group'>
      <ZoomOutButton />
      <ZoomButton />
      <ZoomInButton />
      <ViewButton />
    </div>
    <div className='c-topbar__button-group'>
      <PreviewButton />
    </div>
  </div>
);

export default Topbar;