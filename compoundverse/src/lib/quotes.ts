// CompoundVerse - Quote Library
// Philosophy, Science, Faith, History

export interface Quote {
    text: string;
    author: string;
    category: 'philosophy' | 'science' | 'faith' | 'history' | 'general';
}

export const QUOTES: Quote[] = [
    // Philosophy
    {
        text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        author: "Aristotle",
        category: "philosophy"
    },
    {
        text: "The journey of a thousand miles begins with a single step.",
        author: "Lao Tzu",
        category: "philosophy"
    },
    {
        text: "It is not that we have a short time to live, but that we waste a lot of it.",
        author: "Seneca",
        category: "philosophy"
    },
    {
        text: "No man is free who is not master of himself.",
        author: "Epictetus",
        category: "philosophy"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "philosophy"
    },

    // Science
    {
        text: "Small daily improvements are the key to staggering long-term results.",
        author: "Robin Sharma",
        category: "science"
    },
    {
        text: "Neurons that fire together, wire together.",
        author: "Donald Hebb",
        category: "science"
    },
    {
        text: "Habits are the compound interest of self-improvement.",
        author: "James Clear",
        category: "science"
    },
    {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb",
        category: "science"
    },
    {
        text: "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier",
        category: "science"
    },

    // Faith
    {
        text: "Verily, with hardship comes ease.",
        author: "Quran 94:6",
        category: "faith"
    },
    {
        text: "Take care of your body. It's the only place you have to live.",
        author: "Jim Rohn",
        category: "faith"
    },
    {
        text: "Patience is the key to relief.",
        author: "Ali ibn Abi Talib",
        category: "faith"
    },
    {
        text: "The best of people are those who are most beneficial to others.",
        author: "Prophet Muhammad ﷺ",
        category: "faith"
    },
    {
        text: "Trust in God, but tie your camel.",
        author: "Arabic Proverb",
        category: "faith"
    },

    // History
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain",
        category: "history"
    },
    {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela",
        category: "history"
    },
    {
        text: "The future belongs to those who prepare for it today.",
        author: "Malcolm X",
        category: "history"
    },
    {
        text: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein",
        category: "history"
    },
    {
        text: "Champions keep playing until they get it right.",
        author: "Billie Jean King",
        category: "history"
    },

    // General / Motivation
    {
        text: "Small wins compound quietly.",
        author: "CompoundVerse",
        category: "general"
    },
    {
        text: "Consistency beats intensity.",
        author: "CompoundVerse",
        category: "general"
    },
    {
        text: "Progress, not perfection.",
        author: "CompoundVerse",
        category: "general"
    },
    {
        text: "The system remembers when the human is tired.",
        author: "CompoundVerse",
        category: "general"
    },
    {
        text: "One day at a time, one verse at a time.",
        author: "CompoundVerse",
        category: "general"
    },
];

// Get a random quote
export function getRandomQuote(): Quote {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// Get quote by category
export function getQuoteByCategory(category: Quote['category']): Quote {
    const filtered = QUOTES.filter(q => q.category === category);
    return filtered[Math.floor(Math.random() * filtered.length)] || getRandomQuote();
}

// Get hourly quote (changes each hour)
export function getHourlyQuote(): Quote {
    const hour = new Date().getHours();
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = (dayOfYear * 24 + hour) % QUOTES.length;
    return QUOTES[index];
}

// Context-aware quote selection
export function getContextQuote(context: {
    perfectDay?: boolean;
    missedVerse?: string;
    streakRecovery?: boolean;
    firstDay?: boolean;
}): Quote {
    if (context.perfectDay) {
        return {
            text: "Perfect day achieved! All three domains in harmony. This is how legends are built.",
            author: "CompoundVerse",
            category: "general"
        };
    }

    if (context.streakRecovery) {
        return {
            text: "Welcome back. Every return is a victory. The streak starts again today.",
            author: "CompoundVerse",
            category: "general"
        };
    }

    if (context.firstDay) {
        return {
            text: "Your journey begins now. Small actions today, remarkable results tomorrow.",
            author: "CompoundVerse",
            category: "general"
        };
    }

    if (context.missedVerse) {
        const verseMessages: Record<string, Quote> = {
            health: {
                text: "Your body is your temple. Even a short walk counts.",
                author: "CompoundVerse",
                category: "general"
            },
            faith: {
                text: "A moment of gratitude can shift your entire day.",
                author: "CompoundVerse",
                category: "general"
            },
            career: {
                text: "Learning is a gift you give to your future self.",
                author: "CompoundVerse",
                category: "general"
            },
        };
        return verseMessages[context.missedVerse] || getRandomQuote();
    }

    return getHourlyQuote();
}
