import type { NextPage } from "next";
import Head from "next/head";
import { SolTransferView } from "../views";

const SolTransfer: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Sol Transfer</title>
        <meta
          name="description"
          content="Solana Scaffold"
        />
      </Head>
      <SolTransferView />
    </div>
  );
};

export default SolTransferView;
