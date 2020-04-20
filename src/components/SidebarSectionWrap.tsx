import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';

interface SidebarSectionWrapProps {
  children: ReactElement | ReactElement[];
}

const SidebarSectionWrap = (props: SidebarSectionWrapProps): ReactElement => {
  return (
    <div className='c-sidebar-section-wrap'>
      { props.children }
    </div>
  );
}

export default SidebarSectionWrap;