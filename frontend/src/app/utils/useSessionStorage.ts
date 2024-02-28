import { useState, useEffect } from "react";

const useSessionStorage = <T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    let currentValue: T;

    try {
      currentValue = JSON.parse(
        sessionStorage.getItem(key) || String(defaultValue)
      ) as T;
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useSessionStorage;