import { useState, useMemo } from 'react';

export const useLocalSearch = <T extends {}>(
  items: T[],
  fieldsToSearch?: Array<keyof T>
) => {
  const [term, setTerm] = useState('');
  const cleanedTerm = term.toLowerCase().trim();

  const indexed = useMemo(
    () =>
      items.map((item) => {
        let res = {};

        if (fieldsToSearch) {
          res = fieldsToSearch.reduce<any>((acc, fieldName) => {
            acc[fieldName] = item[fieldName];
            return acc;
          }, {});
        } else {
          res = item;
        }

        return JSON.stringify(res).toLowerCase();
      }),
    [items]
  );

  const filtered = cleanedTerm
    ? items.filter((val, index) => indexed[index].includes(cleanedTerm))
    : items;

  return {
    items: filtered,
    term,
    setTerm,
    reset: () => setTerm('')
  };
};
