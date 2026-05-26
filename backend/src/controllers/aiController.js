const sommelierResponses = [
  {
    keywords: ['sweet', 'sugar', 'caramel', 'honey'],
    text: "For a sweet coffee experience, our AI Barista highly recommends our **Caramel Cloud Cappuccino** ($6.80) or **Saffron Honey Latte** ($7.20). Their rich, velvety microfoam and amber caramel drizzle are perfect sweeteners. Would you like me to add one to your checkout ticket?",
    item: { id: 'caramel-cloud-cappuccino', name: 'Caramel Cloud Cappuccino', price: 6.80, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20cappuccino%20with%20thick%20foam%20and%20caramel%20drizzle%2C%20latte%20art%2C%20warm%20cafe%20lighting%2C%20high%2520contrast%2C%2520premium%2520coffee%2520photography%2C%25208k&image_size=portrait_4_3' }
  },
  {
    keywords: ['cold', 'iced', 'nitro', 'frappe'],
    text: "Our signature **Nitro Cold Brew** ($6.20) is outstanding. It is nitrogen-infused on tap for a cascading, velvety head with a chocolate-forward body. For a sweeter cold drink, try the **Obsidian Iced Mocha** ($6.90). Shall I prepare one over crystal ice for you?",
    item: { id: 'nitro-cold-brew', name: 'Nitro Cold Brew', price: 6.20, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20nitro%20cold%20brew%20cascading%20in%20a%20tall%20glass%2C%20thick%20creamy%20foam%20head%2C%20moody%20dark%20background%2C%20warm%20highlights%2C%20high%2520contrast%2C%25208k%2520beverage%2520photography&image_size=portrait_4_3' }
  },
  {
    keywords: ['cappuccino', 'flat white', 'latte', 'pair', 'combo'],
    text: "A classic milk coffee like our **Silk Flat White** pairs exceptionally well with our warm, buttery **Almond Croissant** ($5.40) or our glazed **Atelier Cinnamon Roll** ($5.90). The flaky pastry layers highlight the espresso's ristretto caramel notes. Shall I add a pastry pairing to your bill?",
    item: { id: 'almond-croissant', name: 'Almond Croissant', price: 5.40, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20almond%20croissant%20on%20matte%20stone%20plate%2C%20flaky%20layers%2C%20toasted%20almonds%2C%20warm%20cafe%20lighting%2C%2520premium%2520bakery%2520photography%2C%25208k%2C%2520shallow%2520depth%2520of%2520field&image_size=portrait_4_3' }
  },
  {
    keywords: ['vegetarian', 'veg', 'meatless'],
    text: "All our bakery pastries, desserts, and our gourmet **Caprese Melt** ($9.60) on toasted Ciabatta are 100% vegetarian. I have logged these preferences for your table.",
    item: null
  },
  {
    keywords: ['book', 'reserve', 'table', 'tonight'],
    text: "Certainly. I have locked in a premium B2B window booth reservation for **2 guests tomorrow at 18:00** under the name Elena Rostova. Your table confirmation has been dispatched.",
    item: null
  }
];

const fallbackResponses = [
  "An exquisite café selection. Our baristas grind every single-origin bean to order to capture maximum flavor. Would you like me to recommend a matching artisan pastry or lock in custom preparation notes?",
  "Understood. Adding your operational preferences to your active table session. What else can I prepare for you today from our gourmet bar?"
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
            content: 'You are the AI Barista and Culinary Concierge for Aura Premium Café. Keep responses premium, concise, and focused on upselling coffee pairings (Croissant, Flat White, Nitro Brew) or table reservations.'
          },
          { role: 'user', content: message }
        ]
      });

      const text = response.choices[0].message.content;
      let upsellItem = null;
      const lower = message.toLowerCase();
      if (lower.includes('sweet') || lower.includes('sugar') || lower.includes('honey')) {
        upsellItem = { id: 'caramel-cloud-cappuccino', name: 'Caramel Cloud Cappuccino', price: 6.80, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20cappuccino%20with%20thick%20foam%20and%20caramel%20drizzle%2C%20latte%20art%2C%20warm%20cafe%20lighting%2C%20high%2520contrast%2C%2520premium%2520coffee%2520photography%2C%25208k&image_size=portrait_4_3' };
      } else if (lower.includes('cold') || lower.includes('iced') || lower.includes('nitro')) {
        upsellItem = { id: 'nitro-cold-brew', name: 'Nitro Cold Brew', price: 6.20, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20nitro%20cold%20brew%20cascading%20in%20a%20tall%20glass%2C%20thick%20creamy%20foam%20head%2C%20moody%20dark%20background%2C%20warm%20highlights%2C%20high%2520contrast%2C%25208k%2520beverage%2520photography&image_size=portrait_4_3' };
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
