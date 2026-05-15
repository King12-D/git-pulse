"use client";

export default function ExploreSearchInput() {
  return (
    <form action="/search" method="GET" className="relative group w-full">
      <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-git-muted group-focus-within:text-git-accent transition-colors">
        <path d="M10.25 2.75a7.5 7.5 0 1 0 5.105 12.984l5.242 5.243a.748.748 0 0 0 1.058-1.058l-5.243-5.242A7.5 7.5 0 1 0 10.25 2.75Zm-6 7.5a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z"></path>
      </svg>
      <input
        type="text"
        name="q"
        placeholder="Search posts, users, and repos..."
        className="w-full bg-git-card border border-git-border rounded-full py-2 pl-10 pr-4 text-[14px] text-git-text placeholder:text-git-muted outline-none focus:border-git-accent focus:bg-git-bg transition-colors"
        onChange={(e) => {
          const inputValue = e.target.value;
          if (inputValue) {
            const sanitizedInput = inputValue
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .trim();
            e.target.value = sanitizedInput;
          }
        }}
      />
    </form>
  );
}
