import React, { ReactElement } from 'react';

interface SidebarSectionWrapProps {
  children: ReactElement | ReactElement[];
  bottomBorder?: boolean;
  whiteSpace?: boolean;
  bg?: boolean;
  style?: any;
}

const SidebarSectionWrap = ({
  children,
  bottomBorder,
  whiteSpace,
  style,
  bg
}: SidebarSectionWrapProps): ReactElement => (
  <div
    className={`c-sidebar-section-wrap${
      bottomBorder
      ? `${' '}c-sidebar-section-wrap--bottom-border`
      : ''
    }${
      whiteSpace
      ? `${' '}c-sidebar-section-wrap--white-space`
      : ''
    }${
      bg
      ? `${' '}c-sidebar-section-wrap--bg`
      : ''
    }`}
    style={style}>
    { children }
  </div>
);

export default SidebarSectionWrap;