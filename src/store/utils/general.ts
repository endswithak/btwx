export const insertItem = (array: any[], item: any, index: number): any[] => {
  const newArray = array.slice();
  newArray.splice(index, 0, item);
  return newArray;
};

export const removeItem = (array: any[], item: any): any[] => {
  return array.filter(id => id !== item);
};

export const removeItems = (array: any[], items: any[]): any[] => {
  return array.filter(id => !items.includes(id));
};

export const addItem = (array: any[], item: any): any[] => {
  return [...array, item];
};

export const addItems = (array: any[], items: any[]): any[] => {
  return items.reduce((result, current) => {
    return addItem(result, current);
  }, array);
};

export const moveItem = (array: any[], index: number, newIndex: number): any[] => {
  const newArray = [...array];
  newArray.splice(newIndex, 0, newArray.splice(index, 1)[0]);
  return newArray;
};

export const moveItemAbove = (array: any[], index: number, aboveIndex: number): any[] => {
  return moveItem(array, index, index <= aboveIndex ? aboveIndex - 1 : aboveIndex);
};

export const moveItemBelow = (array: any[], index: number, belowIndex: number): any[] => {
  return moveItem(array, index, index >= belowIndex ? belowIndex + 1 : belowIndex);
};