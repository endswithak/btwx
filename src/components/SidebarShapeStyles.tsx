import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionHead from './SidebarSectionHead';
import { RootState } from '../store/reducers';
import RoundedRadiusInput from './RoundedRadiusInput';
import PolygonSidesInput from './PolygonSidesInput';
import StarPointsInput from './StarPointsInput';

interface SidebarShapeStylesProps {
  selected?: string[];
  selectedType?: em.LayerType;
  selectedShapeType?: em.ShapeType;
}

const SidebarShapeStyles = (props: SidebarShapeStylesProps): ReactElement => {
  const { selected, selectedType, selectedShapeType } = props;
  return (
    selected.length === 1 && selectedType === 'Shape' && (selectedShapeType === 'Rounded' || selectedShapeType === 'Star' || selectedShapeType === 'Polygon')
    ? <SidebarSectionWrap bottomBorder whiteSpace>
        <SidebarSection>
          <SidebarSectionRow>
            <SidebarSectionHead text='shape' />
          </SidebarSectionRow>
          <SidebarSection>
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
              ? <StarPointsInput />
              : null
            }
          </SidebarSection>
        </SidebarSection>
      </SidebarSectionWrap>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedType = selected.length > 0 ? layer.present.byId[selected[0]].type : null;
  const selectedShapeType = selectedType === 'Shape' ? (layer.present.byId[selected[0]] as em.Shape).shapeType : null;
  return { selected, selectedType, selectedShapeType };
};

export default connect(
  mapStateToProps
)(SidebarShapeStyles);