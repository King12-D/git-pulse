import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import ContributionHeatmap from "@/components/ContributionHeatmap"
import RepoCard from "@/components/RepoCard"

// In v1, profile page is generated from GitHub data
export default async function ProfilePage({ params }: { params: { username: string } }) {
    const session = await auth()

    // Note: we'll fetch real user data from our DB / GitHub API later
    // For now, we mock it out to build the UI skeleton
    const isOwnProfile = session?.user?.name === params.username || (!session?.user?.name && params.username === 'me');

    const mockUser = {
        username: params.username,
        name: "Developer Name",
        bio: "Fullstack developer building open source tools.",
        followers: 124,
        following: 42,
        avatar: "https://github.com/identicons/gitpulse.png", // fallback placeholder
        isActive: true
    }

    return (
        <div className="flex flex-col gap-8">

            {/* Profile Header section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                    <img
                        src={session?.user?.image || mockUser.avatar}
                        alt={mockUser.username}
                        className="w-24 h-24 rounded-full border border-git-border bg-git-bg"
                    />
                    {mockUser.isActive && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-git-green border-[3px] border-git-card rounded-full" title="Active Contributor" />
                    )}
                </div>

                <div className="flex flex-col flex-1">
                    <h1 className="text-2xl font-bold text-git-text">{session?.user?.name || mockUser.name}</h1>
                    <h2 className="text-xl font-mono text-git-muted">@{mockUser.username}</h2>
                    <p className="mt-2 text-sm text-git-text max-w-md">{mockUser.bio}</p>

                    <div className="mt-3 flex items-center gap-4 text-sm text-git-muted">
                        <span className="hover:text-git-blue cursor-pointer">
                            <strong className="text-git-text">{mockUser.followers}</strong> followers
                        </span>
                        <span>·</span>
                        <span className="hover:text-git-blue cursor-pointer">
                            <strong className="text-git-text">{mockUser.following}</strong> following
                        </span>
                    </div>
                </div>

                {!isOwnProfile && (
                    <button className="hidden sm:block rounded-md bg-transparent border border-git-border px-4 py-1.5 text-sm font-medium text-git-text hover:bg-git-border transition-colors">
                        Follow
                    </button>
                )}
            </div>

            {mockUser.isActive && !isOwnProfile && (
                <button className="sm:hidden w-full rounded-md bg-transparent border border-git-border px-4 py-1.5 text-sm font-medium text-git-text hover:bg-git-border transition-colors">
                    Follow
                </button>
            )}

            {/* Contribution Heatmap Banner */}
            <div>
                <ContributionHeatmap />
            </div>

            {/* Repositories */}
            <div>
                <div className="flex items-center justify-between mb-4 border-b border-git-border pb-2">
                    <h2 className="text-lg font-semibold text-git-text">Pinned Repositories</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RepoCard
                        name={`${mockUser.username}/gitpulse`}
                        description="GitHub's Social Layer. The algorithmic feed for developers."
                        language="TypeScript"
                        languageColor="#3178c6"
                        stars={128}
                        forks={12}
                        lastPush="2 days ago"
                    />
                    <RepoCard
                        name={`${mockUser.username}/dotfiles`}
                        description="My personal dotfiles for macOS and Arch Linux."
                        language="Shell"
                        languageColor="#89e051"
                        stars={4}
                        forks={0}
                        lastPush="last week"
                    />
                    <RepoCard
                        name={`${mockUser.username}/react-component-lib`}
                        description="A collection of accessible React components built with Radix UI."
                        language="TypeScript"
                        languageColor="#3178c6"
                        stars={45}
                        forks={8}
                        lastPush="yesterday"
                    />
                </div>
            </div>
        </div>
    )
}
