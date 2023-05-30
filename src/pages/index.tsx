import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import SideBarLayout from "~/components/layouts/SideBarLayout";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Untitled</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <SideBarLayout >
          home
        </SideBarLayout >
      </main>
    </>
  );
};

export default Home;
