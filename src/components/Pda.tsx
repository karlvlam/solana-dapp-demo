import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionMessage, TransactionSignature, VersionedTransaction, PublicKey, LAMPORTS_PER_SOL, TransactionInstruction, AccountMeta } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import * as ra from 'react';
import { notify } from "../utils/notifications";
import { lookup } from 'dns';

const PROGRAM_ID = 'HmQpguNGGzFkLRJceSneMVeN9PaGp1L8Yf7PkX3MBaWw';

type MyProps = {
  amount:string,
}


const PdaDepositSol: FC<MyProps> = ({ amount }) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Sol: Wallet not connected!`);
            return;
        }

        let bufAction: Buffer = Buffer.alloc(1);
        bufAction[0] = 1;

        let bufLamport:Buffer = Buffer.alloc(8);
        let lamport = BigInt(Math.round(parseFloat(amount) * LAMPORTS_PER_SOL));

        bufLamport.writeBigInt64LE(lamport);

        let seeds = [Buffer.from('acc-'), publicKey.toBuffer()];
        let [pda_pubkey, bump] = PublicKey.findProgramAddressSync(seeds, new PublicKey(PROGRAM_ID) );
        console.log('PDA:', pda_pubkey.toBase58());

        let signer:AccountMeta = {
          isSigner: true,
          isWritable: true,
          pubkey: publicKey,
        }
        let pdaAddr: AccountMeta = {
          isSigner: false,
          isWritable: true,
          pubkey: pda_pubkey,
        }
        let sysprog: AccountMeta = {
          isSigner: false,
          isWritable: false,
          pubkey: SystemProgram.programId,
        }


        let signature: TransactionSignature = '';
        try {

            let inst = new TransactionInstruction({
                programId: new PublicKey(PROGRAM_ID),
                keys: [signer, pdaAddr, sysprog],
                data: Buffer.concat([bufAction, bufLamport]),
            });
            console.log(inst.data);

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
    }, [publicKey, notify, connection, sendTransaction, amount]);

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
                           PDA: Deposit SOL 
                        </span>
                    </button>
             </div>
        </div>
    );
};

const PdaWithdrawSol: FC<MyProps> = ({ amount }) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Sol: Wallet not connected!`);
            return;
        }

        let bufAction: Buffer = Buffer.alloc(1);
        bufAction[0] = 2;

        let bufLamport:Buffer = Buffer.alloc(8);
        let lamport = BigInt(Math.round(parseFloat(amount) * LAMPORTS_PER_SOL));

        bufLamport.writeBigInt64LE(lamport);

        let seeds = [Buffer.from('acc-'), publicKey.toBuffer()];
        let [pda_pubkey, bump] = PublicKey.findProgramAddressSync(seeds, new PublicKey(PROGRAM_ID) );
        console.log('PDA:', pda_pubkey.toBase58());

        let signer:AccountMeta = {
          isSigner: true,
          isWritable: false,
          pubkey: publicKey,
        }
        let pdaAddr: AccountMeta = {
          isSigner: false,
          isWritable: true,
          pubkey: pda_pubkey,
        }
        let sysprog: AccountMeta = {
          isSigner: false,
          isWritable: false,
          pubkey: SystemProgram.programId,
        }

        let signature: TransactionSignature = '';
        try {

            let inst = new TransactionInstruction({
                programId: new PublicKey(PROGRAM_ID),
                keys: [signer, pdaAddr,sysprog],
                data: Buffer.concat([bufAction, bufLamport]),
            });
            console.log(inst.data);

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
    }, [publicKey, notify, connection, sendTransaction, amount]);

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
                           PDA: Withdraw SOL 
                        </span>
                    </button>
             </div>
        </div>
    );
};


export {
  PdaDepositSol,
  PdaWithdrawSol,
}
