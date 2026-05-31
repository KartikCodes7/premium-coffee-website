const sommelierResponses = [
  {
    keywords: ['sweet', 'sugar', 'caramel', 'honey', 'dessert'],
    text: "For a sweet finish or beverage, our AI Concierge highly recommends our **Brown Sugar Oat Latte** ($6.40) or **Espresso Tiramisu** ($7.90). Their rich, velvety texture and premium ingredients make them perfect treats. Would you like me to add one to your guest request?",
    item: { id: 'espresso-tiramisu', name: 'Espresso Tiramisu', price: 7.90, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20tiramisu%20in%20glass%20with%20cocoa%20dust%2C%20espresso%20tones%2C%20moody%20lighting%2C%20premium%20dessert%20photography%2C%208k%2C%20shallow%2520depth%2520of%2520field&image_size=portrait_4_3' }
  },
  {
    keywords: ['cold', 'iced', 'nitro', 'drink', 'beverage'],
    text: "Our signature **Nitro Craft Brew** ($6.20) or sparkling **Yuzu Citrus Sparkler** ($7.50) are outstanding. The Nitro is cold-brewed and nitrogen-infused on tap for a cascading, velvety head. Shall I prepare one over crystal ice for you?",
    item: { id: 'nitro-cold-brew', name: 'Nitro Craft Brew', price: 6.20, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20nitro%20cold%20brew%20cascading%20in%20a%20tall%20glass%2C%20thick%20creamy%20foam%20head%2C%20moody%20dark%20background%2C%20warm%20highlights%2C%20high%2520contrast%2C%25208k%2520beverage%2520photography&image_size=portrait_4_3' }
  },
  {
    keywords: ['steak', 'dinner', 'meat', 'pair', 'combo', 'main'],
    text: "For our premier dinner experience, we highly recommend our **Aged Angus Bistro Steak** ($24.50), seared to perfection with garlic herb compound butter. It pairs wonderfully with a **Yuzu Citrus Sparkler** ($7.50). Shall I add this exquisite main to your bill?",
    item: { id: 'bistro-steak', name: 'Aged Angus Bistro Steak', price: 24.50, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20gourmet%20pan%20seared%20ribeye%20steak%20on%20dark%20stoneware%20plate%2C%20herb%20butter%20melting%20on%20top%2C%2520rosemary%2520sprig%2C%2520asparagus%2520spears%2C%2520warm%2520cinematic%2520lighting%2C%25208k%2520food%2520photography&image_size=portrait_4_3' }
  },
  {
    keywords: ['vegetarian', 'veg', 'meatless'],
    text: "All our pastries, desserts, and our gourmet **Caprese Confit Ciabatta** ($12.00) featuring melted buffalo mozzarella and roasted cherry tomato confit are 100% vegetarian. I have logged these preferences for your table.",
    item: null
  },
  {
    keywords: ['book', 'reserve', 'table', 'tonight'],
    text: "Certainly. I have locked in a premium table reservation for **2 guests tomorrow at 20:30** under the name Elena Rostova. Your booking confirmation has been dispatched to the operations queue.",
    item: null
  }
];

const fallbackResponses = [
  "An exquisite dining selection. Our culinary team prepares every specialty dish and craft brew to order. Would you like me to recommend a matching dessert or log custom preparation notes for your guest session?",
  "Understood. Adding your preferences to your active guest session. What else can I prepare for you today from our artisan menu?"
];

exports.processChat = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message content required' });
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const { OpenAI } = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are the AI Concierge and Culinary Sommelier for Aura Grand Bistro & Café. Keep responses premium, concise, and focused on upselling dining pairings (Aged Angus Bistro Steak, Silk Flat White, Almond Croissant) or table reservations.'
          },
          { role: 'user', content: message }
        ]
      });

      const text = response.choices[0].message.content;
      let upsellItem = null;
      const lower = message.toLowerCase();
      if (lower.includes('steak') || lower.includes('meat') || lower.includes('dinner')) {
        upsellItem = { id: 'bistro-steak', name: 'Aged Angus Bistro Steak', price: 24.50, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20gourmet%20pan%20seared%20ribeye%20steak%20on%20dark%20stoneware%20plate%2C%20herb%20butter%20melting%20on%20top%2C%2520rosemary%2520sprig%2C%2520asparagus%2520spears%2C%2520warm%2520cinematic%2520lighting%2C%25208k%2520food%2520photography&image_size=portrait_4_3' };
      } else if (lower.includes('sweet') || lower.includes('tiramisu')) {
        upsellItem = { id: 'espresso-tiramisu', name: 'Espresso Tiramisu', price: 7.90, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20tiramisu%20in%20glass%20with%20cocoa%20dust%2C%20espresso%20tones%2C%20moody%20lighting%2C%20premium%20dessert%20photography%2C%208k%2C%20shallow%2520depth%2520of%2520field&image_size=portrait_4_3' };
      }

      return res.json({ text, upsellItem });
    } catch (e) {
      console.warn('[OpenAI failed, falling back to local matches]:', e.message);
    }
  }

  const lowerMessage = message.toLowerCase();
  const match = sommelierResponses.find(r =>
    r.keywords.some(kw => lowerMessage.includes(kw))
  );

  const text = match ? match.text : fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  const upsellItem = match ? match.item : null;

  setTimeout(() => {
    res.json({ text, upsellItem });
  }, 800);
};
