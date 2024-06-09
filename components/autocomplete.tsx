"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

import SuggestionsList from "./suggestions-list";
import debounce from "lodash/debounce";
import useCache from "@/hooks/use-cache";

interface IProps {
  placeholder: any;
  staticData?: any;
  fetchSuggestions: any;
  dataKey: any;
  customLoading: any;
  caching: boolean;
  onSelect: (res: any) => void;
  onChange: (input: any) => void;
  onBlur: (e: any) => void;
  onFocus: (e: any) => void;
}

const Autocomplete = ({
  placeholder,
  staticData,
  fetchSuggestions,
  dataKey,
  customLoading = "Loading...",
  caching = true,
  onSelect,
  onChange,
  onBlur,
  onFocus,
}: IProps) => {
  const [inputValue, setInputvalue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionListRef = useRef<any>(null);

  // cache hook
  const { setCache, getCache } = useCache("autocomplete", 3600);

  // update input value
  const handleInputChange = (e: any) => {
    setInputvalue(e.target.value);
    onChange(e.target.avlue); // not doing anything currently
  };

  // fetch dynamic suggestions from API or get static suggestions
  const getSuggestions = async (query: string) => {
    setLoading(true);
    setError("");
    const cachedSuggestions = getCache(query);
    if (cachedSuggestions && caching) {
      setSuggestions(cachedSuggestions);
      console.log("CACHED DATA HIT");
      setLoading(false);
    } else {
      try {
        let results;
        if (staticData) {
          results = staticData.filter((item: any) => {
            console.log("STATIC DATA HIT");
            return item.toLowerCase().includes(query.toLocaleLowerCase());
          });
        } else if (fetchSuggestions) {
          results = await fetchSuggestions(query);
          console.log("API DATA HIT");
        }
        setCache(query, results);
        setSuggestions(results);
      } catch (error) {
        setError("Failed to Fetch Suggestions");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }
  };
  // LOADDASH DEBOUNCER
  const getSuggestionsDebounced = useCallback(
    debounce(getSuggestions, 300),
    []
  );

  // update the suggestion when input changes
  useEffect(() => {
    setSelectedIndex(-1);
    if (inputValue.length > 1) {
      getSuggestionsDebounced(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const scrollIntoView = (index: any) => {
    if (suggestionListRef.current) {
      const suggestionItem =
        suggestionListRef.current.getElementsByTagName("li");
      if (suggestionItem[index]) {
        suggestionItem[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  };

  // when suggestion clicked update input value to clicked suggestion
  const handleSuggestionClick = (suggestion: any) => {
    setInputvalue(dataKey ? suggestion[dataKey] : suggestion);
    onSelect(suggestion);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        setSelectedIndex((prev) => {
          const updatedIndex = (prev + 1) % suggestions.length;
          scrollIntoView(updatedIndex);
          return updatedIndex;
        });
        break;
      case "ArrowUp":
        setSelectedIndex((prev) => {
          const updatedIndex =
            (prev - 1 + suggestions.length) % suggestions.length;
          scrollIntoView(updatedIndex);
          return updatedIndex;
        });
        break;
      case "Enter":
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      default:
        break;
    }
  };

  return (
    <section
      data-name="container"
      className="relative w-[300px] flex flex-col items-center justify-center gap-4"
    >
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        // style={customStyles}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full py-1 border-2 border-slate-500 rounded-md pl-2"
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        aria-activedescendant={`suggestion-${selectedIndex}`}
      />

      {((suggestions.length > 0 && suggestions[0].name !== inputValue) ||
        loading ||
        error) && (
        <ul
          ref={suggestionListRef}
          role="listbox"
          id="suggestions-list"
          className="absolute left-0 top-9 right-0 w-full borer border-slate-800 border-t-0 rounded-md rounded-tl-none rounded-tr-none shadow-lg z-10 max-h-40 overflow-y-auto m-0 p-0 "
        >
          {error && (
            <div data-name="error" className="p-2.5 text-[14px] text-red-600">
              {error}
            </div>
          )}
          {loading && (
            <div data-name="loading" className="p-2.5 text-lg text-[#555]">
              {customLoading}
            </div>
          )}
          <SuggestionsList
            dataKey={dataKey}
            highlight={inputValue}
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            onSuggestionClick={handleSuggestionClick}
          />
        </ul>
      )}
    </section>
  );
};

export default Autocomplete;
