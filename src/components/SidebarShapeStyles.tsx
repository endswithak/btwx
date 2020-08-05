import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import RoundedRadiusInput from './RoundedRadiusInput';
import PolygonSidesInput from './PolygonSidesInput';
import StarPointsInput from './StarPointsInput';
import StarRadiusInput from './StarRadiusInput';
import SidebarCollapseSection from './SidebarCollapseSection';
import { RightSidebarTypes } from '../store/actionTypes/rightSidebar';
import { expandShapeStyles, collapseShapeStyles } from '../store/actions/rightSidebar';

interface SidebarShapeStylesProps {
  selected?: string[];
  selectedType?: em.LayerType;
  selectedShapeType?: em.ShapeType;
  shapeStylesCollapsed?: boolean;
  expandShapeStyles?(): RightSidebarTypes;
  collapseShapeStyles?(): RightSidebarTypes;
}

const SidebarShapeStyles = (props: SidebarShapeStylesProps): ReactElement => {
  const { selected, selectedType, selectedShapeType, shapeStylesCollapsed, expandShapeStyles, collapseShapeStyles } = props;

  const handleClick = () => {
    if (shapeStylesCollapsed) {
      expandShapeStyles();
    } else {
      collapseShapeStyles();
    }
  }

  return (
    selected.length === 1 && selectedType === 'Shape' && (selectedShapeType === 'Rounded' || selectedShapeType === 'Star' || selectedShapeType === 'Polygon')
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={shapeStylesCollapsed}
        header='shape'>
        {
          selectedShapeType === 'Rounded'
          ? <RoundedRadiusInput />
          : null
        }
        {
          selectedShapeType === 'Polygon'
          ? <PolygonSidesInput />
          : null
        }
        {
          selectedShapeType === 'Star'
          ? <>
              <StarPointsInput />
              <StarRadiusInput />
            </>
          : null
        }
      </SidebarCollapseSection>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, rightSidebar } = state;
  const selected = layer.present.selected;
  const selectedType = selected.length > 0 ? layer.present.byId[selected[0]].type : null;
  const selectedShapeType = selectedType === 'Shape' ? (layer.present.byId[selected[0]] as em.Shape).shapeType : null;
  const shapeStylesCollapsed = rightSidebar.shapeStylesCollapsed;
  return { selected, selectedType, selectedShapeType, shapeStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandShapeStyles, collapseShapeStyles }
)(SidebarShapeStyles);