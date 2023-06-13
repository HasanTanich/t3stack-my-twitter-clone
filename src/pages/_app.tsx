import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { type NextComponentType } from "next";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import SideNav from "~/components/SideNav";

type MyAppProps = {
  Component: NextComponentType;
  pageProps: {
    session: Session | null;
  };
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>My Twitter Clone</title>
        <meta
          name="description"
          content="Twitter clone for learning purposes by Hasan Tanich"
        />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className="container mx-auto flex items-start sm:pr-4">
        <SideNav />
        <div className="min-h-screen flex-grow border-x">
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
