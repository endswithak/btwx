import { createSelector } from 'reselect';
import { RootState } from '../reducers';

const getAllLayerIds = (state: RootState) => state.layer.present.allIds;
const getSelected = (state: RootState) => state.layer.present.selected;
const getLayersById = (state: RootState) => state.layer.present.byId;
const getLayerChildren = (state: RootState, props: any) => state.layer.present.byId[props.layer].children;
const getPageChildren = (state: RootState) => state.layer.present.byId['page'].children;
const getLeftSidebarSearching = (state: RootState) => state.leftSidebar.searching;
const getLeftSidebarSearch = (state: RootState) => state.leftSidebar.search;

export const getLeftSidebarLayers = createSelector(
  [ getPageChildren, getLeftSidebarSearching, getLeftSidebarSearch, getAllLayerIds, getLayersById ],
  (children, searching, search, allLayerIds, byId) => {
    let layers: string[];
    if (searching) {
      if (!search || search.replace(/\s/g, '').length === 0) {
        layers = [...children].reverse();
      } else {
        layers = allLayerIds.reduce((result, current) => {
          if (byId[current].name.toUpperCase().includes(search.replace(/\s/g, '').toUpperCase()) && current !== 'page') {
            return [...result, current];
          } else {
            return [...result];
          }
        }, []);
      }
    } else {
      layers = [...children].reverse();
    }
    return layers;
  }
);

export const getSelectedById = createSelector(
  [ getSelected, getLayersById ],
  (selected, byId) => {
    return selected.reduce((result, current) => {
      result = {
        ...result,
        [current]: byId[current]
      }
      return result;
    }, {});
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