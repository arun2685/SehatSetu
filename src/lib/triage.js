// Simple keyword-based symptom navigator (demo only, not medical advice).

const EMERGENCY = [
  { re: /chest (pain|tight|pressure)|heart attack/, why: 'Chest pain can be a sign of a heart attack.' },
  { re: /(can'?t|cannot|difficult(y)?|trouble|hard to) breath|breathless|not breathing|choking/, why: 'Difficulty breathing needs immediate care.' },
  { re: /unconscious|fainted|passed out|not responding/, why: 'Loss of consciousness needs immediate care.' },
  { re: /stroke|face droop|slurred speech|one side (weak|numb)|sudden weakness/, why: 'These can be warning signs of a stroke.' },
  { re: /seizure|fits|convulsion/, why: 'A seizure needs urgent medical attention.' },
  { re: /heavy bleeding|bleeding (a lot|heavily|won'?t stop)|vomiting blood|blood in vomit/, why: 'Heavy bleeding needs immediate care.' },
  { re: /poison|overdose|snake ?bite/, why: 'Poisoning or bites need emergency treatment.' },
]

const SELF_HARM = /suicid|kill myself|end my life|self[- ]?harm|want to die/

const RULES = [
  { specialty: 'General Physician', words: ['fever', 'cold', 'cough', 'flu\\b', 'body ache', 'sore throat', 'weakness', 'tired', 'fatigue', 'chills', 'viral', 'headache', 'bp\\b', 'blood pressure'] },
  { specialty: 'Dermatologist', words: ['skin', 'acne', 'pimple', 'rash', 'itch', 'hair fall', 'hairfall', 'dandruff', 'dark spot', 'eczema', 'allergy on skin', 'fungal'] },
  { specialty: 'Gynecologist', words: ['period', 'menstru', 'pregnan', 'pcos', 'pcod', 'white discharge', 'vaginal', 'missed period', 'fertility', 'cramps'] },
  { specialty: 'Child Specialist', words: ['child', 'baby', 'infant', 'kid\\b', 'kids\\b', 'toddler', 'son\\b', 'daughter', 'newborn'] },
  { specialty: 'Dentist', words: ['tooth', 'teeth', 'gums?\\b', 'cavity', 'braces', 'jaw pain', 'wisdom'] },
  { specialty: 'Gastroenterologist', words: ['acidity', 'gas\\b', 'gastric', 'stomach', 'indigestion', 'constipation', 'diarrh', 'loose motion', 'vomit', 'nausea', 'heartburn', 'bloating', 'liver'] },
  { specialty: 'Orthopedic', words: ['joint', 'knee', 'back pain', 'bone', 'sprain', 'fracture', 'arthritis', 'shoulder', 'neck pain', 'ankle'] },
  { specialty: 'Psychiatrist', words: ['anxi', 'stress', 'depress', 'sleep', 'insomnia', 'panic', 'sad\\b', 'mood', 'overthink', 'lonely'] },
  { specialty: 'Eye Specialist', words: ['eyes?\\b', 'vision', 'blurry', 'blurred', 'red eye', 'watery eye', 'spectacle'] },
  { specialty: 'ENT', words: ['ear\\b', 'ears\\b', 'earache', 'nose', 'sinus', 'tonsil', 'hearing', 'blocked nose', 'nosebleed', 'throat pain'] },
  { specialty: 'Cardiologist', words: ['palpitation', 'heart\\b', 'racing heart', 'cholesterol'] },
  { specialty: 'Endocrinologist', words: ['sugar', 'diabet', 'thyroid', 'weight gain', 'hormone'] },
  { specialty: 'Urologist', words: ['urine', 'urinat', 'burning', 'kidney stone', 'erectile', 'sexual'] },
  { specialty: 'Pulmonologist', words: ['asthma', 'wheez', 'breathing', 'chronic cough', 'inhaler'] },
  { specialty: 'Neurologist', words: ['migraine', 'headache', 'dizz', 'numb', 'tingling', 'vertigo', 'memory'] },
]

const SAME_DAY = /(high|102|103|104) ?(fever|°)|(since|for) (\d+|two|three|four|five) days|severe|unbearable|blood|worse|swelling|blurry vision/

export function triage(input) {
  const text = ` ${input.toLowerCase()} `
  if (SELF_HARM.test(text)) return { level: 'crisis' }
  const emergency = EMERGENCY.find((e) => e.re.test(text))
  if (emergency) return { level: 'emergency', why: emergency.why }

  const scores = RULES.map((r) => {
    const matched = r.words.filter((w) => new RegExp(`\\b${w}`).test(text)).map((w) => w.replace(/\\b|s\?/g, ''))
    return { specialty: r.specialty, matched, score: matched.length }
  }).filter((r) => r.score > 0)

  // A child with symptoms → pediatrician wins.
  const child = scores.find((s) => s.specialty === 'Child Specialist')
  // Headache + vision changes → neurologist.
  const neuroVision = /headache/.test(text) && /blur|vision/.test(text)

  let best
  if (child) best = child
  else if (neuroVision) best = { specialty: 'Neurologist', matched: ['headache', 'vision changes'] }
  else best = scores.sort((a, b) => b.score - a.score)[0]

  if (!best) {
    return {
      level: 'routine',
      specialty: 'General Physician',
      matched: [],
      note: 'We couldn’t match specific symptoms, so a General Physician is the best place to start. They can refer you if needed.',
    }
  }
  return {
    level: SAME_DAY.test(text) || neuroVision ? 'soon' : 'routine',
    specialty: best.specialty,
    matched: best.matched,
  }
}

export const SYMPTOM_CHIPS = [
  'Fever since 2 days',
  'Dry cough & sore throat',
  'Acne and hair fall',
  'Irregular periods',
  'Child has fever',
  'Acidity after meals',
  'Lower back pain',
  'Can’t sleep, feeling anxious',
  'Headache with blurry vision',
]
