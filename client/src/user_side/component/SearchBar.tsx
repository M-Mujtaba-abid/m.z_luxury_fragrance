

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// interface SearchBarProps {
//   closeSearch?: () => void; // 👈 make it optional if you want
// }

// const SearchBar: React.FC<SearchBarProps> = ({ closeSearch }) => {
//   const [query, setQuery] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     // Navigate to search results page with query param
//     navigate(`/web/search?q=${encodeURIComponent(query.trim())}`);
//     // 🔹 if closeSearch exists, call it after submit
//     if (closeSearch) closeSearch();
//   };

//   return (
//     <form onSubmit={handleSubmit} onMouseDown={(e) => e.stopPropagation()} className="flex items-center gap-2 p-2">
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search..."
//         className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
//       />
//       <button
//         type="submit"
//         className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
//       >
//         Search
//       </button>
//     </form>
//   );
// };

// export default SearchBar;


import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  closeSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ closeSearch }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on input when search bar opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/web/search?q=${encodeURIComponent(query.trim())}`);
    if (closeSearch) closeSearch();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center gap-2 p-2"
      onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
    >
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
      />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;