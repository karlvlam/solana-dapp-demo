import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionMessage, TransactionSignature, VersionedTransaction, PublicKey, LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import * as ra from 'react';
import { notify } from "../utils/notifications";
import { lookup } from 'dns';

type MyProps = {
  a:string,
  b:string
}

export const CallMath: FC<MyProps> = ({ a, b}) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Sol: Wallet not connected!`);
            return;
        }

        let math1:Buffer = new Buffer(8);
        math1.writeDoubleLE(parseFloat(a));
        let math2:Buffer = new Buffer(8);
        math2.writeDoubleLE(parseFloat(b));
        


        let signature: TransactionSignature = '';
        try {

            let inst = new TransactionInstruction({
                programId: new PublicKey('7vhfAkXkGwhpyjApeZJciomyV5TVMcaPibJWXWdz9cPh'),
                keys: [],
                data: Buffer.concat([math1, math2]),
            });

            let latestBlockhash = await connection.getLatestBlockhash()

            let message = new TransactionMessage({
               payerKey: publicKey,
               recentBlockhash: latestBlockhash.blockhash,
               instructions: [inst],
            }).compileToLegacyMessage();

            // Create a new VersionedTransacction which supports legacy and v0
            const transation = new VersionedTransaction(message);

            // Send transaction and await for signature
            signature = await sendTransaction(transation, connection);

            // Send transaction and await for signature
            await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

            console.log(signature);
            notify({ type: 'success', message: 'Transaction successful!', txid: signature });
        } catch (error: any) {
            notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
            console.log('error', `Transaction failed! ${error?.message}`, signature);
            return;
        }
    }, [publicKey, notify, connection, sendTransaction, a, b]);

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
                           Call Program Math 
                        </span>
                    </button>
             </div>
        </div>
    );
};
