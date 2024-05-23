import { Metadata } from "next";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
export const metadata: Metadata = {
  title: "NoteGenie ",
};

export default function Home() {
  const { userId } = auth();
  if (userId) redirect("/notes");
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="NoteGenie logo" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          NoteGenie Powered By AI
        </span>
      </div>
      <p className="max-w-prose text-center">
        An Intelligent Note-Taking App with Ai integrated, build with OpenAI,
        Pinecone, Next,js, Shadcn UI, Clark, and more
      </p>
      <Button asChild size="lg">
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}
