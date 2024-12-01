import { SortField } from "../types/SortField";
import { Station } from "../types/Station";

export const sortFieldToLabel = (field: SortField): string => {
  switch (field) {
    case SortField.Name:
      return "Name";
    case SortField.Reliability:
      return "Reliability";
    case SortField.Popularity:
      return "Popularity";
  }
};

export const sortFieldToAccessor = (field: SortField): keyof Station => {
  switch (field) {
    case SortField.Name:
      return "name";
    case SortField.Reliability:
      return "reliability";
    case SortField.Popularity:
      return "popularity";
    default:
      throw new Error(`Cannot sort stations by ${field}`);
  }
};
