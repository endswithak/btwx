import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import RoundedRadiusInput from './RoundedRadiusInput';
import PolygonSidesInput from './PolygonSidesInput';
import StarPointsInput from './StarPointsInput';
import StarRadiusInput from './StarRadiusInput';
import LineFromInput from './LineFromInput';
import LineToInput from './LineToInput';
import SidebarCollapseSection from './SidebarCollapseSection';
import { RightSidebarTypes } from '../store/actionTypes/rightSidebar';
import { expandShapeStyles, collapseShapeStyles } from '../store/actions/rightSidebar';

interface SidebarShapeStylesProps {
  isEnabled?: boolean;
  allRounded?: boolean;
  allPolygons?: boolean;
  allStars?: boolean;
  allLines?: boolean;
  header?: string;
  shapeStylesCollapsed?: boolean;
  expandShapeStyles?(): RightSidebarTypes;
  collapseShapeStyles?(): RightSidebarTypes;
}

const SidebarShapeStyles = (props: SidebarShapeStylesProps): ReactElement => {
  const { isEnabled, allRounded, allPolygons, allStars, allLines, shapeStylesCollapsed, header, expandShapeStyles, collapseShapeStyles } = props;

  const handleClick = () => {
    if (shapeStylesCollapsed) {
      expandShapeStyles();
    } else {
      collapseShapeStyles();
    }
  }

  return (
    isEnabled
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={shapeStylesCollapsed}
        header={header}>
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
          allLines
          ? <>
              <LineFromInput />
              <LineToInput />
            </>
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
  allLines: boolean;
  isEnabled: boolean;
  header: string;
} => {
  const { layer, rightSidebar } = state;
  const selected = layer.present.selected;
  const allShapes = selected.every((id: string) => layer.present.byId[id].type === 'Shape');
  const allRounded = allShapes && selected.every((id: string) => (layer.present.byId[id] as Btwx.Shape).shapeType === 'Rounded');
  const allPolygons = allShapes && selected.every((id: string) => (layer.present.byId[id] as Btwx.Shape).shapeType === 'Polygon');
  const allStars = allShapes && selected.every((id: string) => (layer.present.byId[id] as Btwx.Shape).shapeType === 'Star');
  const allLines = allShapes && selected.every((id: string) => (layer.present.byId[id] as Btwx.Shape).shapeType === 'Line');
  const header = (() => {
    if (allRounded) {
      return 'rounded';
    } else if (allPolygons) {
      return 'polygon';
    } else if (allStars) {
      return 'star';
    } else if (allLines) {
      return 'line';
    }
  })();
  const isEnabled = allRounded || allPolygons || allStars || allLines;
  const shapeStylesCollapsed = rightSidebar.shapeStylesCollapsed;
  return { isEnabled, allRounded, allPolygons, allStars, allLines, header, shapeStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandShapeStyles, collapseShapeStyles }
)(SidebarShapeStyles);