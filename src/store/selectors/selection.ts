import paper from 'paper';
import { SelectionState } from '../reducers/selection';

export const isSelected = (state: SelectionState, id: string) => {
  return state.includes(id);
}