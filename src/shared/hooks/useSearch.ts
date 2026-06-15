import { useState, useMemo } from "react";

export const useSearch = <T extends Record<string, any>>(
  data: T[],
  keys: (keyof T)[],
) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const lower = query.toLowerCase();
    return data.filter((item) =>
      keys.some((key) => {
        const val = item[key];
        return val !== null && val !== undefined
          ? String(val).toLowerCase().includes(lower)
          : false;
      }),
    );
  }, [query, data, keys]);

  return { query, setQuery, filtered };
};
