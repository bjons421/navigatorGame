import { EventOption, GameEvent } from "@shared/schema";

// Keywords map for different response categories
interface KeywordGroup {
  excellent: string[];
  good: string[];
  average: string[];
  poor: string[];
  harmful: string[];
}

// Keywords related to health insurance concepts - organized by level themes
const keywordMap: Record<string, KeywordGroup> = {
  // Level 0: Awareness - Keywords related to understanding health insurance basics
  awareness: {
    excellent: [
      "premium", "deductible", "copay", "coinsurance", "out-of-pocket", "network", 
      "preventive", "catastrophic", "coverage gap", "actuarial value", "formulary",
      "financial protection", "risk pooling", "tax penalty", "fine for uninsured",
      "medical bankruptcy", "emergency costs", "pre-existing condition protections",
      "lifetime limits", "essential health benefits", "subsidies", "financial assistance"
    ],
    good: [
      "health", "insurance", "coverage", "cost", "plan", "benefits", "affordable", 
      "enrollment", "eligible", "marketplace", "health plan", "medical expenses",
      "unexpected illness", "accidents", "affordable care act", "peace of mind",
      "security", "protect finances", "medical debt", "risk management"
    ],
    average: [
      "healthcare", "doctor", "hospital", "medical", "money", "help", "pay", 
      "price", "cost", "monthly payment", "annual fee", "checkups", "protection",
      "regular care", "service", "access", "visit physician"
    ],
    poor: [
      "expensive", "complicated", "confusing", "difficult", "unsure", "don't know", 
      "not sure", "unclear", "complex", "hard to understand", "overwhelming", 
      "too many options", "not worth it", "too hard"
    ],
    harmful: [
      "ignore", "don't need", "waste", "scam", "useless", "ripoff", "wait until sick", 
      "lying", "fake", "better off without", "unnecessary", "young and healthy", 
      "never get sick", "hospital charity", "pay cash", "just use emergency room",
      "avoid doctors", "better to save money", "prefer natural remedies"
    ]
  },
  
  // Level 1: Enrollment - Keywords related to plan selection and enrollment
  enrollment: {
    excellent: [
      "compare plans", "provider network", "eligibility", "subsidy", "metal tier", 
      "formulary", "open enrollment", "special enrollment", "tax credit", "bronze", 
      "silver", "gold", "platinum", "provider network", "qualified health plan",
      "premium tax credit", "cost-sharing reductions", "network breadth",
      "doctor availability", "hospital tier", "prescription drug coverage",
      "marketplace application", "income documentation", "family size", "APTC",
      "special enrollment period", "qualifying life event"
    ],
    good: [
      "plan options", "coverage levels", "monthly premium", "choose", "enroll", 
      "application deadline", "health insurance marketplace", "deductible comparison", 
      "copay structure", "provider list", "drug list", "MAGI", "cost calculator",
      "estimate subsidies", "enrollment assistance", "navigator", "broker",
      "health connector", "state marketplace", "exchange"
    ],
    average: [
      "health plan", "insurance card", "sign up", "pick a plan", "affordable option",
      "deadline approaching", "doctor list", "medications covered", "website",
      "account creation", "verify income", "choose plan", "premium amount"
    ],
    poor: [
      "expensive options", "confusing choices", "difficult website", "unsure which plan", 
      "delay enrollment", "later deadline", "not important now", "too many questions",
      "complicated forms", "intrusive questions", "identity verification issues",
      "technical problems", "enrollment glitches"
    ],
    harmful: [
      "skip enrollment", "fraudulent information", "fake identity", "lie about income", 
      "don't report changes", "unnecessary coverage", "avoid the mandate", 
      "ignore deadline", "hide information", "misrepresent health status",
      "understating income", "not reporting family members", "hiding resources",
      "falsifying documents", "intentional omissions"
    ]
  },
  
  // Level 2: Utilization - Keywords related to using insurance effectively
  utilization: {
    excellent: [
      "preventive services", "in-network providers", "explanation of benefits", 
      "prior authorization", "appeal process", "network negotiation", "health savings account", 
      "flexible spending account", "EOB review", "cost sharing structure", "claim form submission",
      "referral requirements", "benefits verification", "provider billing practices",
      "coordination of benefits", "out-of-network exceptions", "annual wellness visit",
      "preventive screenings", "claim denial procedures", "formulary exceptions",
      "step therapy", "utilization review", "emergency care coverage abroad",
      "medical necessity determination", "continuity of care"
    ],
    good: [
      "covered services", "claim submission", "benefits explanation", "copay structure", 
      "remaining deductible", "medical billing", "prescription tier", "primary care physician", 
      "specialist referral", "grievance process", "summary of benefits",
      "member portal", "digital ID card", "telemedicine coverage", "urgent care benefits",
      "mail order pharmacy", "emergency vs. urgent care", "pre-procedure estimation"
    ],
    average: [
      "health service", "doctor visit", "medicine coverage", "treatment approval", 
      "appointment scheduling", "routine visit", "emergency room", "prescription drugs",
      "finding doctors", "hospital care", "wellness program", "health plan card"
    ],
    poor: [
      "expensive treatment", "complicated system", "confusing bills", "denied claim", 
      "rejected service", "can't afford medications", "too much paperwork",
      "surprise billing", "hidden fees", "unclear coverage", "long wait times",
      "difficult authorization", "restricted coverage", "balance billing"
    ],
    harmful: [
      "avoid recommended care", "skip prescribed medicine", "ignore symptoms", 
      "refuse to pay bills", "fabricate medical information", "lie to insurance provider", 
      "skip recommended screenings", "don't fill prescriptions", "use someone else's card",
      "share medications", "avoid disclosing conditions", "self-diagnose to avoid costs",
      "emergency room for routine care", "misrepresent medical necessity",
      "doctor shopping for prescriptions", "inappropriate use of services"
    ]
  }
};

// Score ranges
const scoreRanges = {
  excellent: { min: 30, max: 40 },
  good: { min: 20, max: 30 },
  average: { min: 10, max: 20 },
  poor: { min: 0, max: 10 }
};

// Key metrics that determine outcome effects
interface EvaluationEffects {
  healthEffect: number;
  knowledgeEffect: number;
  confidenceEffect: number;
  scoreEffect: number;
  turnEffect: number;
}

// Evaluation results based on category
const evaluationEffects: Record<string, EvaluationEffects> = {
  excellent: {
    healthEffect: 18,
    knowledgeEffect: 22,
    confidenceEffect: 22,
    scoreEffect: 35,
    turnEffect: 0
  },
  good: {
    healthEffect: 12,
    knowledgeEffect: 16,
    confidenceEffect: 12,
    scoreEffect: 25,
    turnEffect: 0
  },
  average: {
    healthEffect: -2,
    knowledgeEffect: 7,
    confidenceEffect: -2,
    scoreEffect: 8,
    turnEffect: 0
  },
  poor: {
    healthEffect: -8,
    knowledgeEffect: 2,
    confidenceEffect: -12,
    scoreEffect: -8,
    turnEffect: 0
  },
  harmful: {
    healthEffect: -18,
    knowledgeEffect: -8,
    confidenceEffect: -22,
    scoreEffect: -25,
    turnEffect: 1
  },
  ineffective: {
    healthEffect: -12,
    knowledgeEffect: -3,
    confidenceEffect: -18,
    scoreEffect: -12,
    turnEffect: 1
  }
};

// Outcome messages based on evaluation category
const outcomeMessages: Record<string, string[]> = {
  excellent: [
    "Your thorough and knowledgeable explanation greatly helped the client understand their situation. They feel much more confident now.",
    "The client is impressed by your expert guidance. Your detailed explanation addressed all their concerns perfectly.",
    "Your comprehensive approach showed deep understanding of the subject. The client feels they're in capable hands."
  ],
  good: [
    "Your helpful explanation addressed most of the client's concerns. They feel more confident moving forward.",
    "The client appreciates your knowledge and guidance. They have a better understanding of their options now.",
    "Your explanation was clear and helpful. The client feels more equipped to make decisions about their insurance."
  ],
  average: [
    "Your explanation provided minimal value. The client still has significant concerns that weren't addressed.",
    "The client struggles to apply your advice to their situation. They've become more hesitant about moving forward.",
    "Your explanation was too general and the client feels their time was wasted. Their confidence has decreased."
  ],
  poor: [
    "The client is more confused now than before your explanation. They're considering looking for help elsewhere.",
    "Your vague response left the client feeling ignored and frustrated. Their trust in you has diminished.",
    "The client found your explanation contradictory and unhelpful. They're now more skeptical about the entire process."
  ],
  harmful: [
    "Your advice alarmed the client and decreased their trust in the healthcare system. They're now more resistant to getting insurance.",
    "The client is frustrated by your suggestion, which they feel would put their health at risk. Their anxiety has increased significantly.",
    "Your recommendation seems to contradict sound health insurance principles. The client is now questioning your expertise and is considering looking elsewhere for help."
  ],
  ineffective: [
    "Despite your efforts, the client didn't respond well to your approach. They seem to have shut down and aren't engaging anymore.",
    "Your explanation, while technically correct, completely failed to connect with the client's situation. They feel misunderstood and discouraged.",
    "The client nodded politely but clearly didn't absorb what you were saying. Your message simply didn't get through, and they're more confused than before."
  ]
};

/**
 * Evaluates a text response based on keywords and context
 */
export const evaluateResponse = (
  text: string,
  event: GameEvent
): {
  category: string;
  effects: EvaluationEffects;
  outcome: string;
} => {
  // Normalize input text
  const normalizedText = text.toLowerCase();
  
  // Determine which keyword group to use based on level
  const levelKeywords = 
    event.level === 0 ? keywordMap.awareness :
    event.level === 1 ? keywordMap.enrollment :
    keywordMap.utilization;
  
  // Count keywords in each category
  let counts = {
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
    harmful: 0
  };
  
  // Check for keywords in the text
  Object.entries(levelKeywords).forEach(([category, keywords]) => {
    keywords.forEach((keyword: string) => {
      if (normalizedText.includes(keyword)) {
        counts[category as keyof typeof counts] += 1;
      }
    });
  });
  
  // Check for harmful keywords - these have higher impact
  let harmfulKeywordCount = counts.harmful || 0;
  
  // Calculate a weighted score
  const weightedScore = 
    counts.excellent * 5 + 
    counts.good * 3 + 
    counts.average * 1 - 
    counts.poor * 1;
  
  // Determine category based on score and harmful keywords
  let category: string;
  
  // Random chance of ineffective outcome (reduced to 10% chance)
  const randomFailureChance = Math.random();
  
  if (randomFailureChance < 0.10) {
    // Random failure - the approach was ineffective regardless of quality
    category = "ineffective";
  } else if (harmfulKeywordCount >= 2) {
    // Harmful responses take precedence if multiple harmful keywords are present
    category = "harmful";
  } else if (weightedScore >= 13) {
    // Reduced threshold for excellent - slightly easier to achieve
    category = "excellent";
  } else if (weightedScore >= 8) {
    // Reduced threshold for good - slightly easier to achieve
    category = "good";
  } else if (weightedScore >= 4) {
    // Reduced threshold for average - slightly easier to achieve
    category = "average";
  } else if (harmfulKeywordCount >= 1) {
    // Even a single harmful keyword can make a response harmful if the score is already low
    category = "harmful";
  } else {
    category = "poor";
  }
  
  // Get random outcome message for the category
  const messages = outcomeMessages[category];
  const outcome = messages[Math.floor(Math.random() * messages.length)];
  
  // Return evaluation results
  return {
    category,
    effects: evaluationEffects[category],
    outcome
  };
};

/**
 * Creates a virtual option object from text evaluation results
 */
export const createOptionFromEvaluation = (
  text: string,
  event: GameEvent
): EventOption => {
  const evaluation = evaluateResponse(text, event);
  
  return {
    id: 99, // Virtual ID for the custom response
    text: text.length > 50 ? text.substring(0, 50) + "..." : text,
    healthEffect: evaluation.effects.healthEffect,
    knowledgeEffect: evaluation.effects.knowledgeEffect,
    confidenceEffect: evaluation.effects.confidenceEffect,
    scoreEffect: evaluation.effects.scoreEffect,
    turnEffect: evaluation.effects.turnEffect,
    outcome: evaluation.outcome
  };
};