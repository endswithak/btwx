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
  allRounded?: boolean;
  allPolygons?: boolean;
  allStars?: boolean;
  shapeStylesCollapsed?: boolean;
  expandShapeStyles?(): RightSidebarTypes;
  collapseShapeStyles?(): RightSidebarTypes;
}

const SidebarShapeStyles = (props: SidebarShapeStylesProps): ReactElement => {
  const { allRounded, allPolygons, allStars, shapeStylesCollapsed, expandShapeStyles, collapseShapeStyles } = props;

  const handleClick = () => {
    if (shapeStylesCollapsed) {
      expandShapeStyles();
    } else {
      collapseShapeStyles();
    }
  }

  return (
    allRounded || allPolygons || allStars
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={shapeStylesCollapsed}
        header='shape'>
        {
          allRounded
          ? <RoundedRadiusInput />
          : null
        }
        {
          allPolygons
          ? <PolygonSidesInput />
          : null
        }
        {
          allStars
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

const mapStateToProps = (state: RootState): {
  allRounded: boolean;
  allPolygons: boolean;
  allStars: boolean;
  shapeStylesCollapsed: boolean;
} => {
  const { layer, rightSidebar } = state;
  const selected = layer.present.selected;
  const allShapes = selected.every((id: string) => layer.present.byId[id].type === 'Shape');
  const allRounded = allShapes && selected.every((id: string) => (layer.present.byId[id] as em.Shape).shapeType === 'Rounded');
  const allPolygons = allShapes && selected.every((id: string) => (layer.present.byId[id] as em.Shape).shapeType === 'Polygon');
  const allStars = allShapes && selected.every((id: string) => (layer.present.byId[id] as em.Shape).shapeType === 'Star');
  const shapeStylesCollapsed = rightSidebar.shapeStylesCollapsed;
  return { allRounded, allPolygons, allStars, shapeStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandShapeStyles, collapseShapeStyles }
)(SidebarShapeStyles);