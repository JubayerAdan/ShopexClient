"use client";
import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";

interface FetchOptions {
  url: string;
  method: "get" | "post" | "patch" | "delete";
  body?: any; // Optional body for POST, PATCH, DELETE requests
  config?: AxiosRequestConfig; // Optional additional Axios config
}

function usePublicFetcher(
  p0: string,
  p1: string,
  { url, method, body, config }: FetchOptions
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;

        switch (method) {
          case "get":
            response = await axios.get(url, config);
            break;
          case "post":
            response = await axios.post(url, body, config);
            break;
          case "patch":
            response = await axios.patch(url, body, config);
            break;
          case "delete":
            response = await axios.delete(url, config);
            break;
          default:
            throw new Error("Unsupported method");
        }

        setData(response.data);
      } catch (err) {
        setError(`Fetch failed: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, method, body, config]);

  return { data, loading, error };
}

export default usePublicFetcher;
