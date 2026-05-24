/**
 * RestaurantOS - Client-Side Generative AI & Recommendation Engine
 * Simulates real-time LLM Sommelier interactions, culinary pairings, and conversion-focused upselling.
 */

class AIEngine {
    constructor() {
        this.sommelierResponses = [
            {
                keywords: ['wine', 'wagyu', 'steak', 'pair', 'red wine'],
                text: "For our succulent **Signature Wagyu**, our Sommelier highly recommends the **2018 Napa Valley Cabernet Sauvignon** ($95/bottle). Its robust, velvet tannins slice beautifully through the rich Wagyu fat. Shall I add a bottle of this vintage to your selection?",
                item: { id: 'napa-cabernet', name: 'Napa Valley Cabernet 2018', price: 95.00, image: 'assets/order_gin.png' }
            },
            {
                keywords: ['scallop', 'seafood', 'white wine', 'chardonnay'],
                text: "Our caramelized **Seared Scallops** pair impeccably with the crisp **Chablis Premier Cru 2020** ($110/bottle). The high acidity and bright mineral citrus notes highlight the delicate sweetness of Hokkaido shellfish. Would you like me to reserve a bottle for your table?",
                item: { id: 'chablis-2020', name: 'Chablis Premier Cru 2020', price: 110.00, image: 'assets/order_gin.png' }
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
                item: { id: 'obsidian-gin', name: 'Obsidian Gin & Tonic', price: 22.00, image: 'assets/order_gin.png' }
            }
        ];
        
        this.fallbackResponses = [
            "An excellent selection. Our master chefs prepare each signature dish to reflect modern gastronomy. Would you like me to arrange an optimal beverage accompaniment or record special preparation notes for the culinary crew?",
            "Understood. I am adding that operational preference to your table context. What else can I assist you with regarding our premium evening menu?",
            "Fascinating preference. At Aura Gastronomy, we curate each detail of the seating layout and dish pacing to optimize your evening. Would you like to review checkout subtotal details?"
        ];
    }

    // Process a user question and trigger simulated response callback
    generateResponse(inputText, callback) {
        if (!inputText || inputText.trim() === '') return;

        const text = inputText.toLowerCase();
        let match = this.sommelierResponses.find(r => 
            r.keywords.some(kw => text.includes(kw))
        );

        const responseText = match ? match.text : this.getRandomFallback();
        const upsellItem = match ? match.item : null;

        // Trigger loading delay to simulate neural network execution
        setTimeout(() => {
            callback(responseText, upsellItem);
        }, 1200);
    }

    getRandomFallback() {
        const idx = Math.floor(Math.random() * this.fallbackResponses.length);
        return this.fallbackResponses[idx];
    }
}

// Global Single Instance
window.AIEngineInstance = new AIEngine();
