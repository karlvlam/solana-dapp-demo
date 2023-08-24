// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { CreateAddressLookupTable } from '../../components/CreateAddressLookupTable';
import pkg from '../../../package.json';


export const AddressLookupTableView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();


  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
    }
  }, [wallet.publicKey, connection])

  const [transferAddresses, setTransferAddresses] = useState('');
  const [transferAmount, setTransferAmount] = useState('0.000001');
  const [lookupTable, setLookupTable] = useState('');
 
  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">Address Lookup Table</h1>
        </div>
                <div className="flex flex-col mt-2">
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
          {wallet &&
          <div className="flex flex-row justify-center">
            <div>
              </div>
              <div className='text-slate-600 ml-2'>
              </div>
          </div>
          }
          </h4>
          <CreateAddressLookupTable  />
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
              className="max-w-md mx-auto mockup-code bg-primary" rows="2" cols="30"
            />
            <br/>

            <strong>Target Wallet(s):</strong>
            <textarea value={transferAddresses} 
              onChange={e => { setTransferAddresses(e.target.value) } } 
              className="max-w-md mx-auto mockup-code bg-primary" rows="10" cols="30"/>
            </div>
        </div>

        </div>
    </div>
  );
};
