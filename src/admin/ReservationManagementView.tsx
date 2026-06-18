import React, { useState } from 'react';
import { useStore, AdminReservation } from '../context/StoreContext';
import { 
  Search, 
  Calendar, 
  Users, 
  CircleDot, 
  Check, 
  X, 
  Trash2, 
  Download, 
  Info, 
  Clock,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ReservationManagementView() {
  const { reservations, updateReservationStatus, deleteReservation, showToast } = useStore();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [selectedRes, setSelectedRes] = useState<AdminReservation | null>(null);

  // Status Style utilities
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-950/40 border-emerald-800 text-emerald-400';
      case 'Completed': return 'bg-blue-950/40 border-blue-800 text-blue-400';
      case 'Cancelled': return 'bg-rose-950/40 border-rose-800 text-rose-400';
      default: return 'bg-amber-955/30 border-amber-80 * 20 text-amber-500'; // Pending
    }
  };

  // Filtered dataset
  const filteredList = reservations.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.phone.includes(searchQuery) || 
                          (res.email && res.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (res.specialRequest && res.specialRequest.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && res.status === activeTab;
  });

  // Actual CSV Downloader! This will generate a real download.
  const handleExportCSV = () => {
    if (filteredList.length === 0) {
      showToast('No reservation data matching filters to export.', 'error');
      return;
    }

    try {
      // Header row
      const headers = ['Reservation ID', 'Customer Name', 'Phone', 'Email', 'Guests', 'Date', 'Time', 'Special Request', 'Status'];
      
      // Map rows
      const rows = filteredList.map(item => [
        item.id,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.phone}"`,
        `"${item.email || ''}"`,
        item.guests,
        item.date,
        item.time,
        `"${(item.specialRequest || '').replace(/"/g, '""')}"`,
        item.status
      ]);

      // Join CSV
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `mollywood_reservations_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      link.click();
      document.body.removeChild(link);
      showToast('Spreadsheet CSV download triggered successfully!', 'success');
    } catch (err) {
      showToast('Export failed. Browser sandbox constraints block download.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. View Header with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Reservation Bookings</h1>
          <p className="text-xs text-zinc-400 mt-1">Audit guest bookings, confirm seats, and download structural excel logs.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-1.5 border border-gold/30 hover:border-gold text-gold hover:bg-gold/5 font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>EXPORT SPREADSHEET (CSV)</span>
        </button>
      </div>

      {/* 2. Operations Tabs & Search Panel */}
      <div className="space-y-4">
        {/* Reservation Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-1">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => {
            const count = tab === 'All' 
              ? reservations.length 
              : reservations.filter(r => r.status === tab).length;
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 border-b-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 relative ${
                  activeTab === tab 
                    ? 'border-gold text-gold bg-gold/5' 
                    : 'border-transparent text-zinc-505 hover:text-zinc-200'
                }`}
              >
                <span>{tab} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Input keys search box */}
        <div className="relative max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search booking by guest name, phone, request note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-gold/45 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 outline-none transition-colors"
          />
        </div>
      </div>

      {/* 3. Tabular Grid Logs */}
      {filteredList.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-2xl">
          <Calendar className="h-7 w-7 text-zinc-650 mx-auto mb-3" />
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">No Bookings Match Criteria</p>
          <p className="text-zinc-650 text-[10px] mt-1">Adjust search parameters or status tabs above.</p>
        </div>
      ) : (
        <div className="border border-zinc-900 bg-zinc-950/40 rounded-2xl overflow-hidden shadow-2xl border-gold-glow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-mono text-[10px] uppercase bg-black/40">
                  <th className="p-4 font-normal">Guest Particulars</th>
                  <th className="p-4 font-normal">Table configuration</th>
                  <th className="p-4 font-normal">Time schedule</th>
                  <th className="p-4 font-normal">Special request note</th>
                  <th className="p-4 font-normal">Ticket status</th>
                  <th className="p-4 font-normal text-right">Approve/Log actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {filteredList.map((res) => (
                  <tr key={res.id} className="hover:bg-zinc-900/10 transition-colors group">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-zinc-150 group-hover:text-gold transition-colors">{res.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{res.phone}</p>
                        <p className="text-[9px] text-zinc-550 truncate max-w-[150px] mt-0.5">{res.email || 'No email provided'}</p>
                      </div>
                    </td>
                    <td className="p-4 font-sans text-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-zinc-500" />
                        <span><strong>{res.guests}</strong> Seats</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1">Indoor Table Section</p>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-zinc-200">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gold" />
                        <span>{res.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{res.time}</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      {res.specialRequest ? (
                        <div className="bg-zinc-950/80 p-2 border border-zinc-900 rounded-lg text-[10px] text-zinc-400 leading-normal max-h-16 overflow-y-auto">
                          {res.specialRequest}
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-600 italic">None</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${getBadgeStyle(res.status)}`}>
                        {res.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {res.status === 'Pending' ? (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => updateReservationStatus(res.id, 'Confirmed')}
                            className="p-1 px-2 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 hover:bg-emerald-900/60 hover:text-white transition-colors text-[10px] font-mono flex items-center gap-1"
                            title="Confirm Booking"
                          >
                            <Check className="h-3 w-3" />
                            <span>ACCEPT</span>
                          </button>
                          <button
                            onClick={() => updateReservationStatus(res.id, 'Cancelled')}
                            className="p-1 px-2 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-400 hover:bg-rose-900/60 hover:text-white transition-colors text-[10px] font-mono flex items-center gap-1"
                            title="Reject/Cancel"
                          >
                            <X className="h-3 w-3" />
                            <span>REJECT</span>
                          </button>
                        </div>
                      ) : res.status === 'Confirmed' ? (
                        <div className="inline-flex gap-2.5 items-center">
                          <button
                            onClick={() => updateReservationStatus(res.id, 'Completed')}
                            className="px-2.5 py-1.5 bg-blue-950 border border-blue-800 text-blue-400 hover:text-white hover:bg-blue-900 transition-colors rounded-xl text-[9px] font-mono uppercase font-bold"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => updateReservationStatus(res.id, 'Cancelled')}
                            className="text-rose-500 hover:text-white text-[10px] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => deleteReservation(res.id)}
                          className="p-1.5 rounded-lg text-zinc-550 hover:text-rose-500 hover:bg-rose-950/30 transition-all"
                          title="Purge Ticket"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
