
import { Client } from "@shared/schema";

// Attributes that can affect gameplay
export interface ClientAttributes {
  technologicalProficiency: number; // 0-100
  healthStatus: {
    chronicConditions: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
  lifestyle: {
    employment: 'full-time' | 'part-time' | 'unemployed' | 'self-employed';
    familyResponsibilities: string[];
    schedule: 'flexible' | 'rigid';
    transportation: 'reliable' | 'limited' | 'none';
  };
  barriers: {
    language: 'none' | 'moderate' | 'significant';
    literacy: 'high' | 'medium' | 'low';
    internetAccess: 'reliable' | 'limited' | 'none';
  };
}

const chronicConditions = [
  'diabetes',
  'hypertension',
  'asthma',
  'heart disease',
  'arthritis',
  'none'
];

const familyResponsibilities = [
  'young children',
  'elderly parents',
  'disabled family member',
  'single parent',
  'none'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateClientAttributes(): ClientAttributes {
  return {
    technologicalProficiency: getRandomNumber(30, 100),
    healthStatus: {
      chronicConditions: [getRandomElement(chronicConditions)],
      riskLevel: getRandomElement(['low', 'medium', 'high'])
    },
    lifestyle: {
      employment: getRandomElement(['full-time', 'part-time', 'unemployed', 'self-employed']),
      familyResponsibilities: [getRandomElement(familyResponsibilities)],
      schedule: getRandomElement(['flexible', 'rigid']),
      transportation: getRandomElement(['reliable', 'limited', 'none'])
    },
    barriers: {
      language: getRandomElement(['none', 'moderate', 'significant']),
      literacy: getRandomElement(['high', 'medium', 'low']),
      internetAccess: getRandomElement(['reliable', 'limited', 'none'])
    }
  };
}

// Generate a unique avatar URL based on client attributes
function generateAvatarUrl(name: string, attributes: ClientAttributes): string {
  // Use different cartoon avatar styles based on attributes
  const seed = encodeURIComponent(name);
  
  // Determine avatar style based on client attributes
  if (attributes.lifestyle.familyResponsibilities.includes('young children')) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4&style=circle`;
  } else if (attributes.healthStatus.chronicConditions.includes('none')) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=d1d4f9&style=circle`;
  } else {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=ffdfbf&style=circle`;
  }
}

const firstNames = ['Maria', 'James', 'Sarah', 'David', 'Lisa', 'Michael', 'Jennifer', 'Robert'];
const lastNames = ['Garcia', 'Wilson', 'Johnson', 'Brown', 'Davis', 'Miller', 'Taylor', 'Anderson'];

export function generateClient(id: number): Client & { attributes: ClientAttributes } {
  const attributes = generateClientAttributes();
  const name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
  
  let concerns: string[] = [];
  
  // Generate concerns based on attributes
  if (attributes.healthStatus.chronicConditions[0] !== 'none') {
    concerns.push(`I have ${attributes.healthStatus.chronicConditions[0]} and need regular medical care.`);
  }
  if (attributes.barriers.language !== 'none') {
    concerns.push("I sometimes have trouble understanding medical terms and forms.");
  }
  if (attributes.lifestyle.familyResponsibilities[0] !== 'none') {
    concerns.push(`I'm caring for ${attributes.lifestyle.familyResponsibilities[0]} and have limited time.`);
  }
  
  // Ensure at least one concern
  if (concerns.length === 0) {
    concerns.push("I'm worried about the cost of health insurance.");
  }

  return {
    id,
    name,
    avatar: generateAvatarUrl(name, attributes),
    status: "New Client",
    concerns,
    attributes
  };
}
