export type CoffeeMenuCategory =
  | 'Bistro Dining'
  | 'Café Craft'
  | 'Signature Cocktails'
  | 'Pastries & Bakery'
  | 'Artisan Desserts';

export type CoffeeMenuTag = 'Trending' | 'Seasonal' | 'New' | 'Popular' | 'Limited';

export interface CoffeeMenuItem {
  id: string;
  category: CoffeeMenuCategory;
  name: string;
  description: string;
  calories: number;
  price: number;
  rating: number;
  ingredients: string[];
  pairings: string[];
  tags: CoffeeMenuTag[];
  image: string;
}

function img(prompt: string, imageSize: string) {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt
  )}&image_size=${imageSize}`;
}

export const coffeeMenuCategories: CoffeeMenuCategory[] = [
  'Bistro Dining',
  'Café Craft',
  'Signature Cocktails',
  'Pastries & Bakery',
  'Artisan Desserts',
];

export const coffeeMenuItems: CoffeeMenuItem[] = [
  {
    id: 'bistro-steak',
    category: 'Bistro Dining',
    name: 'Aged Angus Bistro Steak',
    description: 'Prime cut flat iron steak, herb compound butter, charred asparagus, micro-greens.',
    calories: 680,
    price: 24.5,
    rating: 4.9,
    ingredients: ['Angus beef steak', 'Garlic herb butter', 'Organic asparagus'],
    pairings: ['Yuzu Citrus Sparkler', 'Dark Chocolate Tart'],
    tags: ['Popular', 'Trending'],
    image: img(
      'ultra realistic gourmet pan seared ribeye steak on dark stoneware plate, herb butter melting on top, rosemary sprig, asparagus spears, warm cinematic lighting, 8k food photography',
      'portrait_4_3'
    ),
  },
  {
    id: 'lemon-seabass',
    category: 'Bistro Dining',
    name: 'Wild Saffron Seabass',
    description: 'Pan-seared sea bass filet, saffron-infused lemon reduction, wilted organic greens.',
    calories: 450,
    price: 22.0,
    rating: 4.8,
    ingredients: ['Wild-caught sea bass', 'Saffron lemon sauce', 'Baby spinach'],
    pairings: ['Strawberry Basil Craft', 'Vanilla Bean Cheesecake'],
    tags: ['New'],
    image: img(
      'ultra realistic pan seared sea bass filet, saffron yellow cream sauce drizzle, elegant white plate plating, fine dining restaurant atmosphere, 8k food photography',
      'portrait_4_3'
    ),
  },
  {
    id: 'truffle-egg-sandwich',
    category: 'Bistro Dining',
    name: 'Truffle Scramble Brioche',
    description: 'Silky soft-scrambled organic eggs, double truffle butter, fresh chives, warm brioche.',
    calories: 540,
    price: 11.5,
    rating: 4.8,
    ingredients: ['Organic eggs', 'Truffle oil', 'Cultured butter', 'Brioche bun'],
    pairings: ['Reserve Espresso', 'Nitro Craft Brew'],
    tags: ['Popular'],
    image: img(
      'ultra realistic truffle egg sandwich on brioche, delicate scramble, dark ceramic plate, warm cafe lighting, premium food photography, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'roast-chicken-aioli',
    category: 'Bistro Dining',
    name: 'Rosemary Roast Chicken Ciabatta',
    description: 'Herb-marinated roasted chicken breast, lemon garlic aioli, baby arugula on toasted ciabatta.',
    calories: 610,
    price: 13.8,
    rating: 4.7,
    ingredients: ['Roasted chicken breast', 'Ciabatta bread', 'Lemon aioli', 'Arugula'],
    pairings: ['Yuzu Citrus Sparkler', 'Atelier Cinnamon Roll'],
    tags: ['Trending'],
    image: img(
      'ultra realistic roast chicken sandwich on sourdough, crisp greens, warm cinematic lighting, premium food photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'caprese-melt',
    category: 'Bistro Dining',
    name: 'Caprese Confit Ciabatta',
    description: 'Melted buffalo mozzarella, roasted cherry tomato confit, house basil pesto on ciabatta.',
    calories: 590,
    price: 12.0,
    rating: 4.6,
    ingredients: ['Buffalo mozzarella', 'Tomato confit', 'Basil pesto', 'Ciabatta'],
    pairings: ['Silk Flat White', 'Strawberry Basil Craft'],
    tags: ['New'],
    image: img(
      'ultra realistic caprese melt sandwich with mozzarella stretch, basil, tomato confit, warm cafe lighting, premium food photography, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'smoked-salmon-bagel',
    category: 'Bistro Dining',
    name: 'Gourmet Salmon Bagel',
    description: 'Silky cold-smoked salmon, organic dill cream cheese, capers, pickled red onions, lemon zest.',
    calories: 520,
    price: 14.5,
    rating: 4.7,
    ingredients: ['Artisan bagel', 'Smoked salmon', 'Dill cream cheese', 'Capers'],
    pairings: ['Noir Cortado', 'Iced Vanilla Latte'],
    tags: ['Seasonal'],
    image: img(
      'ultra realistic smoked salmon bagel with dill cream cheese, capers, lemon zest, dark plate, warm cafe lighting, premium food photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'reserve-espresso',
    category: 'Café Craft',
    name: 'Reserve Espresso',
    description: 'Velvet crema, dark chocolate finish, zero bitterness, single-origin craft.',
    calories: 10,
    price: 4.8,
    rating: 4.9,
    ingredients: ['Single-origin espresso'],
    pairings: ['Almond Croissant', 'Dark Chocolate Tart'],
    tags: ['Popular'],
    image: img(
      'ultra realistic cinematic espresso in a matte black ceramic demitasse on dark walnut table, warm cafe lighting, shallow depth of field, subtle steam, high contrast, premium coffee photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'flat-white-silk',
    category: 'Café Craft',
    name: 'Silk Flat White',
    description: 'Double ristretto-forward, glossy organic microfoam, natural caramel warmth.',
    calories: 160,
    price: 5.9,
    rating: 4.8,
    ingredients: ['Double ristretto', 'Steamed organic milk'],
    pairings: ['Butter Brioche Slice', 'Pistachio Financier'],
    tags: ['Trending'],
    image: img(
      'ultra realistic flat white in a minimalist porcelain cup with latte art rosette, warm amber lighting, cinematic shadows, coffee shop aesthetic, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'brown-sugar-latte',
    category: 'Café Craft',
    name: 'Brown Sugar Oat Latte',
    description: 'Warm toffee notes with velvety oat milk and a roasted sea salt finish.',
    calories: 220,
    price: 6.4,
    rating: 4.7,
    ingredients: ['Espresso', 'Velvet oat milk', 'Brown sugar syrup', 'Sea salt'],
    pairings: ['Atelier Cinnamon Roll', 'Espresso Tiramisu'],
    tags: ['Popular'],
    image: img(
      'ultra realistic oat milk latte in tall glass, brown sugar syrup drizzle, warm cafe tones, macro detail, soft steam, premium beverage photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'cortado-noir',
    category: 'Café Craft',
    name: 'Noir Cortado',
    description: 'Perfectly balanced extraction: equal parts espresso and steamed microfoam.',
    calories: 90,
    price: 5.1,
    rating: 4.8,
    ingredients: ['Single-origin espresso', 'Steamed milk'],
    pairings: ['Pistachio Financier', 'Butter Brioche Slice'],
    tags: ['New'],
    image: img(
      'ultra realistic cortado in clear glass, fine crema layer, dark marble counter, cinematic lighting, premium coffee photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'nitro-cold-brew',
    category: 'Café Craft',
    name: 'Nitro Craft Brew',
    description: 'Nitrogen-infused slow drip pour, thick creamy head, chocolate-forward cold extraction.',
    calories: 25,
    price: 6.2,
    rating: 4.9,
    ingredients: ['Cold brewed coffee', 'Nitrogen infusion'],
    pairings: ['Almond Croissant', 'Dark Chocolate Tart'],
    tags: ['Trending', 'Popular'],
    image: img(
      'ultra realistic nitro cold brew cascading in a tall glass, thick creamy foam head, moody dark background, warm highlights, high contrast, 8k beverage photography',
      'portrait_4_3'
    ),
  },
  {
    id: 'iced-vanilla-latte',
    category: 'Café Craft',
    name: 'Iced Vanilla Latte',
    description: 'Madagascar vanilla pod extraction, clean espresso bite, served over crystal ice.',
    calories: 190,
    price: 6.1,
    rating: 4.7,
    ingredients: ['Espresso', 'Organic milk', 'Madagascar vanilla extract'],
    pairings: ['Vanilla Bean Cheesecake', 'Pistachio Financier'],
    tags: ['Popular'],
    image: img(
      'ultra realistic iced vanilla latte in glass with ice cubes, condensation, soft warm cafe lighting, cinematic tones, premium drink photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'iced-mocha-obsidian',
    category: 'Café Craft',
    name: 'Obsidian Iced Mocha',
    description: 'Double ristretto, premium dark Dutch cocoa, organic milk, cacao nib overlay.',
    calories: 260,
    price: 6.9,
    rating: 4.8,
    ingredients: ['Espresso', 'Steamed milk', 'Dutch cocoa', 'Cacao nibs'],
    pairings: ['Espresso Tiramisu', 'Almond Croissant'],
    tags: ['Trending'],
    image: img(
      'ultra realistic iced mocha in glass with dark chocolate drizzle, cacao nib topping, warm moody lighting, high contrast, premium cafe aesthetic, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'yuzu-sparkler',
    category: 'Signature Cocktails',
    name: 'Yuzu Citrus Sparkler',
    description: 'Aromatic yuzu juice, sparkling mineral water, fresh mint leaves, lemon peel twist (non-alcoholic).',
    calories: 90,
    price: 7.5,
    rating: 4.6,
    ingredients: ['Yuzu juice', 'Sparkling mineral water', 'Mint sprig', 'Lemon peel'],
    pairings: ['Wild Saffron Seabass', 'Vanilla Bean Cheesecake'],
    tags: ['New', 'Trending'],
    image: img(
      'ultra realistic yuzu sparkling drink in tall glass, citrus garnish, condensation, warm cafe lighting, premium beverage photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'strawberry-basil-refresher',
    category: 'Signature Cocktails',
    name: 'Strawberry Basil Craft',
    description: 'Muddled organic strawberries, fresh garden basil infusion, sparkling tonic base (non-alcoholic).',
    calories: 120,
    price: 7.8,
    rating: 4.7,
    ingredients: ['Muddled strawberries', 'Garden basil leaves', 'Premium tonic', 'Ice'],
    pairings: ['Aged Angus Bistro Steak', 'Pistachio Financier'],
    tags: ['Trending'],
    image: img(
      'ultra realistic strawberry basil refresher in glass with ice, basil garnish, condensation, warm cinematic lighting, premium drink photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'almond-croissant',
    category: 'Pastries & Bakery',
    name: 'Almond Croissant',
    description: 'Flaky multi-layered puff pastry, sweet almond frangipane, toasted almond flakes.',
    calories: 420,
    price: 5.4,
    rating: 4.8,
    ingredients: ['Butter pastry dough', 'Almond cream', 'Toasted almonds'],
    pairings: ['Reserve Espresso', 'Nitro Craft Brew'],
    tags: ['Popular'],
    image: img(
      'ultra realistic almond croissant on matte stone plate, flaky layers, toasted almonds, warm cafe lighting, premium bakery photography, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'cinnamon-roll-atelier',
    category: 'Pastries & Bakery',
    name: 'Atelier Cinnamon Roll',
    description: 'Soft hand-rolled brioche spiral, organic cinnamon glaze, Madagascar vanilla bean drizzle.',
    calories: 510,
    price: 5.9,
    rating: 4.7,
    ingredients: ['Brioche dough', 'Ceylon cinnamon', 'Vanilla bean glaze'],
    pairings: ['Brown Sugar Oat Latte', 'Obsidian Iced Mocha'],
    tags: ['Trending'],
    image: img(
      'ultra realistic cinnamon roll with glossy vanilla glaze, warm cinematic lighting, premium pastry photography, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'butter-brioche',
    category: 'Pastries & Bakery',
    name: 'Butter Brioche Slice',
    description: 'Golden buttery crumb brioche, organic cultured butter smear, flaked sea salt.',
    calories: 340,
    price: 4.2,
    rating: 4.6,
    ingredients: ['Cultured butter brioche', 'Sweet cream butter', 'Maldon salt'],
    pairings: ['Noir Cortado', 'Yuzu Citrus Sparkler'],
    tags: ['New'],
    image: img(
      'ultra realistic brioche slice with butter, golden crumb, dark wood table, warm cafe lighting, premium bakery photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'pistachio-finan',
    category: 'Pastries & Bakery',
    name: 'Pistachio Financier',
    description: 'Premium French almond cake, browned butter infusion, crushed raw pistachios.',
    calories: 260,
    price: 4.9,
    rating: 4.7,
    ingredients: ['Almond flour cake', 'Browned butter', 'Crushed pistachios'],
    pairings: ['Reserve Espresso', 'Strawberry Basil Craft'],
    tags: ['Seasonal'],
    image: img(
      'ultra realistic pistachio financiers on dark ceramic plate, glossy pistachio crumble, warm cinematic lighting, premium dessert photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'dark-chocolate-tart',
    category: 'Artisan Desserts',
    name: 'Dark Chocolate Tart',
    description: 'Glossy 72% Valrhona ganache, crisp chocolate butter pastry shell, Maldon sea salt flakes.',
    calories: 480,
    price: 6.9,
    rating: 4.9,
    ingredients: ['Valrhona chocolate', 'Pastry shell', 'Sea salt'],
    pairings: ['Reserve Espresso', 'Aged Angus Bistro Steak'],
    tags: ['Popular'],
    image: img(
      'ultra realistic dark chocolate tart with glossy ganache, sea salt flakes, moody dark background, high contrast, premium dessert photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'vanilla-bean-cheesecake',
    category: 'Artisan Desserts',
    name: 'Vanilla Bean Cheesecake',
    description: 'Satin-textured cream cheese custard, organic vanilla specks, wild berry reduction glaze.',
    calories: 520,
    price: 7.4,
    rating: 4.8,
    ingredients: ['Vanilla bean pods', 'Artisan cream cheese', 'Wild berry glaze'],
    pairings: ['Iced Vanilla Latte', 'Wild Saffron Seabass'],
    tags: ['Trending'],
    image: img(
      'ultra realistic vanilla bean cheesecake slice with berry glaze, elegant plating, warm cafe lighting, shallow depth of field, premium dessert photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'espresso-tiramisu',
    category: 'Artisan Desserts',
    name: 'Espresso Tiramisu',
    description: 'Espresso-soaked savoiardi ladyfingers, velvety mascarpone cream, dark cocoa dust.',
    calories: 560,
    price: 7.9,
    rating: 4.9,
    ingredients: ['Mascarpone cheese', 'Reserve espresso', 'Ladyfingers', 'Cocoa powder'],
    pairings: ['Reserve Espresso', 'Obsidian Iced Mocha'],
    tags: ['Limited', 'Trending'],
    image: img(
      'ultra realistic tiramisu in glass with cocoa dust, espresso tones, moody lighting, premium dessert photography, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
];
