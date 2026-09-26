import { MenuItem, OfferItem, ReviewItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // CATEGORY 1: Snacks (BDT 20 each)
  {
    id: 'sn1',
    name: 'Alur Chop',
    price: 20,
    description: 'Crispy golden potato croquettes infused with roasted cumin, green chillies, and secret street aromatics.',
    popular: true,
    category: 'snacks',
    image: 'https://i.ibb.co/G3pCVbCm/alur-chop.jpg',
    ingredients: ['Boiled Farm Potatoes', 'Roasted Cumin & Coriander', 'Fresh Green Chillies', 'Crisp Gram Flour Batter', 'Mustard Oil'],
    spiceLevel: 2,
    specialty: 'Handcrafted fresh daily at Koloni Bazar with our authentic crunch batter.',
    preparation: 'Fresh local potatoes are boiled to tenderness, gently mashed by hand with caramelized onions, roasted dry spices, and fresh herbs, then dipped in seasoned chickpea batter and deep-fried to golden perfection.',
    nutrition: { calories: '140 kcal', portion: '1 piece (80g)', prepTime: 'Fresh on order / 5 mins' },
    tags: ['Crispy', 'Street Classic', 'Vegetarian', 'Fresh Daily']
  },
  {
    id: 'sn2',
    name: 'Piyaju',
    price: 20,
    description: 'Crunchy red lentil and sweet onion fritters fried until deep golden and shatteringly crisp.',
    popular: true,
    category: 'snacks',
    image: 'https://i.ibb.co/84xkRGQK/peyaju.jpg',
    ingredients: ['Coarsely Ground Musur Dal', 'Sliced Red Onions', 'Finely Chopped Green Chillies', 'Ginger-Garlic Paste', 'Fresh Coriander'],
    spiceLevel: 2,
    specialty: 'The classic evening crunch companion, best enjoyed hot with masala cha.',
    preparation: 'Soaked red lentils are coarsely crushed to preserve texture, folded with thinly sliced mountain onions and hand-rubbed spices, then dropped in small dollops into boiling oil for maximum crunch.',
    nutrition: { calories: '120 kcal', portion: '1 serving (4 pcs)', prepTime: '3 mins' },
    tags: ['Crunchy', 'High Protein', 'Tea-Time Pick', 'Vegetarian']
  },
  {
    id: 'sn3',
    name: 'Chotpoti',
    price: 20,
    description: 'Tangy and spiced yellow pea delicacy topped with grated boiled egg, crisp fuchka bits, and tamarind drizzle.',
    popular: true,
    category: 'snacks',
    image: 'https://i.ibb.co/HDR3F1TH/Chotpoti.jpg',
    ingredients: ['Slow-simmered Yellow Peas (Dabli)', 'Spicy-Sour Tamarind Tok', 'Grated Boiled Egg', 'Crushed Crispy Fuchka', 'Roasted Cumin Powder'],
    spiceLevel: 3,
    specialty: 'Signature tangy tamarind profile crafted with aged mountain spices.',
    preparation: 'Yellow whole peas are slow-simmered until tender in a fragrant broth of roasted cumin, dry red chilies, and bay leaves. Served warm with zesty tamarind reduction, fresh cucumber, and crisp wafers.',
    nutrition: { calories: '180 kcal', portion: '1 bowl (180g)', prepTime: 'Ready to serve' },
    tags: ['Tangy', 'Street Legend', 'Spicy', 'Chef Special']
  },
  {
    id: 'sn4',
    name: 'Dim er Chop',
    price: 20,
    description: 'Rich hard-boiled farm egg encased in savory spiced potato crust and crisp breadcrumb shell.',
    popular: false,
    category: 'snacks',
    image: 'https://i.ibb.co/23wGdjyL/Dim-er-chop.jpg',
    ingredients: ['Farm Fresh Egg', 'Spiced Potato Mash', 'Crisp Toasted Crumbs', 'Garam Masala', 'Fresh Herbs'],
    spiceLevel: 1,
    specialty: 'Decadent dual-texture snack with a soft egg center and crunchy exterior.',
    preparation: 'Half hard-boiled egg is lovingly wrapped in velvety spiced potato dough, rolled in golden breadcrumbs, and fried until the crust turns bronze and crunchy.',
    nutrition: { calories: '190 kcal', portion: '1 piece (100g)', prepTime: '4 mins' },
    tags: ['Protein Rich', 'Comfort Food', 'Golden Crust']
  },
  {
    id: 'sn5',
    name: 'Luchi Alur Dom',
    price: 20,
    description: 'Puffy, pillow-soft golden luchi served alongside slow-braised aromatic baby potato curry.',
    popular: true,
    category: 'snacks',
    image: 'https://i.ibb.co/vxg7BJHt/luchi-alur-dom.jpg',
    ingredients: ['Refined Flour (Maida)', 'Pure Ghee Touched Dough', 'Baby Potatoes', 'Rich Tomato-Ginger Gravy', 'Panch Phoron'],
    spiceLevel: 2,
    specialty: 'Timeless Bengali morning & evening soul food cooked in rich home-style gravy.',
    preparation: 'Fine flour dough is rested, rolled paper-thin, and flashed in pure hot oil until it balloons into a delicate puff. Paired with slow-cooked potatoes in a spiced tomato-cumin reduction.',
    nutrition: { calories: '260 kcal', portion: '2 Luchis + Bowl of Alur Dom', prepTime: '6 mins' },
    tags: ['Traditional', 'Puffy Luchi', 'Vegetarian', 'Must Try']
  },

  // CATEGORY 2: Fast Food
  {
    id: 'ff1',
    name: 'Chowmein / Noodles',
    price: 50,
    description: 'High-heat wok-tossed egg noodles loaded with crisp shredded cabbage, carrots, eggs, and savoury house sauce.',
    popular: true,
    category: 'fast-food',
    image: 'https://i.ibb.co/Lzz2hkPQ/Chowmein.jpg',
    ingredients: ['Fresh Egg Noodles', 'Shredded Cabbage & Bell Peppers', 'Scrambled Egg', 'Dark Soy & Secret Mollywood Sauce', 'Spring Onion'],
    spiceLevel: 2,
    specialty: 'Smoky street wok flavor with crunchy garden vegetables.',
    preparation: 'Steamed noodles are tossed in a scorching hot Chinese wok with shredded crisp vegetables, eggs, and our signature savory umami glaze, finished with freshly ground black pepper.',
    nutrition: { calories: '320 kcal', portion: '1 full plate', prepTime: '7 mins' },
    tags: ['Wok Tossed', 'Savoury', 'Local Fusion', 'Best Seller']
  },
  {
    id: 'ff2',
    name: 'Sandwich',
    price: 50,
    description: 'Golden-toasted club bread layered with seasoned chicken shreds, creamy sauce, and crisp crunchy greens.',
    popular: false,
    category: 'fast-food',
    image: 'https://i.ibb.co/pBN5kvLL/sandwich.jpg',
    ingredients: ['Soft Bakery Toast Bread', 'Herbed Chicken Filling', 'Creamy Mayonnaise', 'Crisp Cucumber & Tomato', 'Black Pepper'],
    spiceLevel: 1,
    specialty: 'Freshly pressed on order for that warm, crisp crust and creamy bite.',
    preparation: 'Layers of fresh soft bread are filled with shredded herb-roasted chicken breast, house garlic emulsion, and garden vegetables, then lightly grilled to golden satisfaction.',
    nutrition: { calories: '290 kcal', portion: '2 triangular halves', prepTime: '5 mins' },
    tags: ['Grilled', 'Fresh & Light', 'Protein Bite']
  },
  {
    id: 'ff3',
    name: 'Burger',
    price: 50,
    description: 'Juicy spiced patty nestled inside a soft toasted bun with caramelized onions, tangy sauce, and fresh salad.',
    popular: true,
    category: 'fast-food',
    image: 'https://i.ibb.co/Gv61txST/Burgers.jpg',
    ingredients: ['Toasted Sesame Bun', 'Spiced Minced Patty', 'Caramelized Sweet Onions', 'Mollywood Secret Burger Sauce', 'Crunchy Lettuce'],
    spiceLevel: 2,
    specialty: 'Street-style comfort burger with generous savory punch and soft melt-in-mouth buns.',
    preparation: 'A seasoned ground patty is pan-seared until juicy, layered on warm toasted buns with shredded greens, tangy tomato reduction, and creamy house burger sauce.',
    nutrition: { calories: '380 kcal', portion: '1 whole burger', prepTime: '8 mins' },
    tags: ['Juicy', 'Street Favorite', 'Filling', 'Top Pick']
  },
  {
    id: 'ff4',
    name: 'Chicken Roll',
    price: 30,
    description: 'Tender spiced chicken cubes and sautéed onions wrapped tight inside a flaky, golden layered paratha.',
    popular: true,
    category: 'fast-food',
    image: 'https://i.ibb.co/8qFF2cz/cheiken-roll.jpg',
    ingredients: ['Handmade Crispy Paratha', 'Marinated Tawa Chicken', 'Pickled Red Onions', 'Green Chilli Lime Dressing', 'Chat Masala'],
    spiceLevel: 2,
    specialty: 'The quintessential street wrap loaded with smoky chicken and tangy lime kick.',
    preparation: 'Diced chicken is flash-cooked on a heavy tawa with ginger, garlic, and chaat spices, then rolled into a freshly fried layered paratha with thinly sliced crunchy onions and zesty green sauce.',
    nutrition: { calories: '310 kcal', portion: '1 wrap roll', prepTime: '5 mins' },
    tags: ['Flaky Paratha', 'Tawa Spiced', 'Grab & Go', 'Fan Favorite']
  },

  // CATEGORY 3: Rice & Set Menu
  {
    id: 'rs1',
    name: 'Set Menu 1',
    price: 250,
    description: 'Aromatic Chinese-style egg & vegetable Fried Rice paired with tender, intensely spiced Bengali Beef Bhuna.',
    popular: true,
    category: 'rice-set-menu',
    image: 'https://i.ibb.co/ZpFzw9rs/Set-Menu-1.jpg',
    ingredients: ['Chinigura Rice Fried Rice', 'Slow-cooked Beef Chunks', 'Caramelized Onion Gravy', 'Egg & Mixed Veggies', 'Salad'],
    spiceLevel: 3,
    specialty: 'Our grand flagship set — the ultimate fusion of fragrant fried rice and dark rich beef bhuna.',
    preparation: 'Aromatic Chinigura rice is wok-fried with fluffy scrambled eggs and crisp vegetables. Served alongside slow-simmered tender beef caramelized with garlic, cinnamon, cardamom, and mountain chillies.',
    nutrition: { calories: '650 kcal', portion: 'Full Platter (Rice + Beef + Salad)', prepTime: '10 mins' },
    tags: ['Grand Platter', 'Tender Beef', 'Chef Signature', 'Heavy Meal']
  },
  {
    id: 'rs2',
    name: 'Set Menu 2',
    price: 120,
    description: 'Fragrant egg Fried Rice served with a juicy, herb-seasoned crispy roasted Chicken Leg Piece and salad.',
    popular: true,
    category: 'rice-set-menu',
    image: 'https://i.ibb.co/F4xCMPT6/Set-Menu-2.jpg',
    ingredients: ['Wok Fried Rice', 'Whole Chicken Leg Piece', 'Special Tawa Roast Glaze', 'Fresh Cucumber & Tomato Salad'],
    spiceLevel: 2,
    specialty: 'Pocket-friendly student & foodie feast with generous protein and aroma.',
    preparation: 'Tender chicken whole leg is marinated overnight in lemon juice, garlic paste, and roasted spice blend, seared to juicy perfection, and served over a steaming mountain of vegetable egg fried rice.',
    nutrition: { calories: '540 kcal', portion: 'Full Platter (Rice + Chicken Leg + Salad)', prepTime: '8 mins' },
    tags: ['Best Value', 'Whole Leg', 'Popular Combo', 'Daily Feast']
  },
  {
    id: 'rs3',
    name: 'Set Menu 3',
    price: 140,
    description: 'Special Rice Combo featuring aromatic wok-fried rice, savory Chinese-style chicken curry, and fresh salad.',
    popular: false,
    category: 'rice-set-menu',
    image: 'https://i.ibb.co/yn2R7rnJ/Set-Menu-3.jpg',
    ingredients: ['Aromatic Fried Rice', 'Sliced Chicken & Capsicum Gravy', 'Scrambled Egg', 'Fresh Salad Garnish'],
    spiceLevel: 2,
    specialty: 'Balanced everyday lunch or dinner combo with light savory sauce and fluffy rice.',
    preparation: 'Tender boneless chicken strips are simmered in a light capsicum and onion savory glaze, plated with wok-tossed egg fried rice and fresh cucumber slices.',
    nutrition: { calories: '490 kcal', portion: 'Full Platter (Rice + Chicken Curry + Salad)', prepTime: '8 mins' },
    tags: ['Everyday Special', 'Balanced Meal', 'Savoury Gravy']
  }
];

export const OFFERS_DATA: OfferItem[] = [];
export const REVIEWS_DATA: ReviewItem[] = [];
export const GALLERY_ITEMS: any[] = [];
