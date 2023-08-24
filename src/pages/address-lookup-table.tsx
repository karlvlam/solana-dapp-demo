import type { NextPage } from "next";
import Head from "next/head";
import { AddressLookupTableView } from "../views";

const AddressLookupTable: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Address Lookup Table</title>
        <meta
          name="description"
          content="Solana Scaffold"
        />
      </Head>
      <AddressLookupTableView />
    </div>
  );
};

export default AddressLookupTable;
