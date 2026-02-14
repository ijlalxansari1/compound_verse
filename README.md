# CompoundVerse 🌌

> **Small Wins Compound Quietly.**
> An AI-powered, gamified Life Operating System designed to help you build habits, track consistency, and level up your life.

![CompoundVerse Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)

## ✨ Features

### 🧠 **AI-Powered Architecture**
- **Dynamic Greeting**: Context-aware AI greetings based on time, streak, and mood.
- **Weekly Analysis**: GPT-4o powered insights into your consistency and balance across domains.
- **Smart Starter Packs**: AI generates personalized habit stacks based on your desired identity (e.g., "Stoic Founder", "Fit Dad").

### 🎮 **Gamification Engine**
- **XP System**: Earn XP for every check-in.
- **Leveling**: visual progress bar and level tracking.
- **Streaks**: Maintain daily consistency to unlock multipliers.
- **Badges**: Unlock achievements for milestones (e.g., "Early Bird", "Weekend Warrior").
- **Confetti & Feedback**: instant positive reinforcement for perfect days.

### 🎨 **Premium UI/UX**
- **Glassmorphism Design**: Modern, frosted-glass aesthetic with ambient aurora backgrounds.
- **Smooth Animations**: Powered by `framer-motion` for buttery interactions.
- **Dark Mode Native**: Optimized for focus and visual comfort (`midnight` and `nebula` themes).

### 🛡️ **Robust Architecture**
- **Authentication**: Secure Magic Link login via Supabase SSR.
- **Offline Capable**: React Query persist ensuring data availability even offline.
- **Performance**: Lazy loading, image optimization, and Skeleton states for fast LCP.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **AI**: [OpenAI API](https://platform.openai.com/) (GPT-4o-mini)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase Project
- An OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ijlalxansari1/compound_verse.git
   cd compound_verse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Project Structure

```
src/
├── app/              # App Router pages and layouts
│   ├── api/          # API Routes (AI endpoints)
│   ├── auth/         # Auth Callback handlers
│   └── page.tsx      # Main Dashboard
├── components/       # Reusable UI components
│   ├── ui/           # Shadcn primitive components
│   ├── AuthPage.tsx  # Login Screen
│   ├── LandingPage.tsx # Public AI Landing Page
│   └── ...
├── hooks/            # Custom React Hooks (useAuth, useHabits)
├── lib/              # Utilities and Configurations
│   ├── ai/           # OpenAI Client & Service
│   ├── supabase/     # Supabase Client & Server utils
│   └── utils.ts      # Helper functions
└── providers/        # Context Providers (Query, AuthListener)
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

> Built with ❤️ by the CompoundVerse Team.
