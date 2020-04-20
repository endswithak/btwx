import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';

interface SidebarSectionRowProps {
  children: ReactElement | ReactElement[];
  width?: number | string;
  alignItems?: string;
}

const SidebarSectionRow = (props: SidebarSectionRowProps): ReactElement => {
  return (
    <div
      className='c-sidebar-section__row'
      style={{
        width: props.width,
        alignItems: props.alignItems
      }}>
      { props.children }
    </div>
  );
}

export default SidebarSectionRow;