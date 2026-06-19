import { MenuItem, OfferItem, ReviewItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // ==================== BENGALI MEALS (category: 'bengali') ====================
  {
    id: 'bm1',
    name: 'Plain Rice',
    price: 40,
    description: 'Perfectly fluffy steamed white aged Miniket rice, the comfort staple for all Bengali bowls.',
    rating: 4.5,
    popular: false,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Aged Miniket Rice', 'Purified Water'],
    spiceLevel: 0,
    specialty: 'Light, fluffy, and steamed fresh for every sitting.'
  },
  {
    id: 'bm2',
    name: 'Ghee Rice',
    price: 80,
    description: 'Fragrant steamed rice gently tossed with pure local grass-fed deshi ghee and sweet fried onions.',
    rating: 4.8,
    popular: true,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1626824982604-0997193dedf7?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Chinigura Rice', 'Pure Deshi Ghee', 'Crispy Mawa Onions'],
    spiceLevel: 0,
    specialty: 'The elegant golden standard of simple buttered rice.'
  },
  {
    id: 'bm3',
    name: 'Dal Fry',
    price: 60,
    description: 'Yellow split lentils tempered with scorched garlic, dried red chillies, and aromatic fresh coriander.',
    rating: 4.6,
    popular: false,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Yellow Masoor Dal', 'Sautéed Garlic', 'Dry Red Chilli', 'Coriander'],
    spiceLevel: 1,
    specialty: 'Soulful lentil comfort packed with garlic-infused warmth.'
  },
  {
    id: 'bm4',
    name: 'Mixed Vegetable',
    price: 80,
    description: 'A colorful medley of freshly harvested seasonal farm vegetables sautéed lightly with aromatic five-spice.',
    rating: 4.5,
    popular: false,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Seasonal Greens', 'Papaya', 'Carrot', 'Panch Phoron Herb Blend'],
    spiceLevel: 1,
    specialty: 'Extremely healthy and flavorful daily source of nutrition.'
  },
  {
    id: 'bm5',
    name: 'Egg Curry (2 pcs)',
    price: 100,
    description: 'Two cage-free boiler eggs hard-boiled, golden fried, and slow-simmered in a rich, warm onion gravy.',
    rating: 4.6,
    popular: false,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Boiled Eggs', 'Onion Paste', 'Tomato Wedges', 'Spicer Ginger Extract'],
    spiceLevel: 1,
    specialty: 'Classic, satisfying daily protein comfort beloved by families.'
  },
  {
    id: 'bm6',
    name: 'Chicken Bhuna',
    price: 180,
    description: 'Spring chicken cuts braised in its own juices with heavily caramelized onions, ginger root, and dry spices.',
    rating: 4.7,
    popular: false,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3e?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Fresh Chicken', 'Caramelized Onion Puree', 'Ginger Shavings', 'Bay Leaves'],
    spiceLevel: 2,
    specialty: 'Thick, flavorful homestyle gravy crafted over slow wood fire.'
  },
  {
    id: 'bm7',
    name: 'Beef Bhuna',
    price: 240,
    description: 'Tender premium local beef blocks slow-stewed and roasted with garlic cloves and homestead red chilli paste.',
    rating: 4.8,
    popular: true,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Selected local Beef', 'Red Chilli Puree', 'Garlic paste', 'Bengali Garam Masala'],
    spiceLevel: 3,
    specialty: 'A legendary masterclass in robust savory caramelized spice.'
  },
  {
    id: 'bm8',
    name: 'Beef Kala Bhuna',
    price: 280,
    description: 'Smoky, intensely roasted dark beef caramelized to perfection with Chittagong traditional Radhuni spices.',
    rating: 5.0,
    popular: true,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1603360946369-fa9902792685?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Tender aged Beef', 'Black Mustard Oil', 'Radhuni Spices', 'Toasted Onions'],
    spiceLevel: 3,
    specialty: 'Our undisputed signature centerpiece. Highly aromatic and deeply savory.'
  },
  {
    id: 'bm9',
    name: 'Rui Fish Curry',
    price: 180,
    description: 'Golden-seared fresh local Rui Carp steak slow-simmered in a rustic, comforting ginger-tomato gravy.',
    rating: 4.7,
    popular: false,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Fresh Rui Carp Steak', 'Tomato Paste', 'Turmeric Infusion', 'Green Chilli'],
    spiceLevel: 2,
    specialty: 'Traditional riverside delicacy cooked fresh daily.'
  },

  // ==================== BENGALI FAMILY COMBO (category: 'bengali') ====================
  {
    id: 'bfc1',
    name: 'Rice + Dal + Vegetable',
    price: 140,
    description: 'Comforting daily bento meal featuring Plain Rice paired with rich Dal Fry and seasonal Mixed Vegetables.',
    rating: 4.6,
    popular: false,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Miniket Plain Rice', 'Signature Dal Fry', 'Mixed Farm Vegetables'],
    spiceLevel: 1,
    specialty: 'The ultimate comforting, clean vegetarian platter.'
  },
  {
    id: 'bfc2',
    name: 'Rice + Chicken Bhuna',
    price: 220,
    description: 'Our most popular daily deal: perfectly fluffy Plain Rice paired with delicious, thick Chicken Bhuna gravy.',
    rating: 4.8,
    popular: true,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Plain Rice', 'Spiced Chicken Bhuna Portion', 'Sautéed Gravy Basis'],
    spiceLevel: 2,
    specialty: 'Delicious, fast, highly filling and packed with flavor.'
  },
  {
    id: 'bfc3',
    name: 'Rice + Beef Bhuna',
    price: 280,
    description: 'Hearty satisfying meal featuring fluffy Plain Rice combined with tender, highly flavorful Beef Bhuna.',
    rating: 4.9,
    popular: true,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Steamed Plain Rice', 'Robust Beef Bhuna Portion', 'Thick caramelized oil broth'],
    spiceLevel: 3,
    specialty: 'A heavyweight lunch favorite satisfying the deepest savory cravings.'
  },
  {
    id: 'bfc4',
    name: 'Rice + Fish Curry',
    price: 250,
    description: 'Perfect lunchtime combination of steaming Plain Rice and fresh, tender Rui Fish Curry.',
    rating: 4.7,
    popular: false,
    category: 'bengali',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Plain Rice', 'Tender Rui Fish Steak piece', 'Tangy homestyle sauce'],
    spiceLevel: 2,
    specialty: 'Clean, light, authentic Bengali meal that is perfectly spiced.'
  },

  // ==================== BIRIYANI & INDIAN (category: 'indian') ====================
  {
    id: 'bi1',
    name: 'Chicken Biriyani',
    price: 220,
    description: 'Mildly spiced, wonderfully aromatic Basmati rice layered with juicy milk-marinated chicken and a soft potato.',
    rating: 4.8,
    popular: true,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Aged Basmati Rice', 'Marinated Chicken drumstick', 'Deshi Ghee', 'Saffron drops'],
    spiceLevel: 1,
    specialty: 'Traditional recipe featuring Kolkata-style sweet and savory lightness.'
  },
  {
    id: 'bi2',
    name: 'Mutton Biriyani',
    price: 380,
    description: 'Supremely fragrant Basmati rice dum-cooked with tender, melt-in-your-mouth baby goat meat and seasoned potatoes.',
    rating: 4.9,
    popular: true,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Premium Basmati', 'Baby Mutton Cuts', 'Pure Ghee', 'Aromatic spices'],
    spiceLevel: 2,
    specialty: 'Rich, luxurious traditional recipe. A true festive delight.'
  },
  {
    id: 'bi3',
    name: 'Plain Polao',
    price: 90,
    description: 'Aromatic fine Chinigura rice steamed elegantly with sweet bay leaves, whole cardamoms, and real deshi ghee.',
    rating: 4.6,
    popular: false,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1591814468924-caf7f5823fb4?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Aromatic Chinigura Rice', 'Deshi Ghee Tint', 'Cardamom', 'Cinnamon Bark'],
    spiceLevel: 0,
    specialty: 'Exquisite herbal fragrance, light and separable grains.'
  },
  {
    id: 'bi4',
    name: 'Chicken Roast',
    price: 150,
    description: 'Crisp-fried local spring chicken quarter slow-braised in sweet sour yogurt, cashews, raisins, and onion korma.',
    rating: 4.7,
    popular: false,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1598103442097-8b743e2b95c6?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Spring Chicken Quarter', 'Sweet Homemade Yogurt', 'Cashew Paste', 'Ghee'],
    spiceLevel: 1,
    specialty: 'Authentic wedding feast classic cooked in traditional korma broth.'
  },
  {
    id: 'bi5',
    name: 'Polao + Chicken Roast',
    price: 240,
    description: 'The definitive royal celebration plate: fragrant Plain Polao served with sweet, rich Chicken Roast and korma.',
    rating: 4.9,
    popular: true,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Signature Plain Polao', 'Gourmet Chicken Roast quarter', 'Onion Beresta'],
    spiceLevel: 1,
    specialty: 'The classic Bengali feast platter, beloved across Rangpur.'
  },
  {
    id: 'bi6',
    name: 'Butter Naan',
    price: 50,
    description: 'Plump hand-stretched leavened flatbread clay-toasted inside blazing tandoor and painted with fresh melted butter.',
    rating: 4.7,
    popular: false,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Premium Flour', 'Yogurt Crust', 'Melted Dairy Butter'],
    spiceLevel: 0,
    specialty: 'Unbelievably soft and flaky flatbread with a glorious buttery shine.'
  },
  {
    id: 'bi7',
    name: 'Garlic Naan',
    price: 70,
    description: 'Leavened flatbread topped with minced garlic and coriander before baking in hot wood-fire tandoor oven.',
    rating: 4.8,
    popular: false,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Wheat Flour', 'Fresh Minced Garlic Buds', 'Finely Chopped Coriander'],
    spiceLevel: 0,
    specialty: 'Irresistibly aromatic garlic aroma designed for curry pair.'
  },
  {
    id: 'bi8',
    name: 'Tandoori Roti',
    price: 30,
    description: 'Rustic whole-wheat thin flour flatbread clay-fired over open coals, offering crisp charred edges and light bite.',
    rating: 4.5,
    popular: false,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Stone Ground Atta flour', 'Pure spring water tint'],
    spiceLevel: 0,
    specialty: 'Extremely clean recipe containing zero yeast or refined flours.'
  },

  // ==================== CURRY ITEMS (category: 'indian') ====================
  {
    id: 'ci1',
    name: 'Chicken Butter Masala',
    price: 260,
    description: 'Clay-oven charcoal-grilled chicken fillets folded into a velvety sweet and tomato-cream cashew glaze.',
    rating: 4.9,
    popular: true,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Smoky Tandoor Chicken', 'Fresh Butter Melt', 'Thick Cashew Cream', 'Tomato Glaze'],
    spiceLevel: 1,
    specialty: 'Rich, smooth, and deeply flavorful buttery curry feast.'
  },
  {
    id: 'ci2',
    name: 'Chicken Korma',
    price: 250,
    description: 'Rich sweet chicken stewed slowly in ivory gravy consisting of roasted almonds, yogurt, and sweet cardamoms.',
    rating: 4.7,
    popular: false,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Premium Chicken Cubes', 'Ground Cashews', 'Almond extract', 'White Cardamom'],
    spiceLevel: 1,
    specialty: 'The classic royal South Asian dish containing zero high heat.'
  },
  {
    id: 'ci3',
    name: 'Beef Curry',
    price: 260,
    description: 'Selected cuts of juicy beef simmered in traditional homestyle spice blend gravy with warm potato chunks.',
    rating: 4.8,
    popular: false,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Selected local Beef', 'Fresh Potato Chunks', 'Homestyle Garam Masala'],
    spiceLevel: 2,
    specialty: 'Aromatic, clean-tasting comfort beef dish prepared daily.'
  },
  {
    id: 'ci4',
    name: 'Mixed Vegetable Curry',
    price: 120,
    description: 'Selected rural vegetables slow simmered with mild cumin, turmeric, and thickened onion-cashew paste.',
    rating: 4.5,
    popular: false,
    category: 'indian',
    image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Carrot', 'Flat Beans', 'Papaya', 'Mild Indian Curry Powder'],
    spiceLevel: 1,
    specialty: 'A warm, healthy nourishing side dish paired perfectly with Butter Naan.'
  },

  // ==================== CHINESE FRIED RICE (category: 'chinese') ====================
  {
    id: 'cf1',
    name: 'Egg Fried Rice',
    price: 180,
    description: 'Fragrant wok-charred rice tossed with scrambled farm eggs, carrots, shredded cabbage, and soya reduction.',
    rating: 4.6,
    popular: false,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Egg drop', 'Fresh wok-steamed rice', 'Cabbage', 'Soy sauce'],
    spiceLevel: 0,
    specialty: 'Expertly scorched in intense high-flame wok to evoke signature wok-hei smokiness.'
  },
  {
    id: 'cf2',
    name: 'Chicken Fried Rice',
    price: 240,
    description: 'High-heat stir fried rice loaded with delicious chicken cubes, egg drops, scallions, and light seasoning.',
    rating: 4.8,
    popular: true,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Steamed wok rice', 'Chicken breast cubes', 'Farm eggs', 'Light spring onions'],
    spiceLevel: 1,
    specialty: 'An incredibly popular comforting Asian favorite loved by everyone.'
  },
  {
    id: 'cf3',
    name: 'Mixed Fried Rice',
    price: 320,
    description: 'Ultimate wok-hei rice combined with chicken chunks, tender beef slivers, eggs, and crisp diced carrots.',
    rating: 4.9,
    popular: false,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Rice', 'Beef Slivers', 'Chicken Shreds', 'Green Onions', 'Oyster seasoning'],
    spiceLevel: 1,
    specialty: 'Fabulous combination plate satisfying all culinary preferences.'
  },

  // ==================== CHOW MEIN (category: 'chinese') ====================
  {
    id: 'cm1',
    name: 'Vegetable Chow Mein',
    price: 180,
    description: 'Wok-charred wheat noodles combined with crunchy cabbage, julienned carrots, capsicums, and ginger.',
    rating: 4.6,
    popular: false,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Classic Wheat Noodles', 'Cabbage Strings', 'Carrot Ribbons', 'Capsicum'],
    spiceLevel: 1,
    specialty: 'Extremely clean, light flavor with perfect crunch of garden fresh vegetables.'
  },
  {
    id: 'cm2',
    name: 'Chicken Chow Mein',
    price: 240,
    description: 'Comforting wok-tossed egg noodles featuring chicken breast slices, carrots, and sweet light soya sauce.',
    rating: 4.8,
    popular: true,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Noodles', 'Spiced Chicken breast slivers', 'Shredded cabbage', 'White pepper'],
    spiceLevel: 1,
    specialty: 'A fantastic sweet-savory noodles platter that is perfect for sharing.'
  },
  {
    id: 'cm3',
    name: 'Mixed Chow Mein',
    price: 320,
    description: 'Supreme combo noodles loaded with sliced beef, chicken slivers, scrambles eggs, and fresh bell peppers.',
    rating: 4.9,
    popular: false,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Flaky Noodles', 'Beef blocks', 'Chicken chunks', 'Chilli oil', 'Zesty sauce'],
    spiceLevel: 1,
    specialty: 'The definitive champion of satisfying heavy Chinese noodles dishes.'
  },

  // ==================== CHINESE SIDE ITEMS (category: 'chinese') ====================
  {
    id: 'cs1',
    name: 'Chicken Vegetable',
    price: 240,
    description: 'Mouth-watering chicken strips lightly coated and stir fried with premium greens in dynamic garlic glaze.',
    rating: 4.7,
    popular: false,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Chicken Breast strips', 'Cabbage', 'Carrots', 'Garlic paste', 'Water chestnut extract'],
    spiceLevel: 1,
    specialty: 'Remarkably clean, mild ginger-garlic broth.'
  },
  {
    id: 'cs2',
    name: 'Chicken Fry (2 pcs)',
    price: 180,
    description: 'Two thick crispy bone-in chicken thighs double-battered in rich local spices and fried till standard gold.',
    rating: 4.7,
    popular: false,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Bone-in Chicken Legs', 'Battering spice dusting', 'Refined frying oil'],
    spiceLevel: 1,
    specialty: 'Extremely crunchy crunch sealing beautifully tender chicken flesh.'
  },
  {
    id: 'cs3',
    name: 'Chili Chicken',
    price: 280,
    description: 'Juicy chicken cubes sautéed with abundance of fiery green chillies, sliced bulb onions, and bell peppers.',
    rating: 4.8,
    popular: true,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Chicken pieces', 'Green Chilli wheels', 'Bulb onion slides', 'Spicy soy sauce'],
    spiceLevel: 3,
    specialty: 'Indo-Chinese classic favorite featuring a majestic kick of raw green capsicum and chillies.'
  },
  {
    id: 'cs4',
    name: 'Thai Soup',
    price: 220,
    description: 'A comforting, mildly sweet and sour spicy broth infused with zesty lemongrass stalks and fresh chicken pieces.',
    rating: 4.7,
    popular: false,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Chicken soup broth', 'Lemongrass stalks', 'Lime leaves', 'Galangal zest'],
    spiceLevel: 2,
    specialty: 'Extremely aromatic soup that warm-starts any winter group dinner.'
  },

  // ==================== SET MENU (category: 'chinese') ====================
  {
    id: 'set1',
    name: 'Set Menu A',
    price: 320,
    description: 'Delicious personal combo: Chicken Fried Rice, Chicken Vegetable, and standard Soft Drink.',
    rating: 4.8,
    popular: true,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Chicken Fried Rice Portion', 'Chicken Vegetable Portion', 'Chilled Soft Drink'],
    spiceLevel: 1,
    specialty: 'Our highest selling value-packed personal combo.'
  },
  {
    id: 'set2',
    name: 'Set Menu B',
    price: 380,
    description: 'A fantastic pairing of Chicken Chow Mein noodles, spicy Chili Chicken, and chilled Soft Drink.',
    rating: 4.8,
    popular: true,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Chicken Chow Mein portion', 'Chili Chicken portion', 'Cold Carbonated Drink'],
    spiceLevel: 2,
    specialty: 'Satisfying noodle platter combined with rich spicy chicken glaze.'
  },
  {
    id: 'set3',
    name: 'Family Set (2 Persons)',
    price: 650,
    description: 'Full sharing platter: Chicken Fried Rice, Chicken Vegetable, 2 pieces of Chicken Fry, and 2 Soft Drinks.',
    rating: 4.9,
    popular: true,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Chicken Fried Rice for two', 'Chicken Vegetable', '2 Golden Chicken Frys', '2 Soft Drinks'],
    spiceLevel: 1,
    specialty: 'The ultimate culinary package for family dinner dates.'
  },

  // ==================== SNACKS (category: 'snacks-beverages') ====================
  {
    id: 'sn1',
    name: 'French Fries',
    price: 120,
    description: 'Skin-off fresh hand-cut premium golden potatoes, crispy fried and salted to absolute perfection.',
    rating: 4.5,
    popular: false,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Premium skinless Potato', 'Pure Salt Dusting'],
    spiceLevel: 0,
    specialty: 'Instantly fried crisp to offer glass-shattering crunch.'
  },
  {
    id: 'sn2',
    name: 'Chicken Nuggets (6 pcs)',
    price: 180,
    description: 'Six bits of tender minced breast chicken, herbed lightly, breaded in panko, and golden crisped.',
    rating: 4.7,
    popular: false,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Minced Breast Chicken', 'Crisp crumbs', 'Ranch seasoning'],
    spiceLevel: 0,
    specialty: 'Bite-sized, tender golden treat paired with tasty sauce.'
  },
  {
    id: 'sn3',
    name: 'Chicken Wings (4 pcs)',
    price: 220,
    description: 'Four juicy chicken wings fire-glazed in standard sweet and spicy chili marinade.',
    rating: 4.8,
    popular: true,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Fresh Chicken Wings', 'Sticky Honey Chilli marinade', 'Garlic paste'],
    spiceLevel: 2,
    specialty: 'Bursting with sweet, tangy, and standard spicy fire-roasted skin.'
  },
  {
    id: 'sn4',
    name: 'Chicken Popcorn',
    price: 180,
    description: 'Delicious snack balls of herbed boneless chicken, extra battered and crispy fried.',
    rating: 4.7,
    popular: false,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Boneless Chicken bits', 'Spicy batter coating', 'Seasoning salt'],
    spiceLevel: 1,
    specialty: 'Perfect crunch companion for family evening conversations.'
  },

  // ==================== DESSERTS (category: 'snacks-beverages') ====================
  {
    id: 'de1',
    name: 'Firni',
    price: 80,
    description: 'Sweet ground rice pudding slow-simmered in milk, flavored with cardamoms and garnished with pistachios.',
    rating: 4.8,
    popular: false,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1505253501746-cf33852b33cb?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Chinigura Rice grounds', 'Condensed cow milk', 'Pistachios', 'Cardamom zest'],
    spiceLevel: 0,
    specialty: 'Served cold in clay cups to maintain earthy Bengali heritage aroma.'
  },
  {
    id: 'de2',
    name: 'Sweet Curd',
    price: 90,
    description: 'Authentic Bogra-style caramelized red sweet yogurt, painstakingly slow-fermented in earthen bowls.',
    rating: 4.9,
    popular: true,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Threw-cooked Milk fat', 'Wild yogurt culture bases', 'Caramelized sugar syrup'],
    spiceLevel: 0,
    specialty: 'The classic Bengali standard. Silky, rich and perfectly sweet.'
  },
  {
    id: 'de3',
    name: 'Ice Cream',
    price: 60,
    description: 'Scoops of premium velvety Italian vanilla or dark chocolate gelato made with fresh cream.',
    rating: 4.7,
    popular: false,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Fresh Cow Cream', 'Vanilla pods / Dark cocoa dust'],
    spiceLevel: 0,
    specialty: 'Unbelievably rich and smooth, the ultimate palate cooler.'
  },


  // ==================== MOJITO (NON-ALCOHOLIC) (category: 'snacks-beverages') ====================
  {
    id: 'mj1',
    name: 'Classic Mint Mojito',
    price: 120,
    description: 'Refreshing muddled fresh mint leaves, lime wheels, sparkling soda, and sweet cane syrup.',
    rating: 4.8,
    popular: true,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Fresh Mint Leaves', 'Key lime wheels', 'Carbonated soda', 'Cane syrup'],
    spiceLevel: 0,
    specialty: 'The definitive refreshing crown helper after warm dinners.'
  },
  {
    id: 'mj2',
    name: 'Blue Lagoon Mojito',
    price: 150,
    description: 'Vibrant blue double-chilled mocktail with Curacao flavor notes, lime slices, mint, and soda.',
    rating: 4.9,
    popular: true,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Blue mocktail solution', 'Mint leaves', 'Sparkling carbonation', 'Syrup'],
    spiceLevel: 0,
    specialty: 'An aesthetically gorgeous, citrusy deep-blue beverage centerpiece.'
  },
  {
    id: 'mj3',
    name: 'Green Apple Mojito',
    price: 150,
    description: 'Zesty sour and sweet mocktail layered with sour green apple extracts, fresh mint, and soda.',
    rating: 4.8,
    popular: false,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Sour green apple extract', 'Mint', 'Lime', 'Carbonated fizzy water'],
    spiceLevel: 0,
    specialty: 'Beautiful, sharp sweet-sour balance.'
  },

  // ==================== TEA & COFFEE (category: 'snacks-beverages') ====================
  {
    id: 'tc1',
    name: 'Tea',
    price: 35,
    description: 'Hot fragrant comforting milk tea cooked with sweet milk and cardamom pod.',
    rating: 4.8,
    popular: true,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Sylhet tea leaves', 'Condensed milk', 'Cardamom seed'],
    spiceLevel: 0,
    specialty: 'The classic daily sweet warm fuel loved across the country.'
  },
  {
    id: 'tc2',
    name: 'Regular Coffee',
    price: 80,
    description: 'Rich warm cup of freshly roasted Arabica bean espresso shots folded with hot milk froth.',
    rating: 4.7,
    popular: false,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Double Arabica bean shots', 'Slight cow milk powder'],
    spiceLevel: 0,
    specialty: 'Perfect daily sweet fuel to elevate your thoughts.'
  },
  {
    id: 'tc3',
    name: 'Black Coffee',
    price: 70,
    description: 'Freshly brewed aromatic rich black coffee made with premium dark roasted Arabica beans.',
    rating: 4.6,
    popular: false,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Dark roast Arabica beans', 'Pure hot water'],
    spiceLevel: 0,
    specialty: 'Strong, bold and energetic morning or evening pick-me-up.'
  },
  {
    id: 'tc4',
    name: 'Cappuccino',
    price: 140,
    description: 'Premium hot espresso containing equal proportions of steaming milk, foam, and cocoa dust.',
    rating: 4.9,
    popular: true,
    category: 'snacks-beverages',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Aged Arabica shots', 'Velvety dense hot milk foam', 'Belgian cocoa sparkles'],
    spiceLevel: 0,
    specialty: 'Beautiful, thick gourmet froth art.'
  }
];

export const OFFERS_DATA: OfferItem[] = [
  {
    id: 'o1',
    title: "Today's Special Combo Deal",
    tagline: "Owner's Signature Special - Free Appetizer",
    discount: "FREE APPETIZER INCLUDED",
    description: "Purchase our signature Mutton Biriyani or Beef Kala Bhuna and receive a complimentary portion of Ghee Rice or French Fries.",
    badge: "Limited Quantities Available",
    category: 'today',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
    code: "FREEAPP"
  },
  {
    id: 'o2',
    title: "The Weekend Family Feast",
    tagline: "Unwind with the ultimate delicious feast",
    discount: "20% OFF ALL ORDERS",
    description: "Gather with friends or family. Get instant 20% discount on any à la carte food order above ৳1,500. Applicable on Friday, Saturday, and Sunday nights.",
    badge: "Weekend Prime Time",
    category: 'weekend',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    code: "MOLLYWEEKEND"
  },
  {
    id: 'o3',
    title: "The Gourmet Solo Combo",
    tagline: "The perfect companion pack for your solo cravings",
    discount: "SPECIAL PRICE: ৳590",
    description: "Indulge in a premium combo featuring our delicious Beef Kala Bhuna, paired with a chilled Mango Juice, and finished with delicious Sweet Curd.",
    badge: "Best Value Solo",
    category: 'combo',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
    code: "SOLOPACK"
  },
  {
    id: 'o4',
    title: "The Grand Family Feast",
    tagline: "For groups of 4 hungry foodies",
    discount: "SAVE ৳1,200 ON FAMILY PASS",
    description: "The complete dining layout! Includes 2 Starters, 4 Main Course dishes of your choice, sweet dessert pairings, plus unlimited Soft Drinks or Tea for 4 guests.",
    badge: "Sells out fast!",
    category: 'family',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=600',
    code: "FAMILYFEAST"
  },
  {
    id: 'o5',
    title: "The Student Pocket Saver",
    tagline: "Show your student card to claim budget rates",
    discount: "15% OFF ALL NOODLES & SNACKS",
    description: "Take a break from classes! Get an extra 15% discount on all chicken wings, French fries, or Mango Juice combinations. Bring your school student card.",
    badge: "Student ID Required",
    category: 'student',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    code: "CAMPUS15"
  }
];

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 'r1',
    name: 'Kabir Sen',
    role: 'Founder, Bengal Culinary Critic',
    rating: 5,
    content: "An absolute stunning masterpiece of taste! The Mutton Biriyani was a brilliant symphony of spice, and the warm, golden lighting creates a wonderfully cozy atmosphere that feels extremely welcoming for a dynamic family dinner.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'r2',
    name: 'Ananya Roy',
    role: 'Rangpur Local Resident',
    rating: 5,
    content: "Mollywood Kitchen has completely redefined dining in Pirganj. Their elegant design, the beautiful welcoming atmosphere, and the signature 'Chicken Butter Masala' are spectacular. It is a premium, delicious dining experience in every single bite.",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'r3',
    name: 'Marcus Sterling',
    role: 'Gourmet Food Vlogger / Globetrotter',
    rating: 5,
    content: "The attention to detail is jaw-dropping. The Mango Juice is the perfect sweet touch to an incredible beef kala bhuna meal. The beautiful golden lighting creates a warm, clean, and welcoming mood that is hard to forget.",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'r4',
    name: 'Priyanka Das',
    role: 'Local High School Teacher',
    rating: 5,
    content: "We hosted our family gathering here and everyone was delighted. The Rui Fish Curry was exceptionally tender and the spice levels were beautifully balanced. This is the absolute best restaurant in Pirganj!",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'g1',
    title: 'The Tandoori Hearth',
    subtitle: 'Clay kiln heat with mesquite wood fire smoky glow.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'g2',
    title: 'Precision Crafting',
    subtitle: 'Wok-tossing at 400 degrees to capture wok-hei flavor.',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'g3',
    title: 'The Family Dining Hall',
    subtitle: 'Glimmering warm highlights, spacious family seating, and clean cozy dining.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'g4',
    title: 'The Refreshing Juice Counter',
    subtitle: 'Freshly squeezed seasonal fruit juices, cold mocktails, and traditional lassi.',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=600'
  }
];
