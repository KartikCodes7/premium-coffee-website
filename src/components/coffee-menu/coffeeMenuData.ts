export type CoffeeMenuCategory =
  | 'Hot Coffee'
  | 'Cold Coffee'
  | 'Signature Drinks'
  | 'Bakery'
  | 'Desserts'
  | 'Refreshers'
  | 'Sandwiches';

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
  'Hot Coffee',
  'Cold Coffee',
  'Signature Drinks',
  'Bakery',
  'Desserts',
  'Refreshers',
  'Sandwiches',
];

export const coffeeMenuItems: CoffeeMenuItem[] = [
  {
    id: 'reserve-espresso',
    category: 'Hot Coffee',
    name: 'Reserve Espresso',
    description: 'Velvet crema, dark chocolate finish, zero bitterness.',
    calories: 10,
    price: 4.8,
    rating: 4.9,
    ingredients: ['Single-origin espresso', 'Micro-foam (optional)'],
    pairings: ['Almond croissant', 'Dark chocolate tart'],
    tags: ['Popular'],
    image: img(
      'ultra realistic cinematic espresso in a matte black ceramic demitasse on dark walnut table, warm cafe lighting, shallow depth of field, subtle steam, high contrast, premium coffee photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'flat-white-silk',
    category: 'Hot Coffee',
    name: 'Silk Flat White',
    description: 'Ristretto-forward, glossy microfoam, caramel warmth.',
    calories: 160,
    price: 5.9,
    rating: 4.8,
    ingredients: ['Double ristretto', 'Steamed whole milk', 'Cocoa dust'],
    pairings: ['Vanilla bean canelé', 'Butter brioche'],
    tags: ['Trending'],
    image: img(
      'ultra realistic flat white in a minimalist porcelain cup with latte art rosette, warm amber lighting, cinematic shadows, coffee shop aesthetic, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'brown-sugar-latte',
    category: 'Hot Coffee',
    name: 'Brown Sugar Oat Latte',
    description: 'Toffee notes with oat silk and a roasted finish.',
    calories: 220,
    price: 6.4,
    rating: 4.7,
    ingredients: ['Espresso', 'Oat milk', 'Brown sugar syrup', 'Sea salt'],
    pairings: ['Cinnamon roll', 'Hazelnut financiers'],
    tags: ['Popular'],
    image: img(
      'ultra realistic oat milk latte in tall glass, brown sugar syrup drizzle, warm cafe tones, macro detail, soft steam, premium beverage photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'cortado-noir',
    category: 'Hot Coffee',
    name: 'Noir Cortado',
    description: 'Half espresso, half milk — perfectly calibrated.',
    calories: 90,
    price: 5.1,
    rating: 4.8,
    ingredients: ['Espresso', 'Steamed milk'],
    pairings: ['Pistachio biscotti', 'Orange zest madeleine'],
    tags: ['New'],
    image: img(
      'ultra realistic cortado in clear glass, fine crema layer, dark marble counter, cinematic lighting, premium coffee photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'nitro-cold-brew',
    category: 'Cold Coffee',
    name: 'Nitro Cold Brew',
    description: 'Cascade pour, creamy head, chocolate-forward cold extraction.',
    calories: 25,
    price: 6.2,
    rating: 4.9,
    ingredients: ['Cold brewed coffee', 'Nitrogen'],
    pairings: ['Sea salt cookie', 'Chocolate chip loaf'],
    tags: ['Trending', 'Popular'],
    image: img(
      'ultra realistic nitro cold brew cascading in a tall glass, thick creamy foam head, moody dark background, warm highlights, high contrast, 8k beverage photography',
      'portrait_4_3'
    ),
  },
  {
    id: 'iced-vanilla-latte',
    category: 'Cold Coffee',
    name: 'Iced Vanilla Latte',
    description: 'Clean vanilla, espresso bite, crystal ice.',
    calories: 190,
    price: 6.1,
    rating: 4.7,
    ingredients: ['Espresso', 'Milk', 'Madagascar vanilla'],
    pairings: ['Berry tart', 'Butter shortbread'],
    tags: ['Popular'],
    image: img(
      'ultra realistic iced vanilla latte in glass with ice cubes, condensation, soft warm cafe lighting, cinematic tones, premium drink photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'iced-mocha-obsidian',
    category: 'Cold Coffee',
    name: 'Obsidian Iced Mocha',
    description: 'Dark cocoa, espresso depth, satin finish.',
    calories: 260,
    price: 6.9,
    rating: 4.8,
    ingredients: ['Espresso', 'Milk', 'Dark cocoa', 'Cacao nibs'],
    pairings: ['Chocolate tart', 'Salted brownie'],
    tags: ['Trending'],
    image: img(
      'ultra realistic iced mocha in glass with dark chocolate drizzle, cacao nib topping, warm moody lighting, high contrast, premium cafe aesthetic, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'affogato-ice',
    category: 'Cold Coffee',
    name: 'Affogato Ice',
    description: 'Hot espresso over vanilla gelato — cinematic contrast.',
    calories: 300,
    price: 7.5,
    rating: 4.9,
    ingredients: ['Espresso', 'Vanilla gelato', 'Cocoa dust'],
    pairings: ['Almond tuile', 'Café brownie'],
    tags: ['Limited', 'Seasonal'],
    image: img(
      'ultra realistic affogato espresso poured over vanilla gelato in glass bowl, dramatic steam and melt, warm cinematic lighting, premium dessert photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'signature-saffron-latte',
    category: 'Signature Drinks',
    name: 'Saffron Honey Latte',
    description: 'Golden saffron aroma, honeyed silk, gentle spice.',
    calories: 240,
    price: 7.2,
    rating: 4.8,
    ingredients: ['Espresso', 'Steamed milk', 'Saffron honey', 'Cardamom'],
    pairings: ['Pistachio croissant', 'Rose macarons'],
    tags: ['New', 'Seasonal'],
    image: img(
      'ultra realistic saffron latte in ceramic cup, golden hue, delicate steam, luxurious cafe setting, warm amber lighting, premium coffee photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'smoked-maple-latte',
    category: 'Signature Drinks',
    name: 'Smoked Maple Latte',
    description: 'Maple depth with a whisper of smoke and sea salt.',
    calories: 280,
    price: 7.1,
    rating: 4.7,
    ingredients: ['Espresso', 'Milk', 'Maple syrup', 'Smoked sea salt'],
    pairings: ['Butter pecan bar', 'Brioche french toast'],
    tags: ['Trending'],
    image: img(
      'ultra realistic maple latte in tall glass, subtle smoke swirl, dark wood table, warm cinematic lighting, premium beverage photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'caramel-cloud-cappuccino',
    category: 'Signature Drinks',
    name: 'Caramel Cloud Cappuccino',
    description: 'Foam peak, caramel veil, espresso backbone.',
    calories: 210,
    price: 6.8,
    rating: 4.7,
    ingredients: ['Espresso', 'Steamed milk', 'Caramel', 'Cocoa'],
    pairings: ['Canelé', 'Chocolate croissant'],
    tags: ['Popular'],
    image: img(
      'ultra realistic cappuccino with thick foam and caramel drizzle, latte art, warm cafe lighting, high contrast, premium coffee photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'tonic-espresso-spark',
    category: 'Signature Drinks',
    name: 'Espresso Tonic Spark',
    description: 'Citrus-bright tonic with espresso lift and ice clarity.',
    calories: 80,
    price: 6.7,
    rating: 4.6,
    ingredients: ['Espresso', 'Premium tonic', 'Citrus peel', 'Ice'],
    pairings: ['Lemon tart', 'Orange madeleine'],
    tags: ['New'],
    image: img(
      'ultra realistic espresso tonic in clear highball glass, layered dark espresso over sparkling tonic, citrus peel garnish, condensation, cinematic lighting, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'almond-croissant',
    category: 'Bakery',
    name: 'Almond Croissant',
    description: 'Flaky layers, almond cream, toasted finish.',
    calories: 420,
    price: 5.4,
    rating: 4.8,
    ingredients: ['Butter croissant', 'Almond frangipane', 'Toasted almonds'],
    pairings: ['Reserve Espresso', 'Nitro Cold Brew'],
    tags: ['Popular'],
    image: img(
      'ultra realistic almond croissant on matte stone plate, flaky layers, toasted almonds, warm cafe lighting, premium bakery photography, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'cinnamon-roll-atelier',
    category: 'Bakery',
    name: 'Atelier Cinnamon Roll',
    description: 'Soft spiral, cinnamon lacquer, vanilla glaze.',
    calories: 510,
    price: 5.9,
    rating: 4.7,
    ingredients: ['Brioche dough', 'Cinnamon sugar', 'Vanilla glaze'],
    pairings: ['Brown Sugar Oat Latte', 'Iced Vanilla Latte'],
    tags: ['Trending'],
    image: img(
      'ultra realistic cinnamon roll with glossy vanilla glaze, warm cinematic lighting, premium pastry photography, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'butter-brioche',
    category: 'Bakery',
    name: 'Butter Brioche Slice',
    description: 'Golden crumb, cultured butter aroma, soft sheen.',
    calories: 340,
    price: 4.2,
    rating: 4.6,
    ingredients: ['Brioche', 'Cultured butter', 'Sea salt'],
    pairings: ['Noir Cortado', 'Saffron Honey Latte'],
    tags: ['New'],
    image: img(
      'ultra realistic brioche slice with butter, golden crumb, dark wood table, warm cafe lighting, premium bakery photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'pistachio-finan',
    category: 'Bakery',
    name: 'Pistachio Financiers',
    description: 'Nutty, browned butter, delicate crunch.',
    calories: 260,
    price: 4.9,
    rating: 4.7,
    ingredients: ['Brown butter cake', 'Pistachio', 'Vanilla'],
    pairings: ['Reserve Espresso', 'Espresso Tonic Spark'],
    tags: ['Seasonal'],
    image: img(
      'ultra realistic pistachio financiers on dark ceramic plate, glossy pistachio crumble, warm cinematic lighting, premium dessert photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'dark-chocolate-tart',
    category: 'Desserts',
    name: 'Dark Chocolate Tart',
    description: 'Glossy ganache, crisp shell, sea salt.',
    calories: 480,
    price: 6.9,
    rating: 4.9,
    ingredients: ['Cacao ganache', 'Butter tart shell', 'Sea salt'],
    pairings: ['Obsidian Iced Mocha', 'Reserve Espresso'],
    tags: ['Popular'],
    image: img(
      'ultra realistic dark chocolate tart with glossy ganache, sea salt flakes, moody dark background, high contrast, premium dessert photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'vanilla-bean-cheesecake',
    category: 'Desserts',
    name: 'Vanilla Bean Cheesecake',
    description: 'Silky custard texture, vanilla specks, berry glaze.',
    calories: 520,
    price: 7.4,
    rating: 4.8,
    ingredients: ['Vanilla bean', 'Cream cheese', 'Berry glaze'],
    pairings: ['Iced Vanilla Latte', 'Nitro Cold Brew'],
    tags: ['Trending'],
    image: img(
      'ultra realistic vanilla bean cheesecake slice with berry glaze, elegant plating, warm cafe lighting, shallow depth of field, premium dessert photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'salted-caramel-panna',
    category: 'Desserts',
    name: 'Salted Caramel Panna Cotta',
    description: 'Glass-smooth panna with caramel amber and crunch.',
    calories: 390,
    price: 7.1,
    rating: 4.7,
    ingredients: ['Cream', 'Vanilla', 'Salted caramel', 'Brittle'],
    pairings: ['Smoked Maple Latte', 'Noir Cortado'],
    tags: ['Seasonal'],
    image: img(
      'ultra realistic panna cotta with salted caramel sauce, elegant glass cup, warm cinematic lighting, premium dessert photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'espresso-tiramisu',
    category: 'Desserts',
    name: 'Espresso Tiramisu',
    description: 'Espresso-soaked layers, cocoa snowfall, luxe finish.',
    calories: 560,
    price: 7.9,
    rating: 4.9,
    ingredients: ['Mascarpone', 'Espresso', 'Cocoa', 'Ladyfingers'],
    pairings: ['Reserve Espresso', 'Caramel Cloud Cappuccino'],
    tags: ['Limited', 'Trending'],
    image: img(
      'ultra realistic tiramisu in glass with cocoa dust, espresso tones, moody lighting, premium dessert photography, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'yuzu-sparkler',
    category: 'Refreshers',
    name: 'Yuzu Sparkler',
    description: 'Bright yuzu citrus with a crisp sparkling finish.',
    calories: 90,
    price: 5.8,
    rating: 4.6,
    ingredients: ['Yuzu', 'Sparkling water', 'Citrus zest'],
    pairings: ['Butter brioche', 'Vanilla bean cheesecake'],
    tags: ['New'],
    image: img(
      'ultra realistic yuzu sparkling drink in tall glass, citrus garnish, condensation, warm cafe lighting, premium beverage photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'strawberry-basil-refresher',
    category: 'Refreshers',
    name: 'Strawberry Basil Refresher',
    description: 'Garden basil lift with ripe strawberry clarity.',
    calories: 120,
    price: 6.1,
    rating: 4.7,
    ingredients: ['Strawberry', 'Basil', 'Sparkling water', 'Ice'],
    pairings: ['Pistachio financiers', 'Almond croissant'],
    tags: ['Trending'],
    image: img(
      'ultra realistic strawberry basil refresher in glass with ice, basil garnish, condensation, warm cinematic lighting, premium drink photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'cucumber-mint-tonic',
    category: 'Refreshers',
    name: 'Cucumber Mint Tonic',
    description: 'Cold, clean, and bright — a palate reset.',
    calories: 60,
    price: 5.6,
    rating: 4.5,
    ingredients: ['Cucumber', 'Mint', 'Tonic', 'Ice'],
    pairings: ['Sandwiches', 'Bakery'],
    tags: ['Popular'],
    image: img(
      'ultra realistic cucumber mint tonic in clear glass, cucumber ribbons, mint sprig, condensation, moody cafe lighting, premium beverage photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'peach-black-tea',
    category: 'Refreshers',
    name: 'Peach Black Tea',
    description: 'Stonefruit perfume with a clean tea finish.',
    calories: 110,
    price: 5.4,
    rating: 4.6,
    ingredients: ['Black tea', 'Peach', 'Lemon'],
    pairings: ['Butter brioche', 'Vanilla bean cheesecake'],
    tags: ['Seasonal'],
    image: img(
      'ultra realistic iced peach black tea in glass, lemon slice, condensation, warm cinematic lighting, premium drink photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'truffle-egg-sandwich',
    category: 'Sandwiches',
    name: 'Truffle Egg Sandwich',
    description: 'Soft scramble, truffle butter, brioche hush.',
    calories: 540,
    price: 9.8,
    rating: 4.8,
    ingredients: ['Brioche', 'Soft scrambled eggs', 'Truffle butter', 'Chives'],
    pairings: ['Noir Cortado', 'Nitro Cold Brew'],
    tags: ['Popular'],
    image: img(
      'ultra realistic truffle egg sandwich on brioche, delicate scramble, dark ceramic plate, warm cafe lighting, premium food photography, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'roast-chicken-aioli',
    category: 'Sandwiches',
    name: 'Roast Chicken Aioli',
    description: 'Herb roast chicken, lemon aioli, crisp greens.',
    calories: 610,
    price: 10.4,
    rating: 4.7,
    ingredients: ['Sourdough', 'Roast chicken', 'Lemon aioli', 'Arugula'],
    pairings: ['Yuzu Sparkler', 'Cucumber Mint Tonic'],
    tags: ['Trending'],
    image: img(
      'ultra realistic roast chicken sandwich on sourdough, crisp greens, warm cinematic lighting, premium food photography, 8k',
      'portrait_4_3'
    ),
  },
  {
    id: 'caprese-melt',
    category: 'Sandwiches',
    name: 'Caprese Melt',
    description: 'Mozzarella melt, basil, tomato confit — warm and luxe.',
    calories: 590,
    price: 9.6,
    rating: 4.6,
    ingredients: ['Ciabatta', 'Mozzarella', 'Tomato confit', 'Basil pesto'],
    pairings: ['Espresso Tonic Spark', 'Strawberry Basil Refresher'],
    tags: ['New'],
    image: img(
      'ultra realistic caprese melt sandwich with mozzarella stretch, basil, tomato confit, warm cafe lighting, premium food photography, 8k, shallow depth of field',
      'portrait_4_3'
    ),
  },
  {
    id: 'smoked-salmon-bagel',
    category: 'Sandwiches',
    name: 'Smoked Salmon Bagel',
    description: 'Silky salmon, dill cream, lemon zest.',
    calories: 520,
    price: 11.2,
    rating: 4.7,
    ingredients: ['Bagel', 'Smoked salmon', 'Dill cream cheese', 'Capers'],
    pairings: ['Iced Vanilla Latte', 'Peach Black Tea'],
    tags: ['Seasonal'],
    image: img(
      'ultra realistic smoked salmon bagel with dill cream cheese, capers, lemon zest, dark plate, warm cafe lighting, premium food photography, 8k',
      'portrait_4_3'
    ),
  },
];

