"use client";
import React, { useEffect, useState } from "react";

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
  customLoading,
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

  console.log(suggestions);

  useEffect(() => {
    if (inputValue.length > 1) {
      getSuggestions(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  return (
    <section data-name="container">
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        // style={customStyles}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={handleInputChange}
        className="border-2 border-slate-500"
      />
    </section>
  );
};

export default Autocomplete;
