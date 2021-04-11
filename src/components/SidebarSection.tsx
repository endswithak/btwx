import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';

interface SidebarSectionProps {
  children: ReactElement | ReactElement[];
}

const SidebarSection = (props: SidebarSectionProps): ReactElement => {
  return (
    <div className='c-sidebar-section'>
      { props.children }
    </div>
  );
}

export default SidebarSection;