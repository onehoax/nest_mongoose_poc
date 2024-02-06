export function getIsDeleted(flag: boolean): { isDeleted: boolean } {
  return {
    isDeleted: flag,
  };
}

export const defaultFilter = getIsDeleted(false);
