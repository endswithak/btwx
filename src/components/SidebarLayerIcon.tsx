import React, { useContext, ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerIconProps {
  id: string;
  isDragGhost?: boolean;
}

const SidebarLayerIcon = (props: SidebarLayerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, isDragGhost } = props;
  const type = useSelector((state: RootState) => state.layer.present.byId[id].type);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id].selected);
  const isShape = useSelector((state: RootState) => state.layer.present.byId[id].type === 'Shape');
  const isMask = isShape && useSelector((state: RootState) => (state.layer.present.byId[id] as Btwx.Shape).mask);
  const isOpenShape = isShape && useSelector((state: RootState) => !(state.layer.present.byId[id] as Btwx.Shape).closed);

  useEffect(() => {
    console.log('LAYER ICON');
  }, []);

  return (
    <div
      className='c-sidebar-layer__icon'
      id={`${id}-icon`}>
      <Icon
        name={(() => {
          switch(type) {
            case 'Artboard':
              return 'artboard'
            case 'Group':
              return 'folder';
            case 'Shape':
              return 'shape';
            case 'Text':
              return 'text';
            case 'Image':
              return 'image';
          }
        })()}
        small={type === 'Shape'}
        shapeId={type === 'Shape' ? id : null}
        style={{
          fill: isOpenShape || isMask
          ? 'none'
          : isSelected && !isDragGhost
            ? theme.text.onPrimary
            : theme.text.lighter,
          stroke: isOpenShape || isMask
          ? isSelected && !isDragGhost
            ? theme.text.onPrimary
            : theme.text.lighter
          : 'none',
          strokeWidth: 1
        }} />
    </div>
  );
}

export default SidebarLayerIcon;