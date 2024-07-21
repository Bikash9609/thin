import { set, transform } from 'lodash';

export function convertToNestedObject(data: Record<any, any>) {
  return transform(
    data,
    (result, value, key) => {
      set(result, key, value);
    },
    {},
  );
}
