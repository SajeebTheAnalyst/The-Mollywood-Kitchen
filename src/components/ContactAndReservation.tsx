import React, { useState } from 'react';
import { CalendarDays, Clock, Phone, MapPin, Mail, Ticket, CheckCircle2, Star, Sliders, Play, Award, Film } from 'lucide-react';
import { Reservation } from '../types';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactAndReservation() {
  const { addReservation } = useStore();
  const [formData, setFormData] = useState<Reservation>({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    date: '',
    time: '',
    specialRequest: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Reservation, string>>>({});
  const [successTicket, setSuccessTicket] = useState<boolean>(false);
  const [ticketNumber, setTicketNumber] = useState<string>('');

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof Reservation, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\s\-()]{8,15}$/;

    if (!formData.name.trim()) errors.name = 'Please provide your full name.';
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      errors.phone = 'Please provide a valid contact number (8-15 digits).';
    }
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = 'Please provide a valid email message address.';
    }
    if (!formData.date) errors.date = 'Please pick a reservation date.';
    if (!formData.time) errors.time = 'Please select a reservation time.';
    if (formData.guests < 1 || formData.guests > 20) {
      errors.guests = 'For parties larger than 20, contact our manager directly.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }));
    // Clear error on write
    if (formErrors[name as keyof Reservation]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate ticket generation
      const randomTicketNum = 'MOLLY-' + Math.floor(100000 + Math.random() * 900000);
      setTicketNumber(randomTicketNum);
      
      // Save directly into global database context for live admin alerts
      addReservation({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        guests: formData.guests,
        date: formData.date,
        time: formData.time,
        specialRequest: formData.specialRequest.trim(),
        status: 'Pending'
      });

      setSuccessTicket(true);
    }
  };

  const guestPresets = [1, 2, 4, 6, 8, 12];

  const openingHours = [
    { days: 'Monday – Thursday', times: '12:00 PM – 10:30 PM', footnote: 'Last orders 10:00 PM' },
    { days: 'Friday – Saturday', times: '11:30 AM – 11:45 PM', footnote: 'Late Night Diner Welcome' },
    { days: 'Sunday', times: '11:30 AM – 10:00 PM', footnote: 'Sunday Family Feast Special' },
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-black cinematic-gradient-bg border-t border-zinc-900 scroll-mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center space-x-1.5 bg-zinc-900 border border-gold/20 px-3 py-1 rounded-full text-[10px] font-bold text-gold tracking-widest uppercase">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>RESERVE A COZY TABLE</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-widest leading-none">
            RESERVATIONS & CONTACT
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-gold via-accent-red to-gold mx-auto rounded-full" />
          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-light">
            Skip the queue. Reserve your tables for family dinner, corporate lunch, or private events in seconds.
          </p>
        </motion.div>

        {/* Content Layout: Left Details, Right Active Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Grid: Contact Information details (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Hour Board card */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-6">
              <h3 className="font-heading text-base font-black text-gold tracking-widest flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>RESTAURANT HOURS</span>
              </h3>
              
              <div className="divide-y divide-zinc-900">
                {openingHours.map((h, i) => (
                  <div key={i} className="py-3 flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-200">{h.days}</span>
                      <span className="text-[10px] text-zinc-500 font-medium italic mt-0.5">{h.footnote}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-gold tracking-wide">{h.times}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address phone info card */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-6">
              <h3 className="font-heading text-base font-black text-gold tracking-widest flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>OUR PIRGANJ ADDRESS</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-zinc-300">
                  <MapPin className="h-4 w-4 text-accent-red-hover flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold leading-none">Mollywood Kitchen Main Campus</p>
                    <p className="text-xs text-zinc-500 font-light mt-1">
                      Main Highway Road, Pirganj, Rangpur, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-zinc-300">
                  <Phone className="h-4 w-4 text-accent-red-hover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold leading-none">Direct Hot Line</p>
                    <p className="text-xs text-zinc-500 font-mono mt-1">+880 1799 432582</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-zinc-300">
                  <Mail className="h-4 w-4 text-accent-red-hover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold leading-none">Inquiry Email Link</p>
                    <p className="text-xs text-zinc-500 font-mono mt-1">info@mollywoodkitchen.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Interactive Google Map Mock Layout */}
            <div className="relative rounded-2xl border border-zinc-900 bg-zinc-950 overflow-hidden h-44 group shadow-md hover:border-gold/20 duration-300">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                alt="Dhaka Map Mockup"
                className="h-full w-full object-cover opacity-20 group-hover:scale-[1.02] duration-700 pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              
              {/* Central Map Locator Pin */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 z-10">
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-accent-red/40 animate-ping opacity-75" />
                  <MapPin className="h-6 w-6 text-accent-red-hover z-10" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-gold text-glow-gold">VIEW MAP LOCATION</span>
              </div>
            </div>

          </div>

          {/* Right Grid: Active Form Block (7 Columns) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {successTicket ? (
                
                /* Cinematic Success Ticket Presentation overlay */
                <motion.div 
                  key="success-ticket"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-2xl border border-gold bg-zinc-950/95 p-6 sm:p-8 space-y-6 text-center relative border-gold-glow"
                >
                  
                  {/* Vintage Ticket cuts */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-black border-r border-gold" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-black border-l border-gold" />

                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950/40 border border-emerald-500 text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-gold uppercase">RESERVATION CONFIRMED</span>
                  <h3 className="font-heading text-lg sm:text-2xl font-black text-white">YOUR COZY TABLE IS RESERVED!</h3>
                </div>

                <div className="h-px bg-dashed border-t border-zinc-900 my-4" />

                {/* Styled Ticket layout stats */}
                <div className="grid grid-cols-2 gap-4 text-left font-mono text-xs max-w-md mx-auto pt-2 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900">
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase text-[10px]">NAME</p>
                    <p className="text-zinc-200 font-bold truncate mt-1 uppercase">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase text-[10px]">RESERVATION ID</p>
                    <p className="text-gold font-black mt-1">{ticketNumber}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase text-[10px]">DATE</p>
                    <p className="text-zinc-200 mt-1">{formData.date}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase text-[10px]">TIME</p>
                    <p className="text-zinc-200 mt-1">{formData.time}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-zinc-500 font-semibold uppercase text-[10px]">GUEST COUNT</p>
                    <p className="text-zinc-200 mt-1">{formData.guests} Guests</p>
                  </div>
                </div>

                {/* Subtext info */}
                <p className="text-[11px] text-zinc-500 max-w-sm mx-auto font-light mt-4">
                  A verification receipt with instructions has been dispatched to <span className="text-zinc-300 font-semibold">{formData.email}</span>. Simply show this registration code upon arrival on your reservation date.
                </p>

                <button
                  onClick={() => {
                    setFormData({ name: '', phone: '', email: '', guests: 2, date: '', time: '', specialRequest: '' });
                    setSuccessTicket(false);
                  }}
                  className="mt-2 text-xs text-gold font-bold underline hover:text-white uppercase tracking-widest bg-transparent border-0 cursor-pointer"
                >
                  Book Another Table
                </button>

              </motion.div>
            ) : (
              
              /* Default Interactive Reservation form input values */
              <motion.form 
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit} 
                className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 sm:p-8 space-y-6"
              >
                
                <div className="flex items-center space-x-2 border-b border-zinc-900 pb-4">
                  <CalendarDays className="h-5 w-5 text-gold" />
                  <h3 className="font-heading text-lg font-black text-white tracking-wider uppercase">TABLE RESERVATION</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full bg-zinc-900/50 text-white text-xs px-4 py-3 border rounded-xl focus:outline-none placeholder:text-zinc-600 transition-colors ${
                        formErrors.name ? 'border-red-500' : 'border-zinc-850 focus:border-gold'
                      }`}
                    />
                    {formErrors.name && <p className="text-[10px] text-red-400 font-semibold mt-1">{formErrors.name}</p>}
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">Contact Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+880 XXXXX XXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full bg-zinc-900/50 text-white text-xs px-4 py-3 border rounded-xl focus:outline-none placeholder:text-zinc-600 transition-colors ${
                        formErrors.phone ? 'border-red-500' : 'border-zinc-850 focus:border-gold'
                      }`}
                    />
                    {formErrors.phone && <p className="text-[10px] text-red-400 font-semibold mt-1">{formErrors.phone}</p>}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="customer@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-zinc-900/50 text-white text-xs px-4 py-3 border rounded-xl focus:outline-none placeholder:text-zinc-600 transition-colors ${
                        formErrors.email ? 'border-red-500' : 'border-zinc-850 focus:border-gold'
                      }`}
                    />
                    {formErrors.email && <p className="text-[10px] text-red-400 font-semibold mt-1">{formErrors.email}</p>}
                  </div>

                  {/* Guest counters preset dropdown select combo */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">Number of Guests</label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 text-white text-xs px-4 py-3 border border-zinc-850 rounded-xl focus:outline-none focus:border-gold transition-colors"
                    >
                      {guestPresets.map(preset => (
                        <option key={preset} value={preset}>{preset} Guests</option>
                      ))}
                    </select>
                  </div>

                  {/* Screening Date Picker */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">Reservation Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full bg-zinc-900/50 text-white text-xs px-4 py-3 border rounded-xl focus:outline-none transition-colors ${
                        formErrors.date ? 'border-red-500' : 'border-zinc-850 focus:border-gold'
                      }`}
                    />
                    {formErrors.date && <p className="text-[10px] text-red-400 font-semibold mt-1">{formErrors.date}</p>}
                  </div>

                  {/* Show Time Slot Picker */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">Reservation Time</label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full bg-zinc-900 text-white text-xs px-4 py-3 border rounded-xl focus:outline-none transition-colors ${
                        formErrors.time ? 'border-red-500' : 'border-zinc-850 focus:border-gold'
                      }`}
                    >
                      <option value="">Select slot time</option>
                      <option value="12:30 PM">12:30 PM (Lunch)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon)</option>
                      <option value="06:30 PM">06:30 PM (Early Dinner)</option>
                      <option value="08:00 PM">08:00 PM (Prime Dinner)</option>
                      <option value="10:00 PM">10:00 PM (Late Night Snack)</option>
                    </select>
                    {formErrors.time && <p className="text-[10px] text-red-400 font-semibold mt-1">{formErrors.time}</p>}
                  </div>

                </div>

                {/* Special Requests */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">Special Instructions / Dietary Notes</label>
                  <textarea
                    name="specialRequest"
                    rows={2}
                    placeholder="E.g. Wheelchair access, kids high-chairs, specific spice level preference, candle lighting request..."
                    value={formData.specialRequest}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900/50 text-white text-xs px-4 py-3 border border-zinc-850 rounded-xl focus:outline-none focus:border-gold placeholder:text-zinc-600 transition-colors resize-none"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-red to-accent-red-hover hover:from-gold hover:to-gold-dark text-white hover:text-neutral-950 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-accent-red/25 hover:shadow-gold/20 flex items-center justify-center space-x-2 border border-accent-red"
                >
                  <CalendarDays className="h-4.5 w-4.5" />
                  <span>RESERVE MY TABLE</span>
                </button>

              </motion.form>
            )}
          </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
