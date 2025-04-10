import { GameState, GameEvent, Client } from "@shared/schema";
import { getClient } from "@/lib/gameData";

// Core components for dynamically generating questions with focus on low-income clients and obstacles
const situations = {
  // Level 0: Awareness - Background situations for low-income clients
  awareness: [
    { 
      trait: "a part-time retail worker who is confused", 
      context: "about health insurance terminology and eligibility for subsidies"
    },
    { 
      trait: "working multiple jobs and skeptical", 
      context: "about whether they can afford any health insurance on their limited income" 
    },
    { 
      trait: "a gig worker who is young and healthy", 
      context: "and doesn't think they can spare any money for health insurance" 
    },
    { 
      trait: "unemployed and worried", 
      context: "about how they'll afford coverage with a pre-existing condition" 
    },
    { 
      trait: "working at a small restaurant with no benefits and concerned", 
      context: "about having to choose between paying rent and getting health insurance" 
    },
    { 
      trait: "a recent immigrant overwhelmed", 
      context: "by the American healthcare system and their limited options" 
    },
    { 
      trait: "a seasonal worker who is misinformed", 
      context: "about eligibility for marketplace subsidies and Medicaid expansion" 
    },
    { 
      trait: "recently laid off and anxious", 
      context: "about losing their employer coverage and what options they have" 
    }
  ],
  
  // Level 1: Enrollment - Background situations with obstacles
  enrollment: [
    { 
      trait: "stressed and facing eviction", 
      context: "while trying to complete enrollment before the deadline expires" 
    },
    { 
      trait: "struggling with unreliable internet access while comparing", 
      context: "different health plans in the limited time they have at the public library" 
    },
    { 
      trait: "working night shifts and missed", 
      context: "the open enrollment period because they couldn't take time off to apply" 
    },
    { 
      trait: "a single parent with limited English proficiency applying", 
      context: "for marketplace subsidies without access to translation services" 
    },
    { 
      trait: "starting a minimum wage job and deciding", 
      context: "if they should take the expensive employer plan or risk going uninsured" 
    },
    { 
      trait: "in a multigenerational household and confused", 
      context: "about which family members qualify for which programs" 
    },
    { 
      trait: "working variable hours and uncertain", 
      context: "how to estimate their annual income for subsidy calculations" 
    },
    { 
      trait: "living in a rural area with transportation issues and wondering", 
      context: "how to get the required documentation to a Medicaid office" 
    }
  ],
  
  // Level 2: Utilization - Background situations with barriers
  utilization: [
    { 
      trait: "without reliable transportation and trying", 
      context: "to find an in-network specialist that's accessible by public transit" 
    },
    { 
      trait: "working without paid time off and received", 
      context: "a claim denial for a procedure they couldn't postpone" 
    },
    { 
      trait: "with limited literacy skills and struggling", 
      context: "to understand their explanation of benefits statement" 
    },
    { 
      trait: "rushed to the nearest emergency room and now upset", 
      context: "about a $5,000 surprise bill from an out-of-network provider" 
    },
    { 
      trait: "unable to take time off work and required", 
      context: "to complete a complex prior authorization process for urgent care" 
    },
    { 
      trait: "diabetic and managing", 
      context: "their condition with expired insulin because they can't afford the copays" 
    },
    { 
      trait: "rationing medications and concerned", 
      context: "about how to afford their life-saving prescriptions on minimum wage" 
    },
    { 
      trait: "suffering from chronic pain and planning", 
      context: "to skip follow-up treatments because they can't afford the deductible" 
    }
  ]
};

// Titles for each level
const titles = {
  awareness: [
    "Health Insurance Basics",
    "Insurance Fundamentals",
    "Coverage Essentials",
    "Understanding Insurance",
    "Insurance Planning",
    "Health Coverage 101",
    "Protection Basics",
    "Insurance Overview"
  ],
  enrollment: [
    "Plan Selection",
    "Enrollment Process",
    "Coverage Options",
    "Choosing a Plan",
    "Insurance Application",
    "Marketplace Navigation",
    "Plan Comparison",
    "Enrollment Decisions"
  ],
  utilization: [
    "Using Your Benefits",
    "Insurance Navigation",
    "Claim Management",
    "Coverage Optimization",
    "Care Coordination",
    "Insurance Utilization",
    "Benefits Maximization",
    "Network Management"
  ]
};

// Specific challenges for each level with focus on low-income obstacles
const challenges = {
  awareness: [
    "doesn't understand how insurance works and must decide whether to pay for utilities or health coverage",
    "is confused about eligibility for Medicaid in their state which has complex work requirements",
    "isn't sure if they should spend their limited income on health insurance or food",
    "lives in a rural area with few healthcare providers and wonders if insurance would even help them",
    "is worried about being denied coverage due to pre-existing conditions and can't afford to see a doctor",
    "is overwhelmed by all the different insurance terms while working two jobs with no time to research",
    "doesn't know what the Affordable Care Act covers and has heard it might be repealed soon",
    "has heard conflicting advice about health insurance from coworkers who are also uninsured",
    "thinks health insurance is too expensive to be worth it on their minimum wage job",
    "is concerned about what happens if they don't have insurance but can't spare $50 a month",
    "wonders if catastrophic coverage is enough as they have no savings for emergencies",
    "is trying to understand how networks work in their area where many doctors don't take insurance"
  ],
  enrollment: [
    "needs to choose between health insurance and paying off past medical debt that's in collections",
    "is confused about enrollment deadlines and risks losing phone service to pay the first premium",
    "is trying to determine if they qualify for subsidies with unstable seasonal income",
    "doesn't have all the documents needed for the application because they're housing insecure",
    "is overwhelmed by plan choices but their current medications cost more than their monthly rent",
    "isn't sure if the clinic that offers sliding scale fees is in any insurance network",
    "needs to add family members to their plan but some are not documented citizens",
    "is considering a high-deductible plan but has no way to save for the deductible amount",
    "missed open enrollment because they were hospitalized and now faces a coverage gap",
    "is comparing plans but can't afford any option that includes their current doctor",
    "doesn't understand why the cheapest plans won't cover the hospital closest to their home",
    "wants to know if insulin would be covered but can't get clear answers from any insurer"
  ],
  utilization: [
    "received a claim denial but can't take time off work to appeal it and needs the medication",
    "needs to find a specialist who takes their insurance and offers evening appointments",
    "can't understand their EOB and is afraid they'll be sent to collections for bills they thought were covered",
    "is confused about preventive services coverage when they already have symptoms they've been ignoring",
    "needs to appeal an insurance decision but lacks internet access to file the forms online",
    "was told they need prior authorization but their doctor's office charges extra to handle the paperwork",
    "received a $3,000 bill from an out-of-network provider they never chose during an emergency",
    "is rationing insulin because even with insurance the copays are too high for their budget",
    "wants to know how to get the most from their plan but can't afford the copays for recommended screenings",
    "had emergency care during their overnight shift job and was forced to go out-of-network",
    "is avoiding a recommended procedure because they can't afford to take unpaid time off work",
    "is managing a chronic condition but can't afford the specialist copays on their custodial worker salary"
  ]
};

// Question prompts for each level that address systemic and financial barriers
const prompts = {
  awareness: [
    "How would you explain these insurance concepts while acknowledging their financial constraints?",
    "How would you help them understand the value of health insurance when they're struggling to meet basic needs?",
    "What would you tell them about the importance of coverage even when they feel they can't afford it?",
    "How would you explain insurance protections while respecting their difficult financial situation?",
    "What information would you provide about pre-existing condition coverage options for someone with limited income?",
    "How would you break down low-cost health plan options in simple terms for someone with minimal free time to research?",
    "What key points would you emphasize about public programs like Medicaid and subsidized marketplace plans?",
    "How would you explain premium subsidies and cost-sharing reductions that might make insurance more affordable?",
    "What advice would you give about evaluating insurance needs on a very limited budget?",
    "How would you help them find resources to assist with navigating the complex health insurance system?"
  ],
  enrollment: [
    "How would you help them compare plans when every dollar in their budget matters?",
    "What factors should they prioritize when selecting a plan with serious financial constraints?",
    "How would you advise them about enrollment options when they face multiple life challenges simultaneously?",
    "What would you explain about qualifying for maximum subsidies with irregular or seasonal income?",
    "How would you guide them through enrollment challenges with limited internet access or technology skills?",
    "What should they consider regarding network coverage when transportation is also an issue?",
    "What advice would you give about coverage options for a mixed-immigration status family?",
    "How would you help them evaluate their limited options with challenging work schedules?",
    "What would you tell them about qualifying for special enrollment periods due to changes in their situation?",
    "How would they navigate coverage options when they have critical medication needs but limited funds?"
  ],
  utilization: [
    "How would you help them address this claim denial while considering their work schedule and transportation barriers?",
    "What process would you recommend for finding accessible in-network specialists when they face multiple constraints?",
    "How would you explain EOB statements in a way that addresses their concerns about unexpected bills?",
    "What would you tell them about accessing preventive care when they can't afford to miss work?",
    "How would you guide them through the appeals process considering their limited resources?",
    "What would you explain about navigating prior authorization when facing system barriers?",
    "How would you advise them about handling surprise bills when they're already financially vulnerable?",
    "What would you explain about prescription assistance programs and affordable medication options?",
    "What strategies would you suggest for maximizing benefits while minimizing out-of-pocket costs?",
    "How would you help them prioritize care needs when financial resources are extremely limited?"
  ]
};

/**
 * Dynamically generates a unique question based on the game state
 */
export const generateQuestion = (gameState: GameState): GameEvent => {
  const level = gameState.level;
  const levelName = level === 0 ? "awareness" : (level === 1 ? "enrollment" : "utilization");
  
  // Get client name from the client object
  const client = gameState.client || getClient(gameState.clientId);
  const clientName = client.name;
  
  // Generate a unique ID for this question based on timestamp and random factor
  const timestamp = Date.now();
  const randomFactor = Math.floor(Math.random() * 1000);
  const questionId = level * 100000 + timestamp % 10000 + randomFactor;
  
  // Randomly select components to build a unique question
  const situation = situations[levelName][Math.floor(Math.random() * situations[levelName].length)];
  const title = titles[levelName][Math.floor(Math.random() * titles[levelName].length)];
  const challenge = challenges[levelName][Math.floor(Math.random() * challenges[levelName].length)];
  const prompt = prompts[levelName][Math.floor(Math.random() * prompts[levelName].length)];
  
  // Build the question description
  const description = `Your client ${clientName} is ${situation.trait} ${situation.context}. They ${challenge}.`;
  
  // Create the event object
  return {
    id: questionId,
    title: title,
    description: description,
    prompt: prompt,
    level: level,
    healthImpact: 0, // Default value
    options: [], // Using free text input, so no predefined options needed
  };
};

/**
 * Generates a batch of sample questions for a specific level
 * (Useful for testing or showing the variety of questions possible)
 */
export const getQuestionsForLevel = (level: number, count: number = 5): GameEvent[] => {
  const questions: GameEvent[] = [];
  
  for (let i = 0; i < count; i++) {
    const mockGameState: GameState = {
      clientId: 1,
      level: level,
      turn: 1,
      score: 0,
      clientHealth: 100,
      clientKnowledge: 0,
      clientConfidence: 0,
      levelProgress: [0, 0, 0],
      insuranceStatus: "Uninsured",
      events: [],
      completedEvents: [],
      client: getClient(1)
    };
    
    questions.push(generateQuestion(mockGameState));
  }
  
  return questions;
};