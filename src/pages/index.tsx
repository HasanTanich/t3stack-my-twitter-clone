import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>My Twitter Clone</title>
        <meta
          name="twitter clone made by Hasan Tanich"
          content="Twitter clone for learning purposes"
        />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-2xl font-bold text-white">Hello there</h1>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData && (
        <>
          <span className="text-2xl font-bold text-red-400">
            Logged in as {sessionData.user?.name}
          </span>
          <Image
            className="rounded-full"
            src={sessionData.user?.image || ""}
            alt="profile Image"
            width={100}
            height={100}
            quality={100}
          />
        </>
      )}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
