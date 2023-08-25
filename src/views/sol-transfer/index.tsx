// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { SendSol } from '../../components/SendSol';
import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const SolTransferView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  const [transferAddresses, setTransferAddresses] = useState('');
  const [transferAmount, setTransferAmount] = useState('0.000001');
  const [lookupTable, setLookupTable] = useState('');
 
  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">Sol Transfer        </h1>
        <div>Send SOL to multiple addresses in a single transaction.</div>
        <div> An address lookup table can be used to reduce the transaction size.</div>
        </div>
                <div className="flex flex-col mt-2">
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
          {wallet &&
          <div className="flex flex-row justify-center">
            <div>
              {(balance || 0).toLocaleString()}
              </div>
              <div className='text-slate-600 ml-2'>
                SOL
              </div>
          </div>
          }
          </h4>
          <SendSol addresses={transferAddresses} transferAmount={transferAmount} lookupTableAddress={lookupTable} />
        </div>
        <div className="relative group">
            <div className="max-w-md mx-auto mockup-code bg-primary border-2 border-[#5252529f] p-6 px-10 my-2">
            <strong>Amount (SOL):</strong> <input 
              type="text" 
              value={transferAmount} 
              onChange={e => { setTransferAmount(e.target.value) } }
              className="max-w-md mx-auto mockup-code bg-primary"
            />
            <br/>
            <strong>Lookup Table (optional): </strong><textarea
              value={lookupTable} 
              onChange={e => { setLookupTable(e.target.value) } }
              className="max-w-md mx-auto mockup-code bg-primary" rows={2} cols={30}
            />
            <br/>

            <strong>Target Wallet(s):</strong>
            <textarea value={transferAddresses} 
              onChange={e => { setTransferAddresses(e.target.value) } } 
              className="max-w-md mx-auto mockup-code bg-primary" rows={10} cols={30}/>
            </div>
        </div>

        </div>
    </div>
  );
};
