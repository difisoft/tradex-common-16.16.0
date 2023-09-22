export const removeDuplicateObj = (arr: any[], fieldName: any): any[] => {
  if (arr === null || arr === undefined || fieldName === null || fieldName === undefined) {
    return [];
  }
  return arr.map((value: any) => value[fieldName])

  // store the keys of the unique objects
    .map((currentValue: any, currentIndex: number, currentArr: any[]) => {
      if (currentArr.indexOf(currentValue) === currentIndex) {
        return currentIndex;
      } else {
        return -1;
      }
    })
    // map unique key -> object
    .filter((value: any) => value !== -1).map((value: any) => arr[value]);

}