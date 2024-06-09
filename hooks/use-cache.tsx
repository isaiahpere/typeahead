"use client";
import React, { useEffect, useRef } from "react";

const getCurrentTimeStamp = () => Math.floor(Date.now() / 1000);

const useCache = (key: string, expirationInSeconds: any) => {
  const cache = useRef<any>({});

  useEffect(() => {
    let item = localStorage.getItem(key);
    if (item) {
      try {
        cache.current = JSON.parse(item);
      } catch (error) {
        console.log("FAILED TO PARSE CACHE");
      }
    }
  }, []);

  const setCache = (query: any, data: any) => {
    const timeStamp = getCurrentTimeStamp();
    cache.current[query] = { data, timeStamp };
    localStorage.setItem(key, JSON.stringify(cache.current));
  };

  const getCache = (query: any) => {
    const cacheData = cache?.current[query];
    if (cacheData) {
      const { data, timeStamp } = cacheData;
      if (getCurrentTimeStamp() - timeStamp < expirationInSeconds) {
        return data;
      } else {
        delete cache?.current[query];
        localStorage.setItem(key, JSON.stringify(cache?.current));
      }
    }
    return null;
  };

  return { setCache, getCache };
};

export default useCache;
