"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";

export function SearchBar({
  placeholder = "Search vendors, services or categories…",
  showButton = true,
  defaultValue = "",
  className,
}: {
  placeholder?: string;
  showButton?: boolean;
  defaultValue?: string;
  className?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
  }

  return (
    <form className={`rdf-search${className ? ` ${className}` : ""}`} onSubmit={submit} role="search">
      <span className="rdf-search__icon">
        <Icon name="search" size={20} />
      </span>
      <input
        className="rdf-search__input"
        type="search"
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search"
      />
      {showButton && (
        <button className="rdf-search__btn" type="submit" aria-label="Search">
          <Icon name="arrowRight" size={18} />
        </button>
      )}
    </form>
  );
}

export default SearchBar;
