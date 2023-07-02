"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import useBoardStore from "@/store/BoardStore";
import useDebounce from "@/hooks/useDebounce";
import fetchSuggestion from "@/utils/fetchSuggestion";

import logo from "/public/logo.svg";

const Header = () => {
  const [board, setSearchTerm] = useBoardStore((state) => [
    state.board,
    state.setSearchTerm,
  ]);

  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (board.columns.size === 0) return;
    setIsLoading(true);

    const fetchSuggestionFn = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setIsLoading(false);
    };

    fetchSuggestionFn();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-400/10 rounded-b-2xl">
        <div
          className="
            absolute 
            top-0
            left-0
            w-full
            h-96
            md:h-[480px]
            bg-gradient-to-r from-green-300 via-blue-500 to-purple-600
            rounded-md
            filter
            blur-3xl
            opacity-50
            -z-50"
        ></div>

        <Image
          src={logo}
          alt="Logo"
          width={200}
          height={75}
          className="
            w-44 h-32 md:h-16 md:w-56 mb-10 md:mb-0 object-contain flex-0 rounded-md"
        />

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/* Search Box */}
          <form
            className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md
            flex-1 md:flex-initial"
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/* Avatar */}
          <Avatar name="New Admin" round color="#3160a7" size="50" />
        </div>
      </div>
      <div className="flex items-center justify-center p-2 md:py-5">
        <p className="flex items-center p-5 text-sm font-light shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#3160a7]">
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#3160a7] mr-1 ${
              isLoading && "animate-spin"
            }`}
          />
          {suggestion && !isLoading
            ? suggestion
            : "GPT is summarizing your tasks for the day ..."}
        </p>
      </div>
    </header>
  );
};

export default Header;
