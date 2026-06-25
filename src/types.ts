export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  rating: number;
  popular: boolean;
  category: 'bengali' | 'indian' | 'chinese' | 'snacks-beverages';
  image: string;
  ingredients: string[];
  spiceLevel: number; // 0 = none, 1 = mild, 2 = medium, 3 = spicy
  specialty: string;
  is_special?: boolean;
}

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  category?: 'student' | 'family' | 'birthday' | 'first';
  image: string;
  code: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
  showOnHome?: boolean;
  originalPrice?: number;
  offerPrice?: number;
  includedItems?: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  content: string;
  avatar: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  spiceLevel: number;
}

export interface Reservation {
  name: string;
  phone: string;
  email: string;
  guests: number;
  date: string;
  time: string;
  specialRequest?: string;
}
