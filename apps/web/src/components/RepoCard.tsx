import React from 'react';

interface RepoCardProps {
    name: string;
    description: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    lastPush: string;
}

export default function RepoCard({
    name,
    description,
    language,
    languageColor,
    stars,
    forks,
    lastPush,
}: RepoCardProps) {
    return (
        <div className="flex flex-col rounded-xl border border-git-border bg-git-card p-4 hover:border-git-muted transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-git-blue font-bold text-base hover:underline break-words break-all">
                    {name}
                </h3>
                <span className="rounded-full border border-git-border px-2 py-0.5 text-xs text-git-muted font-medium whitespace-nowrap">
                    Public
                </span>
            </div>

            <p className="text-sm text-git-muted mb-4 flex-1 line-clamp-2">
                {description}
            </p>

            <div className="flex items-center gap-4 text-xs text-git-muted mt-auto">
                <div className="flex items-center gap-1.5">
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: languageColor }}
                    />
                    <span>{language}</span>
                </div>

                {stars > 0 && (
                    <div className="flex items-center gap-1 hover:text-git-blue">
                        <svg aria-label="star" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                        </svg>
                        <span>{stars}</span>
                    </div>
                )}

                {forks > 0 && (
                    <div className="flex items-center gap-1 hover:text-git-blue">
                        <svg aria-label="fork" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878A2.25 2.25 0 1 1 12.5 8v1.25a2.25 2.25 0 0 1-2.25 2.25h-1.5v1.128a2.251 2.251 0 1 1-1.5 0V10.25H5.75A2.25 2.25 0 0 1 3.5 8V5.372a2.25 2.25 0 1 1 1.5 0ZM11 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-8 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm5.5 12a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"></path>
                        </svg>
                        <span>{forks}</span>
                    </div>
                )}

                <div>Updated {lastPush}</div>
            </div>
        </div>
    );
}
