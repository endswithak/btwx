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