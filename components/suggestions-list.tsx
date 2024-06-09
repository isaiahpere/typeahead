import React from "react";

interface IProps {
  suggestions: any[];
  highlight: any;
  dataKey: any;
  onSuggestionClick: any;
}
const SuggestionsList = ({
  suggestions,
  highlight,
  dataKey,
  onSuggestionClick,
}: IProps) => {
  // highlights the keywords currently in input value
  // then puts the backtogether with highlighted keyword in color
  const getHighlightedText = (text?: any, highlight?: any) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));

    return (
      <span>
        {parts.map((part: string, index: string | any) => {
          // console.log("PART", part);
          return part.toLocaleLowerCase() === highlight.toLowerCase() ? (
            <b key={index}>{part}</b>
          ) : (
            part
          );
        })}
      </span>
    );
  };

  return (
    <>
      {suggestions.map((suggestion: any, index: any) => {
        // if api response take api with key --> else take static suggestions
        const currentSuggestion = dataKey ? suggestion[dataKey] : suggestion;
        return (
          <li
            key={index}
            onClick={() => {
              onSuggestionClick(suggestion);
            }}
            className="p-2.5 cursor-pointer hover:bg-[#f0f0f0]"
          >
            {getHighlightedText(currentSuggestion, highlight)}
          </li>
        );
      })}
    </>
  );
};

export default SuggestionsList;
