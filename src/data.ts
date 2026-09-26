import { MenuItem, OfferItem, ReviewItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // CATEGORY 1: Snacks
  {
    id: 'sn1',
    name: 'Alur Chop',
    price: 20,
    description: 'Crispy and savory potato fritters with authentic spices.',
    popular: true,
    category: 'snacks',
    image: 'https://i.ibb.co/G3pCVbCm/alur-chop.jpg'
  },
  {
    id: 'sn2',
    name: 'Piyaju',
    price: 20,
    description: 'Crunchy lentil and onion fritters, a perfect tea-time snack.',
    popular: true,
    category: 'snacks',
    image: 'https://i.ibb.co/84xkRGQK/peyaju.jpg'
  },
  {
    id: 'sn3',
    name: 'Chotpoti',
    price: 20,
    description: 'Tangy and spicy street-style chickpea snack.',
    popular: true,
    category: 'snacks',
    image: 'https://i.ibb.co/HDR3F1TH/Chotpoti.jpg'
  },
  {
    id: 'sn4',
    name: 'Dim er Chop',
    price: 20,
    description: 'Flavorful egg and potato croquettes coated in crispy crumbs.',
    popular: false,
    category: 'snacks',
    image: 'https://i.ibb.co/23wGdjyL/Dim-er-chop.jpg'
  },
  {
    id: 'sn5',
    name: 'Luchi Alur Dom',
    price: 20,
    description: 'Fluffy fried bread served with delicious spiced potato curry.',
    popular: true,
    category: 'snacks',
    image: 'https://i.ibb.co/vxg7BJHt/luchi-alur-dom.jpg'
  },
  
  // CATEGORY 2: Fast Food
  {
    id: 'ff1',
    name: 'Chowmein / Noodles',
    price: 50,
    description: 'Wok-tossed noodles with fresh veggies and savory sauce.',
    popular: true,
    category: 'fast-food',
    image: 'https://i.ibb.co/Lzz2hkPQ/Chowmein.jpg'
  },
  {
    id: 'ff2',
    name: 'Sandwich',
    price: 50,
    description: 'Freshly made sandwich packed with delicious fillings.',
    popular: false,
    category: 'fast-food',
    image: 'https://i.ibb.co/pBN5kvLL/sandwich.jpg'
  },
  {
    id: 'ff3',
    name: 'Burger',
    price: 50,
    description: 'Juicy and flavorful burger with fresh buns and sauce.',
    popular: true,
    category: 'fast-food',
    image: 'https://i.ibb.co/Gv61txST/Burgers.jpg'
  },
  {
    id: 'ff4',
    name: 'Chicken Roll',
    price: 30,
    description: 'Spiced chicken bits wrapped in a crispy flaky paratha.',
    popular: true,
    category: 'fast-food',
    image: 'https://i.ibb.co/8qFF2cz/cheiken-roll.jpg'
  },
  
  // CATEGORY 3: Rice & Set Menu
  {
    id: 'rs1',
    name: 'Set Menu 1',
    price: 250,
    description: 'Fried Rice & Beef Bhuna.',
    popular: true,
    category: 'rice-set-menu',
    image: 'https://i.ibb.co/ZpFzw9rs/Set-Menu-1.jpg'
  },
  {
    id: 'rs2',
    name: 'Set Menu 2',
    price: 120,
    description: 'Chicken Fried Rice & Leg Piece.',
    popular: true,
    category: 'rice-set-menu',
    image: 'https://i.ibb.co/F4xCMPT6/Set-Menu-2.jpg'
  },
  {
    id: 'rs3',
    name: 'Set Menu 3',
    price: 140,
    description: 'Special Rice Combo.',
    popular: false,
    category: 'rice-set-menu',
    image: 'https://i.ibb.co/yn2R7rnJ/Set-Menu-3.jpg'
  }
];

export const OFFERS_DATA: OfferItem[] = [];
export const REVIEWS_DATA: ReviewItem[] = [];
export const GALLERY_ITEMS: any[] = [];
