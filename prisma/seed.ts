import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const lenormandCards = [
  {
    id: 1,
    name: "Rider",
    number: 1,
    keywords: ["news", "messages", "arrival", "speed", "communication"],
    uprightMeaning: "News arriving soon, messages, visitors, speed in communication",
    reversedMeaning: "Delayed news, miscommunication, unwanted visitors",
    combos: [
      { withCardId: 2, meaning: "News about clover - lucky message" },
      { withCardId: 6, meaning: "News about clouds - unclear message" },
      { withCardId: 28, meaning: "News from man - male messenger" }
    ]
  },
  {
    id: 2,
    name: "Clover",
    number: 2,
    keywords: ["luck", "chance", "opportunity", "fortune", "joy"],
    uprightMeaning: "Good luck, opportunity, small wins, positive chance",
    reversedMeaning: "Missed opportunity, bad luck, disappointment",
    combos: [
      { withCardId: 1, meaning: "Lucky news - fortunate message" },
      { withCardId: 21, meaning: "Lucky mountain - overcoming obstacles" },
      { withCardId: 34, meaning: "Lucky fish - financial gain" }
    ]
  },
  {
    id: 3,
    name: "Ship",
    number: 3,
    keywords: ["travel", "journey", "movement", "departure", "exploration"],
    uprightMeaning: "Travel, journey, movement, departure, exploration",
    reversedMeaning: "Delayed travel, homesickness, journey problems",
    combos: [
      { withCardId: 1, meaning: "Travel news - journey announcement" },
      { withCardId: 6, meaning: "Uncertain travel - journey confusion" },
      { withCardId: 22, meaning: "Travel paths - clear direction" }
    ]
  },
  {
    id: 4,
    name: "House",
    number: 4,
    keywords: ["home", "family", "security", "stability", "comfort"],
    uprightMeaning: "Home, family, security, stability, comfort",
    reversedMeaning: "Home problems, instability, moving house",
    combos: [
      { withCardId: 3, meaning: "Moving house - relocation" },
      { withCardId: 29, meaning: "Family woman - mother figure" },
      { withCardId: 33, meaning: "Home key - property matters" }
    ]
  },
  {
    id: 5,
    name: "Tree",
    number: 5,
    keywords: ["health", "growth", "nature", "stability", "life"],
    uprightMeaning: "Health, growth, stability, nature, long life",
    reversedMeaning: "Health problems, stagnation, illness",
    combos: [
      { withCardId: 1, meaning: "Health news - medical results" },
      { withCardId: 26, meaning: "Health book - medical knowledge" },
      { withCardId: 3, meaning: "Health journey - medical travel" }
    ]
  },
  {
    id: 6,
    name: "Clouds",
    number: 6,
    keywords: ["confusion", "uncertainty", "doubt", "clarity", "problems"],
    uprightMeaning: "Confusion, uncertainty, doubt, lack of clarity",
    reversedMeaning: "Clarity emerging, confusion clearing",
    combos: [
      { withCardId: 1, meaning: "Unclear news - confusing message" },
      { withCardId: 2, meaning: "Uncertain luck - unclear opportunity" },
      { withCardId: 25, meaning: "Emotional confusion - unclear feelings" }
    ]
  },
  {
    id: 7,
    name: "Snake",
    number: 7,
    keywords: ["betrayal", "deception", "enemy", "temptation", "danger"],
    uprightMeaning: "Betrayal, deception, hidden enemy, temptation",
    reversedMeaning: "Danger avoided, truth revealed, enemy defeated",
    combos: [
      { withCardId: 28, meaning: "Male enemy - deceptive man" },
      { withCardId: 29, meaning: "Female enemy - deceptive woman" },
      { withCardId: 33, meaning: "Dangerous secret - hidden knowledge" }
    ]
  },
  {
    id: 8,
    name: "Coffin",
    number: 8,
    keywords: ["endings", "death", "transformation", "closure", "loss"],
    uprightMeaning: "Endings, transformation, closure, necessary loss",
    reversedMeaning: "New beginnings, rebirth, avoiding endings",
    combos: [
      { withCardId: 1, meaning: "Ending news - final message" },
      { withCardId: 4, meaning: "Home ending - moving out" },
      { withCardId: 5, meaning: "Health ending - illness" }
    ]
  },
  {
    id: 9,
    name: "Bouquet",
    number: 9,
    keywords: ["gift", "appreciation", "beauty", "gratitude", "happiness"],
    uprightMeaning: "Gift, appreciation, beauty, gratitude, happiness",
    reversedMeaning: "Unwanted gift, lack of appreciation, disappointment",
    combos: [
      { withCardId: 1, meaning: "Gift news - welcome message" },
      { withCardId: 29, meaning: "Female gift - woman's appreciation" },
      { withCardId: 34, meaning: "Financial gift - money received" }
    ]
  },
  {
    id: 10,
    name: "Scythe",
    number: 10,
    keywords: ["cutting", "decisions", "harvest", "sudden change", "danger"],
    uprightMeaning: "Sudden decisions, cutting ties, harvest, danger",
    reversedMeaning: "Avoided danger, delayed decisions, protection",
    combos: [
      { withCardId: 1, meaning: "Cutting news - abrupt message" },
      { withCardId: 8, meaning: "Final cut - definite ending" },
      { withCardId: 33, meaning: "Dangerous secret - risky knowledge" }
    ]
  },
  {
    id: 11,
    name: "Whip",
    number: 11,
    keywords: ["conflict", "argument", "discipline", "action", "force"],
    uprightMeaning: "Conflict, argument, discipline, forceful action",
    reversedMeaning: "Peace, resolution, gentle approach",
    combos: [
      { withCardId: 28, meaning: "Male conflict - argument with man" },
      { withCardId: 29, meaning: "Female conflict - argument with woman" },
      { withCardId: 3, meaning: "Conflict journey - difficult travel" }
    ]
  },
  {
    id: 12,
    name: "Birds",
    number: 12,
    keywords: ["communication", "conversation", "anxiety", "social", "gossip"],
    uprightMeaning: "Communication, conversation, social activity, anxiety",
    reversedMeaning: "Miscommunication, loneliness, social isolation",
    combos: [
      { withCardId: 1, meaning: "Conversation news - talkative message" },
      { withCardId: 25, meaning: "Emotional talk - heartfelt conversation" },
      { withCardId: 26, meaning: "Written communication - letters, emails" }
    ]
  },
  {
    id: 13,
    name: "Child",
    number: 13,
    keywords: ["newness", "innocence", "beginnings", "youth", "potential"],
    uprightMeaning: "New beginnings, innocence, youth, potential",
    reversedMeaning: "Immaturity, childish behavior, blocked potential",
    combos: [
      { withCardId: 1, meaning: "Child news - birth or youth message" },
      { withCardId: 4, meaning: "Home child - family expansion" },
      { withCardId: 5, meaning: "Child health - pediatric matters" }
    ]
  },
  {
    id: 14,
    name: "Fox",
    number: 14,
    keywords: ["cunning", "intelligence", "work", "strategy", "caution"],
    uprightMeaning: "Cunning, intelligence, work matters, strategy",
    reversedMeaning: "Deception, betrayal, job loss, foolishness",
    combos: [
      { withCardId: 28, meaning: "Cunning man - strategic male" },
      { withCardId: 7, meaning: "Cunning deception - strategic betrayal" },
      { withCardId: 33, meaning: "Work secret - professional knowledge" }
    ]
  },
  {
    id: 15,
    name: "Bear",
    number: 15,
    keywords: ["power", "strength", "protection", "authority", "money"],
    uprightMeaning: "Power, strength, protection, authority, finances",
    reversedMeaning: "Weakness, vulnerability, loss of power",
    combos: [
      { withCardId: 34, meaning: "Financial power - wealth" },
      { withCardId: 28, meaning: "Male power - authoritative man" },
      { withCardId: 4, meaning: "Home protection - family security" }
    ]
  },
  {
    id: 16,
    name: "Stars",
    number: 16,
    keywords: ["hope", "guidance", "destiny", "wishes", "inspiration"],
    uprightMeaning: "Hope, guidance, destiny, wishes coming true",
    reversedMeaning: "Lost hope, confusion, lack of direction",
    combos: [
      { withCardId: 2, meaning: "Lucky stars - fortunate destiny" },
      { withCardId: 25, meaning: "Emotional hope - heartfelt wishes" },
      { withCardId: 1, meaning: "Guiding news - inspirational message" }
    ]
  },
  {
    id: 17,
    name: "Stork",
    number: 17,
    keywords: ["change", "movement", "return", "delivery", "transition"],
    uprightMeaning: "Change, movement, return, delivery, transition",
    reversedMeaning: "Stagnation, blocked change, delays",
    combos: [
      { withCardId: 3, meaning: "Travel change - journey modification" },
      { withCardId: 4, meaning: "Home change - moving or renovation" },
      { withCardId: 13, meaning: "Child change - family growth" }
    ]
  },
  {
    id: 18,
    name: "Dog",
    number: 18,
    keywords: ["loyalty", "friendship", "protection", "trust", "companionship"],
    uprightMeaning: "Loyalty, friendship, protection, trust, companionship",
    reversedMeaning: "Betrayal, disloyalty, false friends",
    combos: [
      { withCardId: 28, meaning: "Male friend - loyal man" },
      { withCardId: 29, meaning: "Female friend - loyal woman" },
      { withCardId: 4, meaning: "Home protection - family loyalty" }
    ]
  },
  {
    id: 19,
    name: "Tower",
    number: 19,
    keywords: ["authority", "institution", "isolation", "protection", "structure"],
    uprightMeaning: "Authority, institutions, isolation, protection",
    reversedMeaning: "Institutional problems, lack of protection",
    combos: [
      { withCardId: 28, meaning: "Male authority - official man" },
      { withCardId: 15, meaning: "Power structure - hierarchy" },
      { withCardId: 8, meaning: "Institutional ending - closure" }
    ]
  },
  {
    id: 20,
    name: "Garden",
    number: 20,
    keywords: ["social", "community", "public", "gathering", "network"],
    uprightMeaning: "Social activity, community, public gathering, networking",
    reversedMeaning: "Isolation, social rejection, privacy",
    combos: [
      { withCardId: 12, meaning: "Social conversation - public discussion" },
      { withCardId: 29, meaning: "Community woman - social female" },
      { withCardId: 28, meaning: "Community man - social male" }
    ]
  },
  {
    id: 21,
    name: "Mountain",
    number: 21,
    keywords: ["obstacle", "challenge", "stability", "delay", "perseverance"],
    uprightMeaning: "Obstacles, challenges, stability, delays",
    reversedMeaning: "Overcoming obstacles, clear path, achievement",
    combos: [
      { withCardId: 2, meaning: "Lucky obstacle - challenge with opportunity" },
      { withCardId: 10, meaning: "Dangerous obstacle - risky challenge" },
      { withCardId: 22, meaning: "Path obstacle - journey blocked" }
    ]
  },
  {
    id: 22,
    name: "Paths",
    number: 22,
    keywords: ["choices", "decisions", "direction", "options", "crossroads"],
    uprightMeaning: "Choices, decisions, direction, options, crossroads",
    reversedMeaning: "Indecision, wrong path, confusion",
    combos: [
      { withCardId: 1, meaning: "Choice news - decision message" },
      { withCardId: 21, meaning: "Difficult choice - challenging decision" },
      { withCardId: 3, meaning: "Travel choice - journey options" }
    ]
  },
  {
    id: 23,
    name: "Mice",
    number: 23,
    keywords: ["loss", "theft", "stress", "worry", "erosion"],
    uprightMeaning: "Loss, theft, stress, worry, gradual erosion",
    reversedMeaning: "Recovery, finding what was lost, relief",
    combos: [
      { withCardId: 34, meaning: "Financial loss - money problems" },
      { withCardId: 4, meaning: "Home loss - property issues" },
      { withCardId: 5, meaning: "Health stress - worry about health" }
    ]
  },
  {
    id: 24,
    name: "Heart",
    number: 24,
    keywords: ["love", "emotions", "relationships", "joy", "affection"],
    uprightMeaning: "Love, emotions, relationships, joy, affection",
    reversedMeaning: "Heartbreak, emotional pain, relationship problems",
    combos: [
      { withCardId: 25, meaning: "Emotional love - deep feelings" },
      { withCardId: 29, meaning: "Female love - woman's affection" },
      { withCardId: 28, meaning: "Male love - man's affection" }
    ]
  },
  {
    id: 25,
    name: "Ring",
    number: 25,
    keywords: ["commitment", "marriage", "contract", "unity", "cycle"],
    uprightMeaning: "Commitment, marriage, contract, unity, completion",
    reversedMeaning: "Broken commitment, divorce, contract issues",
    combos: [
      { withCardId: 24, meaning: "Love commitment - marriage" },
      { withCardId: 28, meaning: "Male commitment - engagement to man" },
      { withCardId: 29, meaning: "Female commitment - engagement to woman" }
    ]
  },
  {
    id: 26,
    name: "Book",
    number: 26,
    keywords: ["knowledge", "secrets", "education", "information", "mystery"],
    uprightMeaning: "Knowledge, secrets, education, information, mystery",
    reversedMeaning: "Revealed secrets, misinformation, learning difficulties",
    combos: [
      { withCardId: 1, meaning: "Knowledge news - educational message" },
      { withCardId: 33, meaning: "Secret knowledge - hidden information" },
      { withCardId: 5, meaning: "Health knowledge - medical information" }
    ]
  },
  {
    id: 27,
    name: "Letter",
    number: 27,
    keywords: ["message", "communication", "document", "news", "information"],
    uprightMeaning: "Message, communication, document, news, information",
    reversedMeaning: "Lost message, miscommunication, document problems",
    combos: [
      { withCardId: 1, meaning: "Message news - important communication" },
      { withCardId: 26, meaning: "Written message - document" },
      { withCardId: 12, meaning: "Conversation message - verbal communication" }
    ]
  },
  {
    id: 28,
    name: "Man",
    number: 28,
    keywords: ["man", "masculine", "husband", "father", "authority"],
    uprightMeaning: "Man, masculine energy, husband, father, authority figure",
    reversedMeaning: "Unreliable man, masculine problems, authority issues",
    combos: [
      { withCardId: 29, meaning: "Man and woman - couple" },
      { withCardId: 24, meaning: "Man in love - romantic man" },
      { withCardId: 15, meaning: "Powerful man - authoritative male" }
    ]
  },
  {
    id: 29,
    name: "Woman",
    number: 29,
    keywords: ["woman", "feminine", "wife", "mother", "nurturing"],
    uprightMeaning: "Woman, feminine energy, wife, mother, nurturing",
    reversedMeaning: "Difficult woman, feminine problems, relationship issues",
    combos: [
      { withCardId: 28, meaning: "Woman and man - couple" },
      { withCardId: 24, meaning: "Woman in love - romantic female" },
      { withCardId: 4, meaning: "Home woman - mother figure" }
    ]
  },
  {
    id: 30,
    name: "Lily",
    number: 30,
    keywords: ["peace", "harmony", "wisdom", "maturity", "virtue"],
    uprightMeaning: "Peace, harmony, wisdom, maturity, virtue",
    reversedMeaning: "Conflict, immaturity, lack of peace",
    combos: [
      { withCardId: 24, meaning: "Peaceful love - harmonious relationship" },
      { withCardId: 4, meaning: "Peaceful home - harmonious family" },
      { withCardId: 29, meaning: "Wise woman - mature female" }
    ]
  },
  {
    id: 31,
    name: "Sun",
    number: 31,
    keywords: ["success", "joy", "happiness", "energy", "clarity"],
    uprightMeaning: "Success, joy, happiness, energy, clarity",
    reversedMeaning: "Temporary setback, delayed success, lack of clarity",
    combos: [
      { withCardId: 2, meaning: "Lucky success - fortunate achievement" },
      { withCardId: 24, meaning: "Joyful love - happy relationship" },
      { withCardId: 34, meaning: "Financial success - prosperity" }
    ]
  },
  {
    id: 32,
    name: "Moon",
    number: 32,
    keywords: ["intuition", "emotions", "dreams", "creativity", "illusion"],
    uprightMeaning: "Intuition, emotions, dreams, creativity, recognition",
    reversedMeaning: "Emotional confusion, creative block, illusion",
    combos: [
      { withCardId: 24, meaning: "Emotional love - intuitive relationship" },
      { withCardId: 26, meaning: "Creative knowledge - artistic learning" },
      { withCardId: 25, meaning: "Emotional commitment - intuitive union" }
    ]
  },
  {
    id: 33,
    name: "Key",
    number: 33,
    keywords: ["solution", "opportunity", "access", "answer", "discovery"],
    uprightMeaning: "Solution, opportunity, access, answer, discovery",
    reversedMeaning: "Locked door, no solution, missed opportunity",
    combos: [
      { withCardId: 26, meaning: "Knowledge key - learning opportunity" },
      { withCardId: 4, meaning: "Home key - property access" },
      { withCardId: 34, meaning: "Financial key - money opportunity" }
    ]
  },
  {
    id: 34,
    name: "Fish",
    number: 34,
    keywords: ["money", "abundance", "business", "finance", "prosperity"],
    uprightMeaning: "Money, abundance, business, finance, prosperity",
    reversedMeaning: "Financial loss, business problems, lack of abundance",
    combos: [
      { withCardId: 15, meaning: "Financial power - wealth" },
      { withCardId: 23, meaning: "Financial loss - money problems" },
      { withCardId: 33, meaning: "Financial opportunity - business key" }
    ]
  },
  {
    id: 35,
    name: "Anchor",
    number: 35,
    keywords: ["stability", "security", "hope", "foundation", "perseverance"],
    uprightMeaning: "Stability, security, hope, foundation, perseverance",
    reversedMeaning: "Instability, insecurity, loss of hope",
    combos: [
      { withCardId: 4, meaning: "Home stability - secure family" },
      { withCardId: 34, meaning: "Financial stability - secure finances" },
      { withCardId: 5, meaning: "Health stability - good health" }
    ]
  },
  {
    id: 36,
    name: "Cross",
    number: 36,
    keywords: ["burden", "sacrifice", "destiny", "suffering", "faith"],
    uprightMeaning: "Burden, sacrifice, destiny, suffering, faith",
    reversedMeaning: "Relief from burden, answered prayers, destiny fulfilled",
    combos: [
      { withCardId: 8, meaning: "Final burden - ultimate sacrifice" },
      { withCardId: 24, meaning: "Love burden - suffering for love" },
      { withCardId: 5, meaning: "Health burden - illness" }
    ]
  }
]

async function main() {
  console.log('🌱 Seeding Lenormand cards...')
  
  for (const card of lenormandCards) {
    await prisma.card.upsert({
      where: { id: card.id },
      update: card,
      create: card
    })
  }
  
  console.log('✅ Successfully seeded 36 Lenormand cards')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })