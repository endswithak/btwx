import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandShapeStyles, collapseShapeStyles } from '../store/actions/rightSidebar';
import RoundedRadiusInput from './RoundedRadiusInput';
import PolygonSidesInput from './PolygonSidesInput';
import StarPointsInput from './StarPointsInput';
import StarRadiusInput from './StarRadiusInput';
import LineFromInput from './LineFromInput';
import LineToInput from './LineToInput';
import SidebarCollapseSection from './SidebarCollapseSection';

const SidebarShapeStyles = (): ReactElement => {
  const shapeStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.shapeStylesCollapsed);
  const allRounded = useSelector((state: RootState) => state.layer.present.selected.every((id: string) => state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Rounded'));
  const allPolygons = useSelector((state: RootState) => state.layer.present.selected.every((id: string) => state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Polygon'));
  const allStars = useSelector((state: RootState) => state.layer.present.selected.every((id: string) => state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Star'));
  const allLines = useSelector((state: RootState) => state.layer.present.selected.every((id: string) => state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Line'));
  const isEnabled = allRounded || allPolygons || allStars || allLines;
  const dispatch = useDispatch();

  const handleClick = () => {
    if (shapeStylesCollapsed) {
      dispatch(expandShapeStyles());
    } else {
      dispatch(collapseShapeStyles());
    }
  }

  return (
    isEnabled
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={shapeStylesCollapsed}
        header={(() => {
          if (allRounded) {
            return 'rounded';
          } else if (allPolygons) {
            return 'polygon';
          } else if (allStars) {
            return 'star';
          } else if (allLines) {
            return 'line';
          }
        })()}>
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

export default SidebarShapeStyles;