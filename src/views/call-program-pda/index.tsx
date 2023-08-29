// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { PdaDepositSol, PdaWithdrawSol } from '../../components/Pda';
import pkg from '../../../package.json';


export const CallProgramPdaView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();


  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
    }
  }, [wallet.publicKey, connection])

  const [amount, setAmount] = useState('0.0001');
 
  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">Call Program PDA</h1>
        </div>
        <div>SOL Deposit/Withdrawal</div>
        <div>The program hold your SOLs at a PDA. You can deposit and withdraw anytime.</div>
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
          <PdaDepositSol amount={amount} />
          <PdaWithdrawSol amount={amount} />
        </div>
        <div className="relative group">
            <div className="max-w-md mx-auto mockup-code bg-primary border-2 border-[#5252529f] p-6 px-10 my-2">
            <strong>SOL: </strong><input
              value={amount} 
              onChange={e => { setAmount(e.target.value) } }
              className="max-w-md mx-auto mockup-code bg-primary"
            />
            <br/>


        </div>
        </div>
        </div>
    </div>
  );
};
