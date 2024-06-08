"use client";
import React, { useCallback, useEffect, useState } from "react";

import SuggestionsList from "./suggestions-list";
import debounce from "lodash/debounce";

interface IProps {
  placeholder: any;
  staticData?: any;
  fetchSuggestions: any;
  dataKey: any;
  customLoading: any;
  onSelect: (res: any) => void;
  onChange: (input: any) => void;
  onBlur: (e: any) => void;
  onFocus: (e: any) => void;
  customStyles?: any;
}

const Autocomplete = ({
  placeholder,
  staticData,
  fetchSuggestions,
  dataKey,
  customLoading = "Loading...",
  onSelect,
  onChange,
  onBlur,
  onFocus,
  customStyles,
}: IProps) => {
  const [inputValue, setInputvalue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: any) => {
    setInputvalue(e.target.value);
    onChange(e.target.avlue);
  };

  const getSuggestions = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      let results;
      if (staticData) {
        results = staticData.filter((item: any) => {
          return item.toLowerCase().includes(query.toLocaleLowerCase());
        });
      } else if (fetchSuggestions) {
        results = await fetchSuggestions(query);
      }
      setSuggestions(results);
    } catch (error) {
      setError("Failed to Fetch Suggestions");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestionsDebounced = useCallback(
    debounce(getSuggestions, 300),
    []
  );

  useEffect(() => {
    if (inputValue.length > 1) {
      getSuggestionsDebounced(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleSuggestionClick = (suggestion: any) => {
    setInputvalue(dataKey ? suggestion[dataKey] : suggestion);
    onSelect(suggestion);
    setSuggestions([]);
  };

  console.log(suggestions[0]);

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
        className="w-full py-1 border-2 border-slate-500 rounded-md pl-2"
      />

      {((suggestions.length > 0 && suggestions[0].name !== inputValue) ||
        loading ||
        error) && (
        <ul
          data-name="suggestion-list"
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
            onSuggestionClick={handleSuggestionClick}
          />
        </ul>
      )}
    </section>
  );
};

export default Autocomplete;
