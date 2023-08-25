import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionMessage
, TransactionSignature, VersionedTransaction, PublicKey, LAMPORTS_PER_SOL
, AddressLookupTableProgram, 
AddressLookupTableAccount} from '@solana/web3.js';
import { FC, useCallback } from 'react';
import * as ra from 'react';
import { notify } from "../utils/notifications";
import { lookup } from 'dns';

type MyProps = {
  lookupTableAddress:string, 
  extendAddresses:string
}

export const ExtendAddressLookupTable: FC<MyProps> = ({lookupTableAddress, extendAddresses}) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Sol: Wallet not connected!`);
            return;
        }

        console.log('#####################');
        console.log(extendAddresses);

        const addressList = extendAddresses.split(/\s/)
          .filter(addr => addr !== '')
          .map(addr => {return new PublicKey(addr)} );    

        let lookupTableAccount = null;    
        if (lookupTableAddress.trim() !== ''){    
            lookupTableAccount = await connection.getAddressLookupTable(  new PublicKey( lookupTableAddress.trim() ) );    
        }


        let signature: TransactionSignature = '';
        try {
         
            // Get the lates block hash to use on our transaction and confirmation

            let latestBlockhash = await connection.getLatestBlockhash()

            const lookupTableInst = AddressLookupTableProgram.extendLookupTable({
                authority: publicKey,
                payer: publicKey,
                lookupTable: new PublicKey(lookupTableAddress.trim()),
                addresses: addressList,
            });

            let messageTxn = new TransactionMessage({
              payerKey: publicKey,
              recentBlockhash: latestBlockhash.blockhash,
              instructions: [lookupTableInst],
            }).compileToV0Message();

            const transation = new VersionedTransaction(messageTxn);
            console.log(transation);

            // Send transaction and await for signature
            signature = await sendTransaction(transation, connection);

            // Send transaction and await for signature
            await connection.confirmTransaction({ signature, ...latestBlockhash}, 'confirmed');

            console.log(signature);
            console.log('Extend Lookup Table:', lookupTableAddress);
            notify({ type: 'success', message: 'Transaction successful! Lookup Table: '+lookupTableAddress, txid: signature });
        } catch (error: any) {
            notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
            //console.log('error', `Transaction failed! ${error?.message}`, signature);
            console.log('error', `Transaction failed! ${error}`, signature);
            return;
        }
    }, [publicKey, notify, connection, sendTransaction, lookupTableAddress, extendAddresses]);

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
                           Extend Address Lookup Table 
                        </span>
                    </button>
             </div>
        </div>
    );
};
