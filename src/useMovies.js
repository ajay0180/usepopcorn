import { useState, useEffect } from "react";

const KEY = "51ffcf9c";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    //effect calback function is synchronous to avoid race condition. So,we made effect callback function as async function inside an arrow function.
    function () {
      //1. Declaring a variable for 'abort controller' Web API.
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          //  "Side-effect"  //
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            //2. This is the second arguments passed in 'fetch' API as an abort controller object.
            { signal: controller.signal }
          );

          //This happens when we are unable to send request due to network issue or some internal issue.
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies! ");

          const data = await res.json();
          // console.log(data);

          //This happens when we send wrong query.
          if (data.Response === "False") throw new Error("Movie not found.");

          setMovies(data.Search);
          // console.log(data.Search);

          return () => console.log("cleanup");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }

        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }
      }

      // handleCloseMovie();
      fetchMovies();

      //'Cleanup' function
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
