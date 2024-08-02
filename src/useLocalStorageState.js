import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  //'useState' function also accepts 'callback' function instead of just any value.
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    //We use 'JSON.parse' because,we store the data in form of string in localStorage.
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      //'localStorage' API is used here to store the data of 'value' state variable,which is present in every browser.
      //Here,we convert all the data into string ,because in localStorage,we store the data in form of string.
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
