import { Client, GameEvent } from "@shared/schema";
import { generateClient } from './clientGenerator';

// Level Names
export const levelNames = ["Awareness", "Enrollment", "Utilization"];

// Events by level
export const events: GameEvent[] = [
  // Level 1: Awareness Events
  {
    id: 1,
    title: "Insurance Literacy Challenge",
    description: "Your client has encountered terminology they don't understand, like \"deductible\", \"premium\", and \"co-pay\". This is causing anxiety and hesitation.",
    level: 0,
    healthImpact: -10,
    options: [
      {
        id: 1,
        text: "Explain key terms using simple analogies",
        healthEffect: 5,
        knowledgeEffect: 15,
        confidenceEffect: 10,
        scoreEffect: 25,
        turnEffect: 0,
        outcome: "You explained insurance terms using everyday analogies. Your client now understands that a premium is like a monthly subscription fee, and a deductible is similar to a damage deposit that must be paid before insurance kicks in."
      },
      {
        id: 2,
        text: "Provide a glossary of insurance terms",
        healthEffect: 0,
        knowledgeEffect: 10,
        confidenceEffect: 5,
        scoreEffect: 15,
        turnEffect: 0,
        outcome: "You provided a comprehensive glossary of insurance terms. While helpful as a reference, your client still feels a bit overwhelmed by the amount of new information."
      },
      {
        id: 3,
        text: "Schedule a call with an insurance representative",
        healthEffect: 5,
        knowledgeEffect: 20,
        confidenceEffect: 15,
        scoreEffect: 30,
        turnEffect: 1,
        outcome: "The insurance representative patiently explained key terms. This took extra time to arrange, but your client now has a much deeper understanding of insurance terminology."
      }
    ]
  },
  {
    id: 2,
    title: "Healthcare Costs Concern",
    description: "Your client is worried about the cost of health insurance and doesn't see the value compared to paying out-of-pocket for occasional doctor visits.",
    level: 0,
    healthImpact: -15,
    options: [
      {
        id: 1,
        text: "Break down potential catastrophic medical costs",
        healthEffect: 10,
        knowledgeEffect: 20,
        confidenceEffect: 15,
        scoreEffect: 30,
        turnEffect: 0,
        outcome: "You showed examples of how expensive emergency care can be without insurance. Your client now understands that insurance is protection against financial devastation, not just for routine care."
      },
      {
        id: 2,
        text: "Explain preventive care benefits",
        healthEffect: 5,
        knowledgeEffect: 15,
        confidenceEffect: 10,
        scoreEffect: 20,
        turnEffect: 0,
        outcome: "You explained how many preventive services are covered at 100% under ACA plans. Your client is pleased to learn that annual check-ups and screenings won't cost additional money."
      },
      {
        id: 3,
        text: "Create a personalized cost-benefit analysis",
        healthEffect: 15,
        knowledgeEffect: 25,
        confidenceEffect: 20,
        scoreEffect: 40,
        turnEffect: 1,
        outcome: "You created a detailed cost comparison based on your client's typical healthcare usage. Seeing the numbers made a compelling case for the value of insurance."
      }
    ]
  },
  {
    id: 3,
    title: "Pre-existing Condition Fears",
    description: "Your client has a chronic health condition and is afraid they'll be denied coverage or charged much more for insurance.",
    level: 0,
    healthImpact: -20,
    options: [
      {
        id: 1,
        text: "Explain ACA protections for pre-existing conditions",
        healthEffect: 15,
        knowledgeEffect: 20,
        confidenceEffect: 25,
        scoreEffect: 35,
        turnEffect: 0,
        outcome: "You explained that the Affordable Care Act prohibits insurers from denying coverage or charging more based on pre-existing conditions. Your client is greatly relieved by this information."
      },
      {
        id: 2,
        text: "Connect with a patient advocacy group",
        healthEffect: 10,
        knowledgeEffect: 15,
        confidenceEffect: 20,
        scoreEffect: 25,
        turnEffect: 1,
        outcome: "The advocacy group provided additional resources and support. Your client feels more empowered knowing there's a community of people with similar concerns."
      },
      {
        id: 3,
        text: "Research specific coverage for their condition",
        healthEffect: 20,
        knowledgeEffect: 25,
        confidenceEffect: 30,
        scoreEffect: 45,
        turnEffect: 1,
        outcome: "You found detailed information about how different plans cover treatments for your client's specific condition. This targeted research made them feel much more confident about finding appropriate coverage."
      }
    ]
  },
  // Level 2: Enrollment Events
  {
    id: 4,
    title: "Plan Selection Overwhelm",
    description: "Your client is overwhelmed by the number of insurance plans available and is struggling to compare them effectively.",
    level: 1,
    healthImpact: -15,
    options: [
      {
        id: 1,
        text: "Narrow down options based on key priorities",
        healthEffect: 10,
        knowledgeEffect: 15,
        confidenceEffect: 20,
        scoreEffect: 30,
        turnEffect: 0,
        outcome: "You helped your client identify their top healthcare priorities and eliminated plans that don't meet these needs. This made the decision process much more manageable."
      },
      {
        id: 2,
        text: "Create a side-by-side comparison chart",
        healthEffect: 5,
        knowledgeEffect: 20,
        confidenceEffect: 15,
        scoreEffect: 25,
        turnEffect: 0,
        outcome: "Your organized comparison chart made it easier to see the differences between plans. Your client appreciated the visual aid to help process the information."
      },
      {
        id: 3,
        text: "Consult with an insurance broker",
        healthEffect: 15,
        knowledgeEffect: 25,
        confidenceEffect: 25,
        scoreEffect: 40,
        turnEffect: 1,
        outcome: "The broker provided expert guidance tailored to your client's situation. While it took extra time, your client now feels confident they're choosing the right plan with professional advice."
      }
    ]
  },
  {
    id: 5,
    title: "Missed Enrollment Deadline Risk",
    description: "Your client is approaching the end of the open enrollment period and hasn't completed their application yet.",
    level: 1,
    healthImpact: -25,
    options: [
      {
        id: 1,
        text: "Schedule an emergency enrollment session",
        healthEffect: 20,
        knowledgeEffect: 10,
        confidenceEffect: 20,
        scoreEffect: 35,
        turnEffect: 1,
        outcome: "You set aside dedicated time to help complete the application before the deadline. Your client is relieved to have avoided a potentially year-long wait for coverage."
      },
      {
        id: 2,
        text: "Research qualifying life events",
        healthEffect: 5,
        knowledgeEffect: 20,
        confidenceEffect: 10,
        scoreEffect: 20,
        turnEffect: 0,
        outcome: "You explained special enrollment periods and qualifying life events. While helpful knowledge, this doesn't solve the immediate deadline problem."
      },
      {
        id: 3,
        text: "Contact the marketplace for assistance",
        healthEffect: 15,
        knowledgeEffect: 15,
        confidenceEffect: 15,
        scoreEffect: 30,
        turnEffect: 0,
        outcome: "A marketplace representative helped expedite the enrollment process. Your client was able to complete their application with official guidance."
      }
    ]
  },
  {
    id: 6,
    title: "Network Coverage Confusion",
    description: "Your client is concerned about whether their preferred doctors and hospitals are in-network for the plan they're considering.",
    level: 1,
    healthImpact: -10,
    options: [
      {
        id: 1,
        text: "Check the provider directory together",
        healthEffect: 10,
        knowledgeEffect: 15,
        confidenceEffect: 20,
        scoreEffect: 30,
        turnEffect: 0,
        outcome: "You helped search the insurer's provider directory and confirmed which of your client's doctors are in-network. They're pleased to see their primary care physician is covered."
      },
      {
        id: 2,
        text: "Call providers to verify network status",
        healthEffect: 15,
        knowledgeEffect: 20,
        confidenceEffect: 25,
        scoreEffect: 40,
        turnEffect: 1,
        outcome: "By calling the medical offices directly, you got the most up-to-date network information. This extra verification gives your client peace of mind about their coverage."
      },
      {
        id: 3,
        text: "Explain out-of-network coverage options",
        healthEffect: 5,
        knowledgeEffect: 25,
        confidenceEffect: 15,
        scoreEffect: 25,
        turnEffect: 0,
        outcome: "You explained how out-of-network benefits work and what costs to expect. Your client now understands they have options even if preferred providers aren't in-network, though at higher cost."
      }
    ]
  },
  // Level 3: Utilization Events
  {
    id: 7,
    title: "Surprise Medical Bill",
    description: "Your client received an unexpected bill for a procedure they thought was covered by insurance.",
    level: 2,
    healthImpact: -30,
    options: [
      {
        id: 1,
        text: "Review the Explanation of Benefits (EOB)",
        healthEffect: 10,
        knowledgeEffect: 20,
        confidenceEffect: 15,
        scoreEffect: 30,
        turnEffect: 0,
        outcome: "By comparing the bill with the EOB, you identified a potential billing error. Your client now understands how to verify charges against their benefits statement."
      },
      {
        id: 2,
        text: "File an appeal with the insurance company",
        healthEffect: 25,
        knowledgeEffect: 25,
        confidenceEffect: 20,
        scoreEffect: 45,
        turnEffect: 1,
        outcome: "The appeal process worked! The insurance company agreed to cover more of the procedure after reviewing the medical necessity documentation."
      },
      {
        id: 3,
        text: "Negotiate a payment plan with the provider",
        healthEffect: 15,
        knowledgeEffect: 15,
        confidenceEffect: 15,
        scoreEffect: 30,
        turnEffect: 0,
        outcome: "The medical provider agreed to a reasonable payment plan without interest. Your client is relieved to have manageable monthly payments rather than a large lump sum."
      }
    ]
  },
  {
    id: 8,
    title: "Prescription Drug Coverage Issue",
    description: "Your client's medication isn't covered by their insurance formulary, and the alternative is less effective for them.",
    level: 2,
    healthImpact: -20,
    options: [
      {
        id: 1,
        text: "Request a formulary exception",
        healthEffect: 20,
        knowledgeEffect: 20,
        confidenceEffect: 15,
        scoreEffect: 40,
        turnEffect: 1,
        outcome: "The doctor provided medical justification and the insurance approved the exception. Your client can now get their preferred medication at the standard copay amount."
      },
      {
        id: 2,
        text: "Apply for a patient assistance program",
        healthEffect: 15,
        knowledgeEffect: 15,
        confidenceEffect: 20,
        scoreEffect: 35,
        turnEffect: 0,
        outcome: "The pharmaceutical company's assistance program significantly reduced the cost of the medication. Your client can now afford their preferred treatment."
      },
      {
        id: 3,
        text: "Explore therapeutic alternatives with the doctor",
        healthEffect: 10,
        knowledgeEffect: 25,
        confidenceEffect: 10,
        scoreEffect: 25,
        turnEffect: 0,
        outcome: "The doctor suggested a covered medication that might work similarly. Your client is willing to try it but remains concerned about effectiveness."
      }
    ]
  },
  {
    id: 9,
    title: "Preventive Care Underutilization",
    description: "Your client has insurance but isn't using any of the free preventive services they're entitled to receive.",
    level: 2,
    healthImpact: -15,
    options: [
      {
        id: 1,
        text: "Create a preventive care checklist",
        healthEffect: 20,
        knowledgeEffect: 15,
        confidenceEffect: 10,
        scoreEffect: 30,
        turnEffect: 0,
        outcome: "Your personalized checklist highlighted age and gender-appropriate screenings. Your client has scheduled their annual physical and relevant preventive tests."
      },
      {
        id: 2,
        text: "Set up appointment reminders",
        healthEffect: 15,
        knowledgeEffect: 10,
        confidenceEffect: 20,
        scoreEffect: 25,
        turnEffect: 0,
        outcome: "The reminder system you created helps your client stay on top of their preventive care. They're more likely to attend appointments with advance notice."
      },
      {
        id: 3,
        text: "Explain the long-term health benefits",
        healthEffect: 25,
        knowledgeEffect: 25,
        confidenceEffect: 15,
        scoreEffect: 45,
        turnEffect: 0,
        outcome: "Your explanation about how preventive care can detect issues early made a strong impression. Your client now sees these services as valuable investments in their long-term health."
      }
    ]
  }
];

// Helper functions
export const getInitialGameState = (clientId: number = 1) => {
  return {
    clientId,
    level: 0, // Start at level 0 (Awareness)
    turn: 1,
    score: 0,
    clientHealth: 100,
    levelProgress: [0, 0, 0],
    insuranceStatus: "Uninsured",
    events: [],
    completedEvents: []
  };
};

export const getEventsForLevel = (level: number) => {
  return events.filter(event => event.level === level);
};

export const getRandomEvent = (level: number, completedEvents: number[]) => {
  const levelEvents = getEventsForLevel(level);
  const availableEvents = levelEvents.filter(event => !completedEvents.includes(event.id));

  if (availableEvents.length === 0) {
    return null; // No more events for this level
  }

  const randomIndex = Math.floor(Math.random() * availableEvents.length);
  return availableEvents[randomIndex];
};

export const getClient = (clientId: number) => {
  return generateClient(clientId);
};

export const getLevelName = (level: number) => {
  return levelNames[level] || "Unknown Level";
};

export const getEvent = (eventId: number) => {
  return events.find(event => event.id === eventId);
};