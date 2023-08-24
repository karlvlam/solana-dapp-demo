import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionMessage
, TransactionSignature, VersionedTransaction, PublicKey, LAMPORTS_PER_SOL
, AddressLookupTableProgram } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import * as ra from 'react';
import { notify } from "../utils/notifications";
import { lookup } from 'dns';

export const CreateAddressLookupTable: FC = ({}) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Sol: Wallet not connected!`);
            return;
        }

        let signature: TransactionSignature = '';
        const instructions = [];
        try {
         
            // Get the lates block hash to use on our transaction and confirmation

            let slot = await connection.getSlot();
            let latestBlockhash = await connection.getLatestBlockhash()

            const [lookupTableInst, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
                authority: publicKey,
                payer: publicKey,
                recentSlot: slot-0, // why I need to minus 100?
            });

            let message = new TransactionMessage({
              payerKey: publicKey,
              recentBlockhash: latestBlockhash.blockhash,
              instructions: [lookupTableInst],
            }).compileToV0Message();

            const transation = new VersionedTransaction(message);
            console.log(transation);

            // Send transaction and await for signature
            signature = await sendTransaction(transation, connection);

            // Send transaction and await for signature
            await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

            console.log(signature);
            console.log('New Lookup Table:', lookupTableAddress.toBase58());
            notify({ type: 'success', message: 'Transaction successful! New Lookup Table: '+lookupTableAddress.toBase58(), txid: signature });
        } catch (error: any) {
            notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
            console.log('error', `Transaction failed! ${error?.message}`, signature);
            return;
        }
    }, [publicKey, notify, connection, sendTransaction ]);

    return (
        <div className="flex flex-row justify-center">
            <div className="relative group items-center">
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={onClick} disabled={!publicKey}
                    >
                        <div className="hidden group-disabled:block ">
                        Wallet not connected
                        </div>
                         <span className="block group-disabled:hidden" >
                           Create Address Lookup Table 
                        </span>
                    </button>
             </div>
        </div>
    );
};
