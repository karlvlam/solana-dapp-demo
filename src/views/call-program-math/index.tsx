// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { CallMath } from '../../components/CallMath';
import pkg from '../../../package.json';


export const CallProgramMathView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();


  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
    }
  }, [wallet.publicKey, connection])

  const [a, setA] = useState('1.0');
  const [b, setB] = useState('0.3');
 
  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">Call Program Math</h1>
        </div>
        <div>What should be a + b ?</div>
        <div>Both a and b are 64-bit floating point variables.</div>
        <div> The solana program takes 128 bits(or 16 bytes) as instruction data. The first 8 bytes for a and the other 8 bytes for b.</div>
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
          <CallMath a={a} b={b} />
        </div>
        <div className="relative group">
            <div className="max-w-md mx-auto mockup-code bg-primary border-2 border-[#5252529f] p-6 px-10 my-2">
            <strong>a: </strong><input
              value={a} 
              onChange={e => { setA(e.target.value) } }
              className="max-w-md mx-auto mockup-code bg-primary"
            />
            <br/>

            <strong>b: </strong><input
              value={b} 
              onChange={e => { setB(e.target.value) } }
              className="max-w-md mx-auto mockup-code bg-primary"
            />

        </div>
        </div>
        </div>
    </div>
  );
};
