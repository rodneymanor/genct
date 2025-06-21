export interface ScriptTemplate {
  id: string;
  content: string;
  category: 'hooks' | 'bridges' | 'nuggets' | 'wtas';
}

export const scriptTemplates: Record<string, ScriptTemplate[]> = {
  hooks: [
    {
      id: "learned-from-unexpected",
      content: "I learned this [Effective Strategy] from an [Unexpected Source].",
      category: "hooks"
    },
    {
      id: "number-hacks",
      content: "Here are [Number] hacks to [Achieve a Desired Outcome].",
      category: "hooks"
    },
    {
      id: "common-belief-wrong",
      content: "If I told you that [Common Belief] is wrong, you might not believe me. But what if...",
      category: "hooks"
    },
    {
      id: "achieve-from-zero",
      content: "How to achieve [Desired Outcome] when you're starting from zero.",
      category: "hooks"
    },
    {
      id: "secret-not-what-think",
      content: "The secret to [Topic] is not what you think.",
      category: "hooks"
    },
    {
      id: "cant-have-both",
      content: "You can't have [Desirable Thing A] and [Desirable Thing B] at the same time.",
      category: "hooks"
    },
    {
      id: "fear-greatest-advantage",
      content: "What if the thing you fear most about [Topic] is actually your greatest advantage?",
      category: "hooks"
    },
    {
      id: "fastest-way-learn",
      content: "The fastest way to learn [Skill] is to stop trying to learn and start doing [Action].",
      category: "hooks"
    },
    {
      id: "struggling-reasons",
      content: "You are likely struggling with [Topic] because of one of these [Number] reasons.",
      category: "hooks"
    },
    {
      id: "lesson-wish-learned",
      content: "A lesson I wish I learned earlier is that anything truly [Adjective] takes far longer than you expect.",
      category: "hooks"
    }
  ],
  bridges: [
    {
      id: "most-people-try",
      content: "Most people try to solve this by [Common but Ineffective Action].",
      category: "bridges"
    },
    {
      id: "conditioned-believe",
      content: "The problem is, we are conditioned to believe that [Common Misconception].",
      category: "bridges"
    },
    {
      id: "turn-negative-positive",
      content: "But you can turn a [Negative Aspect] into a [Positive Advantage]. Here's how.",
      category: "bridges"
    },
    {
      id: "path-not-expected",
      content: "The path to [Desired Outcome] isn't about [Expected Method], but about [Unexpected Method].",
      category: "bridges"
    },
    {
      id: "only-thing-matters",
      content: "The only thing that truly matters for [Achieving Goal] is your ability to [Core Principle].",
      category: "bridges"
    },
    {
      id: "ideas-contradict",
      content: "These two ideas seem to contradict each other, and that internal conflict is the source of your [Negative Emotion].",
      category: "bridges"
    },
    {
      id: "solution-simple-word",
      content: "The solution lies in understanding one simple word: \"but\".",
      category: "bridges"
    },
    {
      id: "secret-not-learning",
      content: "The secret isn't learning a new skill, but in finding someone who already does it.",
      category: "bridges"
    }
  ],
  nuggets: [
    {
      id: "but-reversal",
      content: "The \"But\" Reversal: To be more persuasive, state the negatives first. Say \"[Topic] is [Challenge 1] and [Challenge 2], but it delivers [Superior Result].\" This magnifies the benefit.",
      category: "nuggets"
    },
    {
      id: "identity-shift",
      content: "The Identity Shift: To change your actions, first change your identity. Don't just do the work of a [Desired Role]; decide that you are a [Desired Role]. Actions will follow the new identity.",
      category: "nuggets"
    },
    {
      id: "price-admission",
      content: "The Price of Admission: [Desired Outcome] is the result of [Difficult Prerequisite]. You cannot have one without the other. Stop avoiding the challenge that creates the growth you want.",
      category: "nuggets"
    },
    {
      id: "power-endurance",
      content: "The Power of Endurance: Success is often a game of volume and resilience. Your key advantage is your willingness to [Take Action] more times than anyone else.",
      category: "nuggets"
    },
    {
      id: "constraint-principle",
      content: "The Constraint Principle: You would be amazed at what you can endure when you have a clear endpoint. The fact that you feel [Negative Emotion] is proof that you are still in the game.",
      category: "nuggets"
    },
    {
      id: "foundation-first",
      content: "The Foundation First: True growth happens below the surface. If you build your [Goal] without first building the [Required Foundation] (e.g., character, systems), it will collapse.",
      category: "nuggets"
    },
    {
      id: "focus-imperative",
      content: "The Focus Imperative: You have limited resources (time, effort, money). You must focus them on a single point to achieve a breakthrough. Stop diversifying your efforts before you've had a single major success.",
      category: "nuggets"
    },
    {
      id: "never-stop-commitment",
      content: "The \"Never Stop\" Commitment: You don't need to know if you will succeed. You only need to commit to never stopping. On a long enough timeline, persistence guarantees progress.",
      category: "nuggets"
    },
    {
      id: "higher-standard",
      content: "The Higher Standard: The primary difference between those who succeed and those who don't is having a higher minimum standard for what they will accept in their lives. Say \"no\" to good opportunities to save your energy for great ones.",
      category: "nuggets"
    }
  ],
  wtas: [
    {
      id: "how-far-really",
      content: "That's how far you really are from the [Desired Outcome] you've been putting off.",
      category: "wtas"
    },
    {
      id: "use-principle",
      content: "And that's how you can use [The Principle] to achieve [Your Goal].",
      category: "wtas"
    },
    {
      id: "might-as-well",
      content: "So you might as well [Take the First Step].",
      category: "wtas"
    },
    {
      id: "determine-effort",
      content: "If you can determine the [Required Effort] to get the [Desired Outcome], you can disregard all other distractions.",
      category: "wtas"
    },
    {
      id: "better-disliked",
      content: "Remember, it's better to be [Disliked] for who you are than [Liked] for who you are not.",
      category: "wtas"
    }
  ]
};

export const getCategoryDisplayName = (category: string): string => {
  const displayNames: Record<string, string> = {
    hooks: "Hooks (Attention-Grabbing Openers)",
    bridges: "Bridges (Connecting the Hook to the Core Idea)",
    nuggets: "Golden Nuggets (The Core Lesson or Strategy)",
    wtas: "WTAs (Calls to Action / Concluding Thoughts)"
  };
  return displayNames[category] || category;
}; 