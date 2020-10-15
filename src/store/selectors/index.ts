import { createSelector } from 'reselect';
import { RootState } from '../reducers';

const getLayerChildren = (state: RootState, props: any) => state.layer.present.byId[props.layer].children;
const getPageChildren = (state: RootState) => state.layer.present.byId['page'].children;
const getLeftSidebarSearching = (state: RootState) => state.leftSidebar.searching;
const getLeftSidebarSearch = (state: RootState) => state.leftSidebar.search;

export const getLeftSidebarLayers = createSelector(
  [ getPageChildren, getLeftSidebarSearching, getLeftSidebarSearch ],
  (children, searching, search) => {
    let layers: string[];
    if (searching) {
      if (!search || search.replace(/\s/g, '').length === 0) {
        layers = [...children].reverse();
      } else {
        // layers = layer.present.allIds.reduce((result, current) => {
        //   if (layer.present.byId[current].name.toUpperCase().includes(leftSidebar.search.replace(/\s/g, '').toUpperCase()) && current !== 'page') {
        //     return [...result, current];
        //   } else {
        //     return [...result];
        //   }
        // }, []);
      }
    } else {
      layers = [...children].reverse();
    }
    return layers;
  }
);

export const makeReversedChildren = () => {
  return createSelector(
    [ getLayerChildren ],
    (children) => {
      return children ? [...children].reverse() : null;
    }
  );
};