import {
  Stethoscope, Baby, Venus, Sparkles, Bone, HeartPulse, Brain, Ear, Eye, Smile, Salad, Droplet, Bean, Wind,
  Activity, HandHeart, Hospital, Ribbon, PersonStanding, Leaf, Thermometer,
} from 'lucide-react'

export const SPECIALTIES = [
  { name: 'General Physician', icon: Stethoscope, blurb: 'Fever, infections, BP, diabetes' },
  { name: 'Child Specialist', icon: Baby, blurb: 'Fever, cough, growth & vaccines' },
  { name: 'Gynecologist', icon: Venus, blurb: 'Periods, PCOS, pregnancy care' },
  { name: 'Dermatologist', icon: Sparkles, blurb: 'Acne, rashes, hair fall' },
  { name: 'Orthopedic', icon: Bone, blurb: 'Joint, back & bone pain' },
  { name: 'Cardiologist', icon: HeartPulse, blurb: 'Heart, chest discomfort, BP' },
  { name: 'Neurologist', icon: Brain, blurb: 'Migraine, numbness, seizures' },
  { name: 'ENT', icon: Ear, blurb: 'Ear, nose, throat & sinus' },
  { name: 'Eye Specialist', icon: Eye, blurb: 'Vision, redness, eye strain' },
  { name: 'Dentist', icon: Smile, blurb: 'Toothache, gums, braces' },
  { name: 'Gastroenterologist', icon: Salad, blurb: 'Acidity, gas, liver, stomach' },
  { name: 'Urologist', icon: Droplet, blurb: 'Urinary issues, stones' },
  { name: 'Nephrologist', icon: Bean, blurb: 'Kidney health & dialysis' },
  { name: 'Pulmonologist', icon: Wind, blurb: 'Asthma, breathing, chronic cough' },
  { name: 'Endocrinologist', icon: Activity, blurb: 'Diabetes, thyroid, hormones' },
  { name: 'Psychiatrist', icon: HandHeart, blurb: 'Stress, anxiety, sleep, mood' },
  { name: 'General Surgeon', icon: Hospital, blurb: 'Hernia, gallbladder, piles' },
  { name: 'Oncologist', icon: Ribbon, blurb: 'Cancer screening & care' },
  { name: 'Physiotherapist', icon: PersonStanding, blurb: 'Rehab, sports injury, posture' },
  { name: 'Lifestyle Medicine', icon: Leaf, blurb: 'Weight, nutrition, wellness' },
]

export const specialtyIcon = (name) => SPECIALTIES.find((s) => s.name === name)?.icon ?? Stethoscope

export const CONCERNS = [
  { title: 'Cold, cough or fever', hint: 'Flu, body ache, sore throat', specialty: 'General Physician', icon: Thermometer, tag: 'Most common' },
  { title: 'Period or pregnancy', hint: 'Cramps, delay, PCOS, fertility', specialty: 'Gynecologist', icon: Venus },
  { title: 'Skin & hair problems', hint: 'Acne, rashes, hair fall', specialty: 'Dermatologist', icon: Sparkles },
  { title: 'Child not feeling well', hint: 'Fever, vomiting, crying', specialty: 'Child Specialist', icon: Baby },
  { title: 'Stress, anxiety or low mood', hint: 'Panic, insomnia, counselling', specialty: 'Psychiatrist', icon: HandHeart, tag: '100% private' },
  { title: 'Acidity & stomach issues', hint: 'Heartburn, gas, nausea', specialty: 'Gastroenterologist', icon: Salad },
  { title: 'Bone, joint or back pain', hint: 'Sprain, arthritis, stiffness', specialty: 'Orthopedic', icon: Bone },
  { title: 'Tooth pain & cavities', hint: 'Bleeding gums, braces', specialty: 'Dentist', icon: Smile },
  { title: 'Sexual & urinary health', hint: 'Confidential, discreet advice', specialty: 'Urologist', icon: Droplet },
]

export const CITIES = ['Agartala', 'Guwahati', 'Kolkata', 'Shillong', 'Silchar', 'Udaipur (Tripura)', 'Dharmanagar']

export const ARTICLES = [
  {
    category: 'Infectious disease',
    title: '12 viral fever & flu myths, debunked by physicians',
    excerpt: 'Do antibiotics cure a cold? Is a cold shower risky? Doctor-backed facts on treating viral infections at home.',
    author: 'Dr. Aisha Roy',
    read: '6 min read',
    icon: Thermometer,
  },
  {
    category: 'Child health',
    title: 'Everyday food habits that protect children from seasonal allergies',
    excerpt: 'A pediatrician on simple food choices and micronutrients that strengthen young lungs and reduce wheezing.',
    author: 'Dr. Sunita Goswami',
    read: '5 min read',
    icon: Baby,
  },
  {
    category: 'Gastroenterology',
    title: 'Fatty liver grade 1 & 2: how diet can reverse it',
    excerpt: 'Why fatty liver is rising in desk-bound adults, and the lifestyle changes that calm liver inflammation.',
    author: 'Dr. Kaushik Sengupta',
    read: '8 min read',
    icon: Salad,
  },
]

export const TESTIMONIALS = [
  {
    quote: 'Connected with a physician in 45 seconds at 11 PM when my daughter had a 102°F fever. The digital prescription worked at our pharmacy right away.',
    name: 'Amit Sharma',
    city: 'Bengaluru',
  },
  {
    quote: 'The doctor explained every step clearly and answered all my questions. No rushing, no confusion.',
    name: 'Jyothi Bhatia',
    city: 'Kolkata',
  },
  {
    quote: 'Found a nearby specialist and booked a clinic slot in two minutes. Walked in at my time and was seen right away.',
    name: 'Avinash Kumar',
    city: 'Agartala',
  },
]

export const FAQS = [
  {
    q: 'How fast can I talk to a doctor?',
    a: 'Instant video consults connect you to an on-duty General Physician in about 60 seconds. Specialists usually have a slot the same day.',
  },
  {
    q: 'Will I get a valid prescription?',
    a: 'Yes. Every consult ends with a digital prescription signed by an MCI/NMC-registered doctor, sent by SMS and WhatsApp. It is accepted at pharmacies across India.',
  },
  {
    q: 'How do I pay for a clinic visit?',
    a: 'Booking a clinic slot on SehatSetu is free. You pay the doctor’s visiting fee directly at the clinic.',
  },
  {
    q: 'Can I book for my parents or children?',
    a: 'Yes. Choose “Someone else” while booking and add their name. Care Plus covers up to 6 family members.',
  },
  {
    q: 'Is my health information private?',
    a: 'Your consultations and records are encrypted and only shared with the doctor you choose. We follow ABDM and DISHA data-privacy guidelines.',
  },
]

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Free follow-up available', body: 'Your consult with Dr. Priyanka Bhattacharya includes one free follow-up within 7 days.', ago: '2h' },
  { id: 'n2', title: 'Flu season advisory', body: 'Cases of viral fever are rising in Tripura. Stay hydrated and consult early if fever lasts over 2 days.', ago: '1d' },
]

export const PLANS = [
  {
    id: 'solo',
    name: 'Care Plus Solo',
    price: 149,
    period: 'month',
    members: '1 member',
    features: ['Unlimited instant GP video consults', '20% off specialist consults', 'Zero booking fees', 'Free follow-up within 7 days'],
  },
  {
    id: 'family',
    name: 'Care Plus Family',
    price: 299,
    period: 'month',
    members: 'Up to 6 members',
    popular: true,
    features: ['Everything in Solo, for the whole family', 'Priority connect — under 30 seconds', 'Free annual health check-up for 2', 'Digital health vault for all members'],
  },
  {
    id: 'family-yearly',
    name: 'Family Yearly',
    price: 2499,
    period: 'year',
    members: 'Up to 6 members',
    note: 'Save ₹1,089 vs monthly',
    features: ['All Family benefits for 12 months', '2 free full-body lab tests', 'Dedicated care coordinator', 'Cancel anytime, prorated refund'],
  },
]
