import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionMessage, TransactionSignature, VersionedTransaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import * as ra from 'react';
import { notify } from "../utils/notifications";
import { lookup } from 'dns';

type MyProps = {
  transferAmount:string, 
  addresses:string, 
  lookupTableAddress:string
}

export const SendSol: FC<MyProps> = ({ transferAmount, addresses, lookupTableAddress }) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Sol: Wallet not connected!`);
            return;
        }

        const addressList = addresses.split(/\s/).filter(addr => addr !== '');
        const transferLamport = Math.round(parseFloat(transferAmount) * LAMPORTS_PER_SOL);
        let lookupTableAccount = null;
        if (lookupTableAddress.trim() !== ''){
          lookupTableAccount = await connection.getAddressLookupTable(  new PublicKey( lookupTableAddress.trim() ) ); 
        }

        console.log('lamports:', transferLamport);
        console.log('addresses:', addressList);
        console.log('lookupTable:', lookupTableAddress);

        let signature: TransactionSignature = '';
        const instructions = [];
        try {

            // Create instructions to send, in this case a simple transfer

            addressList.map(addr => {
              let inst = SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(addr),
                    lamports: transferLamport,
                });
              instructions.push(inst)
            });
         
            // Get the lates block hash to use on our transaction and confirmation
            let latestBlockhash = await connection.getLatestBlockhash()

            // Create a new TransactionMessage with version and compile it to legacy

            let message = null;
            if (!lookupTableAccount){
                message = new TransactionMessage({
                    payerKey: publicKey,
                    recentBlockhash: latestBlockhash.blockhash,
                    instructions,
                }).compileToLegacyMessage();
                console.log('Legacy Tx');
            }else{
                message = new TransactionMessage({
                    payerKey: publicKey,
                    recentBlockhash: latestBlockhash.blockhash,
                    instructions,
                }).compileToV0Message([lookupTableAccount.value]);
                console.log('V0 Tx');
            }

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
    }, [publicKey, notify, connection, sendTransaction, addresses, transferAmount, lookupTableAddress]);

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
                            Send SOL Transaction
                        </span>
                    </button>
             </div>
        </div>
    );
};
