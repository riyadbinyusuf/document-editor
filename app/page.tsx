import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex  w-full max-w-3xl items-center justify-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href={"/projects/document-project-v1"}
          >
            Open Visual Builder
          </Link>
        </div>
      </main>
    </div>
  );
}
