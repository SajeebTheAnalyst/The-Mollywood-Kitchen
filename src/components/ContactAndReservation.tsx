import React, { useState } from 'react';
import { CalendarDays, Clock, Phone, MapPin, Mail, Ticket, CheckCircle2, Star, Sliders, Play, Award, Film, Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { Reservation } from '../types';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactAndReservation() {
  const { addReservation, contactSettings, websiteSettings, aboutSettings } = useStore();
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

  const benefits = [
    {
      id: 1,
      icon: <Heart className="h-6 w-6 text-gold" />,
      title: 'Warm & Cozy Setting',
      desc: 'Our dining area is tidy, spacious, and perfect for families, student groups, and travelers passing through Pirganj.'
    },
    {
      id: 2,
      icon: <Sparkles className="h-6 w-6 text-gold" />,
      title: 'Rich Authentic Flavors',
      desc: 'Carefully curated dishes balancing authentic Bengali comfort stews and premium-cooked Indian and Chinese specialties.'
    },
    {
      id: 3,
      icon: <ShieldCheck className="h-6 w-6 text-gold" />,
      title: 'Affordable & Welcoming',
      desc: 'We are committed to serving premium quality food at budget-friendly rates with pleasant and efficient hospitality.'
    }
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-black cinematic-gradient-bg border-t border-zinc-900 scroll-mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* WHY CHOOSE MOLLYWOOD KITCHEN / ABOUT */}
        <div className="border-b border-white/5 pb-24 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Benefits left board (5 Columns) */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-bold text-text-secondary tracking-[0.3em] uppercase">
                <Sparkles className="h-3 w-3 text-gold" />
                <span>Our Heritage</span>
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight uppercase">
                {aboutSettings?.story ? "About Mollywood" : "Dining with Distinction"}
              </h2>
              <p className="font-sans text-sm sm:text-base text-text-secondary leading-relaxed font-light">
                {aboutSettings?.story || "We believe dining should make you feel right at home. We combine premium fresh ingredients, classic homestyle recipes, and cozy table setups to ensure a satisfying experience."}
              </p>
              
              <div className="border-l border-gold pl-6 py-2 italic text-sm text-text-secondary font-light mt-8">
                "{aboutSettings?.mission || "Providing clean, delicious, and pocket-friendly meals for everyone in Rangpur."}" 
                <p className="text-[10px] font-bold tracking-[0.3em] text-gold not-italic mt-4 uppercase">— {aboutSettings?.founders || "Mollywood Kitchen Family"}</p>
              </div>
            </div>

            {/* Benefits grid details (7 Columns) */}
            <div className="lg:col-span-1" />
            <div className="lg:col-span-6 space-y-8">
              {benefits.map((b) => (
                <div 
                  key={b.id} 
                  className="p-8 rounded-sm bg-black/40 border border-white/5 flex items-start space-x-6 hover:border-gold/20 transition-all duration-500"
                >
                  <div className="p-4 rounded-sm bg-white/5 border border-white/10 flex-shrink-0">
                    {b.icon}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="font-heading text-lg font-bold text-text-primary tracking-widest uppercase">{b.title}</h4>
                    <p className="text-xs text-text-secondary font-light mt-2 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-bold text-text-secondary tracking-[0.3em] uppercase">
            <CalendarDays className="h-3.5 w-3.5 text-gold" />
            <span>Table Reservation</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tight leading-none uppercase">
            Visit <span className="text-gold italic font-normal">Our Kitchen</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-text-secondary max-w-md mx-auto font-light leading-relaxed">
            Skip the queue. Reserve your tables for family dinner, corporate lunch, or private events in seconds.
          </p>
        </motion.div>

        {/* Content Layout: Left Details, Right Active Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Grid: Contact Information details (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Hour Board card */}
            <div className="rounded-sm border border-white/5 bg-zinc-950 p-8 space-y-8 shadow-2xl">
              <h3 className="font-heading text-lg font-bold text-gold tracking-widest flex items-center space-x-3 uppercase">
                <Clock className="h-4 w-4" />
                <span>Service Hours</span>
              </h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-bold text-text-primary uppercase tracking-widest">Operating Schedule</span>
                    <span className="text-[10px] text-text-secondary font-medium tracking-wide uppercase">Kitchen Timings</span>
                  </div>
                  <span className="text-[11px] font-bold text-gold tracking-widest uppercase text-right max-w-[180px]">
                    {contactSettings.openingHours || 'Daily: 11:30 AM – 10:30 PM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Address phone info card */}
            <div className="rounded-sm border border-white/5 bg-zinc-950 p-8 space-y-8 shadow-2xl">
              <h3 className="font-heading text-lg font-bold text-gold tracking-widest flex items-center space-x-3 uppercase">
                <MapPin className="h-4 w-4" />
                <span>Our Location</span>
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-text-primary tracking-widest uppercase">{contactSettings.restaurantName || 'Mollywood Kitchen'}</p>
                    <p className="text-xs text-text-secondary font-light mt-1 leading-relaxed">
                      {contactSettings.address || 'Main Highway Road, Pirganj, Rangpur, Bangladesh'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-text-primary tracking-widest uppercase">Direct Hotline</p>
                    <p className="text-xs text-text-secondary tracking-widest mt-1 font-bold">{contactSettings.phone || '+880 1799 432582'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-text-primary tracking-widest uppercase">General Inquiry</p>
                    <p className="text-xs text-text-secondary tracking-widest mt-1">{contactSettings.email || 'info@mollywoodkitchen.com'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Interactive Google Map Link */}
            <a 
              href={contactSettings.googleMapUrl || "https://maps.google.com"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block relative rounded-sm border border-white/5 bg-zinc-950 overflow-hidden h-48 group shadow-2xl transition-all duration-500 hover:border-gold/30"
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                alt="Map Preview"
                className="h-full w-full object-cover grayscale opacity-20 transition-all duration-[2000ms] group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-40"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-10">
                <div className="relative flex h-12 w-12 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
                  <div className="h-10 w-10 bg-gold rounded-full flex items-center justify-center z-10 shadow-xl">
                    <MapPin className="h-5 w-5 text-black" />
                  </div>
                </div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-white uppercase group-hover:text-gold transition-colors">Digital Navigation</span>
              </div>
            </a>

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
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-sm border border-gold bg-zinc-950 p-10 space-y-10 text-center relative shadow-2xl"
                >
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-gold shadow-xl">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold tracking-[0.4em] text-gold uppercase">Booking Confirmed</span>
                  <h3 className="font-heading text-3xl font-black text-text-primary tracking-widest uppercase">Table Secured</h3>
                </div>

                {/* Styled Ticket layout stats */}
                <div className="grid grid-cols-2 gap-8 text-left bg-white/5 p-8 rounded-sm border border-white/10 shadow-inner">
                  <div className="space-y-1">
                    <p className="text-[9px] text-text-secondary font-bold tracking-widest uppercase">Guest Name</p>
                    <p className="text-sm font-bold text-text-primary uppercase tracking-widest">{formData.name}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] text-text-secondary font-bold tracking-widest uppercase">Reference ID</p>
                    <p className="text-sm font-black text-gold tracking-widest">{ticketNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-text-secondary font-bold tracking-widest uppercase">Scheduled Date</p>
                    <p className="text-sm font-bold text-text-primary uppercase tracking-widest">{formData.date}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] text-text-secondary font-bold tracking-widest uppercase">Arrival Time</p>
                    <p className="text-sm font-bold text-text-primary uppercase tracking-widest">{formData.time}</p>
                  </div>
                </div>

                <p className="text-xs text-text-secondary font-light max-w-sm mx-auto leading-relaxed">
                  A verification receipt with instructions has been dispatched to <span className="text-text-primary font-bold">{formData.email}</span>. Simply show this registration code upon arrival on your reservation date.
                </p>

                <button
                  onClick={() => {
                    setFormData({ name: '', phone: '', email: '', guests: 2, date: '', time: '', specialRequest: '' });
                    setSuccessTicket(false);
                  }}
                  className="text-[10px] font-bold text-text-secondary hover:text-gold uppercase tracking-[0.3em] transition-colors underline underline-offset-8 bg-transparent"
                >
                  Reserve Another Table
                </button>

              </motion.div>
            ) : (
              
              /* Default Interactive Reservation form input values */
              <motion.form 
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit} 
                className="rounded-sm border border-white/5 bg-zinc-950 p-8 sm:p-12 space-y-10 shadow-2xl"
              >
                
                <div className="flex items-center space-x-3 border-b border-white/5 pb-6">
                  <CalendarDays className="h-6 w-6 text-gold" />
                  <h3 className="font-heading text-xl font-black text-text-primary tracking-[0.2em] uppercase">Reservation Form</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  
                  {/* Name Input */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase px-1">Guest Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 text-text-primary text-xs px-5 py-4 border rounded-sm focus:outline-none placeholder:text-zinc-700 transition-all ${
                        formErrors.name ? 'border-red-500' : 'border-white/10 focus:border-gold focus:bg-white/10'
                      }`}
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase px-1">Contact Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+880"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 text-text-primary text-xs px-5 py-4 border rounded-sm focus:outline-none placeholder:text-zinc-700 transition-all ${
                        formErrors.phone ? 'border-red-500' : 'border-white/10 focus:border-gold focus:bg-white/10'
                      }`}
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase px-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 text-text-primary text-xs px-5 py-4 border rounded-sm focus:outline-none placeholder:text-zinc-700 transition-all ${
                        formErrors.email ? 'border-red-500' : 'border-white/10 focus:border-gold focus:bg-white/10'
                      }`}
                    />
                  </div>

                  {/* Guest counters preset dropdown select combo */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase px-1">Party Size</label>
                    <div className="relative">
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 text-text-primary text-xs px-5 py-4 border border-white/10 rounded-sm focus:outline-none focus:border-gold focus:bg-white/10 transition-all appearance-none uppercase tracking-widest"
                      >
                        {guestPresets.map(preset => (
                          <option key={preset} value={preset} className="bg-black">{preset} Guests</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Sliders className="h-3 w-3 text-gold" />
                      </div>
                    </div>
                  </div>

                  {/* Screening Date Picker */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase px-1">Service Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 text-text-primary text-xs px-5 py-4 border rounded-sm focus:outline-none transition-all ${
                        formErrors.date ? 'border-red-500' : 'border-white/10 focus:border-gold focus:bg-white/10'
                      }`}
                    />
                  </div>

                  {/* Show Time Slot Picker */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase px-1">Preferred Time</label>
                    <div className="relative">
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 text-text-primary text-xs px-5 py-4 border rounded-sm focus:outline-none transition-all appearance-none uppercase tracking-widest ${
                          formErrors.time ? 'border-red-500' : 'border-white/10 focus:border-gold focus:bg-white/10'
                        }`}
                      >
                        <option value="" className="bg-black">Select Period</option>
                        <option value="12:30 PM" className="bg-black">12:30 PM (Lunch)</option>
                        <option value="02:00 PM" className="bg-black">02:00 PM (Afternoon)</option>
                        <option value="06:30 PM" className="bg-black">06:30 PM (Early Dinner)</option>
                        <option value="08:00 PM" className="bg-black">08:00 PM (Prime Dinner)</option>
                        <option value="10:00 PM" className="bg-black">10:00 PM (Late Night Snack)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Clock className="h-3 w-3 text-gold" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Special Requests */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase px-1">Special Preferences</label>
                  <textarea
                    name="specialRequest"
                    rows={3}
                    placeholder="E.g. Table preference, dietary needs, or special occasions..."
                    value={formData.specialRequest}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 text-text-primary text-xs px-5 py-4 border border-white/10 rounded-sm focus:outline-none focus:border-gold focus:bg-white/10 placeholder:text-zinc-700 transition-all resize-none"
                  />
                </div>

                {/* Submit Action Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-5 rounded-sm bg-gold text-black text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl shadow-gold/10 hover:shadow-gold/20 flex items-center justify-center space-x-3 cursor-pointer"
                >
                  <CalendarDays className="h-4.5 w-4.5" />
                  <span>Finalize Reservation</span>
                </motion.button>

              </motion.form>
            )}
          </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
