import type { NextPage } from "next";
import Head from "next/head";
import { CallProgramPdaView } from "../views";

const CallProgramPda: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Call Program PDA</title>
        <meta
          name="description"
          content="Solana Scaffold"
        />
      </Head>
      <CallProgramPdaView />
    </div>
  );
};

export default CallProgramPda;
