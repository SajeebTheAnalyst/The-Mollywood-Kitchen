import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, Clock, XCircle, Search, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface DummyOrder {
  id: string;
  customerName: string;
  phone: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
}

const initialDummyOrders: DummyOrder[] = [
  {
    id: 'ORD-9823',
    customerName: 'Rahim Uddin',
    phone: '01711223344',
    date: '12 mins ago',
    items: [
      { name: 'Beef Kala Bhuna', qty: 2, price: 280 },
      { name: 'Plain Polao', qty: 2, price: 100 }
    ],
    total: 760,
    status: 'preparing'
  },
  {
    id: 'ORD-9822',
    customerName: 'Samira Akter',
    phone: '01822334455',
    date: '45 mins ago',
    items: [
      { name: 'Chicken Biryani', qty: 1, price: 220 },
      { name: 'Borhani', qty: 1, price: 60 }
    ],
    total: 280,
    status: 'delivered'
  },
  {
    id: 'ORD-9821',
    customerName: 'Fahim Hasan',
    phone: '01933445566',
    date: '1 hour ago',
    items: [
      { name: 'Mutton Kacchi', qty: 3, price: 350 },
      { name: 'Firni', qty: 3, price: 50 }
    ],
    total: 1200,
    status: 'delivered'
  },
  {
    id: 'ORD-9824',
    customerName: 'Tariq Islam',
    phone: '01555667788',
    date: 'Just now',
    items: [
      { name: 'Special Rui Fish Combo', qty: 1, price: 320 }
    ],
    total: 320,
    status: 'pending'
  }
];

export default function OrdersManagementView() {
  const [orders, setOrders] = useState<DummyOrder[]>(initialDummyOrders);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm)
  );

  const getStatusColor = (status: DummyOrder['status']) => {
    switch (status) {
      case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'preparing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'ready': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'delivered': return 'text-zinc-400 bg-zinc-800/50 border-zinc-700';
      case 'cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    }
  };

  const updateOrderStatus = (id: string, newStatus: DummyOrder['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Live Order Tracker</h1>
          <p className="text-xs text-zinc-400 mt-1">Monitor incoming orders and update preparation status in real-time.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3">
        <Search className="h-5 w-5 text-zinc-500" />
        <input 
          type="text"
          placeholder="Search by Order ID, Name, or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-sm text-zinc-200 outline-none flex-1 placeholder-zinc-600"
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-2xl">
            <ShoppingBag className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">No Orders Found</p>
          </div>
        ) : (
          filteredOrders.map((order, i) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-zinc-950 border border-zinc-900 hover:border-gold/30 rounded-xl p-5 flex flex-col md:flex-row gap-6 transition-colors shadow-lg"
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-mono font-bold text-gold text-sm tracking-widest">{order.id}</h3>
                    <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {order.date}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="pt-3 border-t border-zinc-900/50">
                  <h4 className="text-sm font-bold text-zinc-200">{order.customerName}</h4>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">{order.phone}</p>
                </div>

                <div className="bg-black/30 rounded-lg p-3 border border-zinc-900/50">
                  <div className="space-y-2 mb-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-zinc-300"><span className="text-zinc-500 font-mono mr-2">{item.qty}x</span>{item.name}</span>
                        <span className="text-zinc-400 font-mono text-[10px]">৳{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-900/50 font-bold">
                    <span className="text-zinc-300 text-xs uppercase tracking-widest">Total</span>
                    <span className="text-gold font-mono">৳{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-48 flex flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-zinc-900/50 pt-4 md:pt-0 md:pl-6 shrink-0">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Update Status</p>
                {order.status === 'pending' && (
                  <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-colors py-2 rounded text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2">
                    Accept & Prepare
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button onClick={() => updateOrderStatus(order.id, 'ready')} className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-colors py-2 rounded text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> Ready for Pickup
                  </button>
                )}
                {order.status === 'ready' && (
                  <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="w-full bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-colors py-2 rounded text-xs font-bold uppercase tracking-wider">
                    Mark Delivered
                  </button>
                )}
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="w-full text-zinc-500 hover:text-rose-400 transition-colors py-2 text-[10px] font-bold uppercase tracking-wider flex justify-center items-center gap-1 mt-2">
                    <XCircle className="h-3 w-3" /> Cancel Order
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
