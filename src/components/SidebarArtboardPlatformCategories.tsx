import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardToolDevicePlatform } from '../store/actions/tool';
import { SetArtboardToolDevicePlatformPayload, ToolTypes } from '../store/actionTypes/tool';
import SidebarArtboardPlatformCategory from './SidebarArtboardPlatformCategory';
import { DEVICES } from '../constants';

interface SidebarArtboardPlatformCategoriesProps {
  categories?: em.DeviceCategory[];
}

const SidebarArtboardPlatformCategories = (props: SidebarArtboardPlatformCategoriesProps): ReactElement => {
  const { categories } = props;

  return (
    <>
      {
        categories.map((category, index) => (
          <SidebarArtboardPlatformCategory
            key={index}
            category={category} />
        ))
      }
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { tool } = state;
  const platformValue = tool.artboardToolDevicePlatform;
  const categories = DEVICES.find((platform) => platform.type === platformValue).categories;
  return { categories };
};

export default connect(
  mapStateToProps,
  { setArtboardToolDevicePlatform }
)(SidebarArtboardPlatformCategories);