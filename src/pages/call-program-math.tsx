import type { NextPage } from "next";
import Head from "next/head";
import { CallProgramMathView } from "../views";

const CallProgramMath: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Call Program Math</title>
        <meta
          name="description"
          content="Solana Scaffold"
        />
      </Head>
      <CallProgramMathView/>
    </div>
  );
};

export default CallProgramMath;
