"use client";
import Autocomplete from "@/components/autocomplete";

const staticData = [
  "apple",
  "banana",
  "berrl",
  "orange",
  "grape",
  "mango",
  "melon",
  "berry",
  "peach",
  "cherry",
  "plum",
];

export default function Home() {
  const fetchSuggestions = async (query: any) => {
    try {
      let res = await fetch(`https://dummyjson.com/recipe/search?q=${query}`);
      if (!res.ok) throw new Error("Failed to Fetch Query Suggestions");
      let data = await res.json();
      return data.recipes;
    } catch (error) {
      console.log("ERROR_FETCHING_SUGGESTIONS", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 gap-6">
      <h1 className="text-4xl font-bold">Custom Typeahead</h1>
      <Autocomplete
        caching
        placeholder={"Enter Recipe"}
        // staticData={staticData}
        fetchSuggestions={fetchSuggestions}
        dataKey={"name"}
        customLoading={<>Loading Recipes...</>}
        onSelect={(res) => {
          console.log(res);
        }}
        onChange={(input) => {}}
        onBlur={(e) => {}}
        onFocus={(e) => {}}
      />
    </main>
  );
}
