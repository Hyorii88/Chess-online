import OpenAI from 'openai';

class ChatbotService {
    constructor() {
        this.client = null;
        this.systemPrompt = `You are a helpful chess coach and expert. You help players improve their chess skills by:
- Explaining chess concepts and strategies
- Analyzing positions and suggesting moves
- Teaching opening principles and common openings
- Explaining tactical patterns (forks, pins, skewers, etc.)
- Providing endgame guidance
- Answering questions about chess rules and gameplay

Always be encouraging and educational. When analyzing positions, use chess notation (algebraic notation).
Keep responses concise but informative.`;
    }

    initialize() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️  OpenAI API key not configured. Chatbot will use fallback responses.');
            return false;
        }

        try {
            this.client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            console.log('✅ OpenAI client initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize OpenAI:', error);
            return false;
        }
    }

    async chat(message, context = []) {
        // Fallback responses if OpenAI is not configured
        if (!this.client) {
            return this.getFallbackResponse(message);
        }

        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...context.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                { role: 'user', content: message }
            ];

            const response = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Chatbot error:', error);
            return this.getFallbackResponse(message);
        }
    }

    getFallbackResponse(message) {
        const lowercaseMsg = message.toLowerCase();

        // Opening responses
        if (lowercaseMsg.includes('opening') || lowercaseMsg.includes('khai cuộc')) {
            return `Some popular chess openings to learn:
      
1. **Italian Game** (e4 e5, Nf3 Nc6, Bc4) - Great for beginners
2. **Queen's Gambit** (d4 d5, c4) - Solid and strategic
3. **Sicilian Defense** (e4 c5) - Aggressive counter-attack
4. **French Defense** (e4 e6) - Solid defensive choice

Focus on controlling the center, developing pieces, and castling early!`;
        }

        // Tactics responses
        if (lowercaseMsg.includes('tactic') || lowercaseMsg.includes('chiến thuật')) {
            return `Key chess tactics to master:

1. **Fork** - Attack two pieces at once
2. **Pin** - Piece can't move without exposing a more valuable piece
3. **Skewer** - Opposite of pin, valuable piece forced to move
4. **Discovery** - Moving one piece reveals an attack from another
5. **Double Attack** - Two threats simultaneously

Practice these patterns daily to improve your tactical vision!`;
        }

        // General tips
        if (lowercaseMsg.includes('tip') || lowercaseMsg.includes('advice') || lowercaseMsg.includes('improve')) {
            return `Tips to improve your chess:

1. **Solve puzzles daily** - Improves tactical vision
2. **Analyze your games** - Learn from mistakes
3. **Study openings** - Know the first 8-10 moves
4. **Control the center** - e4, d4, e5, d5 squares
5. **Develop pieces quickly** - Knights before bishops
6. **Castle early** - Protect your king
7. **Think about your opponent's threats** - Always ask "What's their plan?"

Consistent practice is key!`;
        }

        // Default response
        return `I'm a chess coach here to help you improve! I can help you with:

- Chess openings and strategy
- Tactical patterns and puzzles
- Position analysis
- Endgame techniques
- General chess tips

Ask me anything about chess! Note: For full AI capabilities, the OpenAI API key needs to be configured.`;
    }
}

const chatbotService = new ChatbotService();
chatbotService.initialize();

export default chatbotService;
