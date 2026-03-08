import { signIn } from "@/lib/auth"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-git-bg px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl border border-git-border bg-git-card p-10 shadow-xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-git-text font-mono">
                        GitPulse<span className="text-git-green">.</span>
                    </h2>
                    <p className="mt-2 text-sm text-git-muted">
                        GitHub&apos;s Social Layer.
                    </p>
                </div>

                <div className="mt-8">
                    <form
                        action={async () => {
                            "use server"
                            await signIn("github", { redirectTo: "/" })
                        }}
                    >
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-git-green px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2ea043] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors"
                        >
                            Sign in with GitHub
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-git-muted">
                        By signing in, you agree that GitPulse will request read-only access to your public repositories.
                    </p>
                </div>
            </div>
        </div>
    )
}
