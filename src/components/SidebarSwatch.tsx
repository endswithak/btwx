import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';

interface SidebarSwatchProps {
  color?: string;
  //blendMode: number | FileFormat.BlendMode;
}

const SidebarSwatch = (props: SidebarSwatchProps): ReactElement => {
  return (
    <div className='c-sidebar-swatch'>
      <div className='c-sidebar-swatch__inner'>
        <div
          className='c-sidebar-swatch__color'
          style={{background: props.color}} />
        {/* <SidebarSwatchBlendMode
          blendMode={blendMode} /> */}
      </div>
    </div>
  );
}

export default SidebarSwatch;