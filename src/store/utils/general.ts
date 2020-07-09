export const insertItem = (array: string[], item: string, index: number): string[] => {
  const newArray = array.slice();
  newArray.splice(index, 0, item);
  return newArray;
}

export const removeItem = (array: string[], item: string): string[] => {
  return array.filter(id => id !== item);
}

export const addItem = (array: string[], item: string): string[] => {
  return [...array, item];
}

export const addItems = (array: string[], items: string[]): string[] => {
  return items.reduce((result, current) => {
    return addItem(result, current);
  }, array);
}

export const moveItem = (array: string[], index: number, newIndex: number) => {
  const newArray = [...array];
  newArray.splice(newIndex, 0, newArray.splice(index, 1)[0]);
  return newArray;
}

export const moveItemAbove = (array: string[], index: number, aboveIndex: number) => {
  return moveItem(array, index, index <= aboveIndex ? aboveIndex - 1 : aboveIndex);
}

export const moveItemBelow = (array: string[], index: number, belowIndex: number) => {
  return moveItem(array, index, index >= belowIndex ? belowIndex + 1 : belowIndex);
}