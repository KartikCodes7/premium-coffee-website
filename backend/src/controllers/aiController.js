const sommelierResponses = [
  {
    keywords: ['wine', 'wagyu', 'steak', 'pair', 'red wine'],
    text: "For our succulent **Signature Wagyu**, our Sommelier highly recommends the **2018 Napa Valley Cabernet Sauvignon** ($95/bottle). Its robust, velvet tannins slice beautifully through the rich Wagyu fat. Shall I add a bottle of this vintage to your selection?",
    item: { id: 'napa-cabernet', name: 'Napa Valley Cabernet 2018', price: 95.00, image: '/assets/order_gin.png' }
  },
  {
    keywords: ['scallop', 'seafood', 'white wine', 'chardonnay', 'chablis'],
    text: "Our caramelized **Seared Scallops** pair impeccably with the crisp **Chablis Premier Cru 2020** ($110/bottle). The high acidity and bright mineral citrus notes highlight the delicate sweetness of Hokkaido shellfish. Would you like me to reserve a bottle for your table?",
    item: { id: 'chablis-2020', name: 'Chablis Premier Cru 2020', price: 110.00, image: '/assets/order_gin.png' }
  },
  {
    keywords: ['gluten', 'allergy', 'coeliac', 'wheat'],
    text: "Absolutely. Our **Seared Scallops** with saffron emulsion and our **Signature Wagyu** (when prepared with marrow reduction instead of teriyaki marrow jus) are 100% gluten-free. I have notified the kitchen of this preference.",
    item: null
  },
  {
    keywords: ['book', 'reserve', 'table', 'tonight'],
    text: "I can coordinate a reservation for you instantly. I've locked in a prime glassmorphic window booth for **4 guests tonight at 20:30** under the name Elena. I have sent the confirmation via SMS.",
    item: null
  },
  {
    keywords: ['cocktail', 'drink', 'gin', 'obsidian'],
    text: "Try our signature **Obsidian Gin & Tonic** ($22.00). It features cold-brewed butterfly pea flower infused gin, wild elderflower tonic, and a fresh rosemary sprig. Shall I prepare one at the bar for you?",
    item: { id: 'obsidian-gin', name: 'Obsidian Gin & Tonic', price: 22.00, image: '/assets/order_gin.png' }
  }
];

const fallbackResponses = [
  "An excellent selection. Our master chefs prepare each signature dish to reflect modern gastronomy. Would you like me to arrange an optimal beverage accompaniment or record special preparation notes for the culinary crew?",
  "Understood. I am adding that operational preference to your table context. What else can I assist you with regarding our premium evening menu?"
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
            content: 'You are the AI Sommelier and Culinary Concierge for Aura Gastronomy. Keep responses premium, concise, and focused on upselling pairing wines (Cabernet, Chablis, Obsidian Gin) or table logs.'
          },
          { role: 'user', content: message }
        ]
      });

      const text = response.choices[0].message.content;
      let upsellItem = null;
      const lower = message.toLowerCase();
      if (lower.includes('wine') || lower.includes('steak') || lower.includes('wagyu')) {
        upsellItem = { id: 'napa-cabernet', name: 'Napa Valley Cabernet 2018', price: 95.00, image: '/assets/order_gin.png' };
      } else if (lower.includes('scallop') || lower.includes('seafood')) {
        upsellItem = { id: 'chablis-2020', name: 'Chablis Premier Cru 2020', price: 110.00, image: '/assets/order_gin.png' };
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
  }, 1000);
};
