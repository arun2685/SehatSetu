// Demo directory. Fees in INR. `video: false` = in-clinic only.
const raw = [
  ['aisha-roy', 'Dr. Aisha Roy', 'F', 'General Physician', 'MBBS, DNB (Family Medicine)', 9, 'SehatSetu Care Clinic', 'Krishnanagar', 'Agartala', 4.87, 512, 299, 450, true, ['Bengali', 'Hindi', 'English']],
  ['debabrata-roy', 'Dr. Debabrata Roy', 'M', 'General Physician', 'MBBS, MD (Internal Medicine)', 14, 'ILS Hospitals Agartala', 'Capital Complex', 'Agartala', 4.9, 284, 399, 500, true, ['Bengali', 'Hindi', 'English', 'Kokborok']],
  ['priyanka-bhattacharya', 'Dr. Priyanka Bhattacharya', 'F', 'Dermatologist', 'MBBS, MD (Dermatology, Venereology & Leprosy)', 11, 'Apollo Clinic Agartala', 'Banamalipur', 'Agartala', 4.8, 196, 450, 600, true, ['Bengali', 'English']],
  ['arindam-mukherjee', 'Dr. Arindam Mukherjee', 'M', 'Cardiologist', 'MBBS, MD, DM (Cardiology)', 18, 'Rabindranath Tagore International Institute', 'EM Bypass', 'Kolkata', 4.95, 412, 700, 900, true, ['Bengali', 'Hindi', 'English']],
  ['sunita-goswami', 'Dr. Sunita Goswami', 'F', 'Child Specialist', 'MBBS, DNB (Pediatrics), DCH', 12, 'Agartala Mother & Child Care Hospital', 'Kunjaban', 'Agartala', 4.9, 310, 350, 450, true, ['Bengali', 'Hindi', 'English']],
  ['bikramjit-barman', 'Dr. Bikramjit Barman', 'M', 'Orthopedic', 'MBBS, MS (Orthopedics), Fellowship in Joint Replacement', 15, 'Tripura Medical College & Dr. BRAM Teaching Hospital', 'Hapania', 'Agartala', 4.85, 228, null, 600, false, ['Bengali', 'Kokborok', 'English']],
  ['tanusree-mazumder', 'Dr. Tanusree Mazumder', 'F', 'Gynecologist', 'MBBS, MS (Obstetrics & Gynecology), DNB', 13, 'ILS Hospitals Agartala', 'Capital Complex', 'Agartala', 4.92, 345, 500, 650, true, ['Bengali', 'Hindi', 'English']],
  ['rajesh-sharma', 'Dr. Rajesh Sharma', 'M', 'ENT', 'MBBS, MS (ENT – Otorhinolaryngology)', 16, 'Guwahati Neurological & ENT Care Center', 'G.S. Road', 'Guwahati', 4.88, 180, 400, 550, true, ['Assamese', 'Hindi', 'English']],
  ['sourav-ganguly', 'Dr. Sourav Ganguly', 'M', 'Dentist', 'BDS, MDS (Oral & Maxillofacial Surgery)', 10, 'City Dental Care & Implant Center', 'Melarmath', 'Agartala', 4.8, 142, null, 400, false, ['Bengali', 'English']],
  ['ananya-roy-choudhury', 'Dr. Ananya Roy Choudhury', 'F', 'Psychiatrist', 'MBBS, MD (Psychiatry)', 14, 'Mind Care Health Clinic', 'Dhaleswar', 'Agartala', 4.96, 165, 600, 750, true, ['Bengali', 'Hindi', 'English']],
  ['amitabha-das', 'Dr. Amitabha Das', 'M', 'Neurologist', 'MBBS, MD, DM (Neurology)', 17, 'Agartala Neuro Sciences & Stroke Institute', 'Kunjaban', 'Agartala', 4.94, 230, 650, 800, true, ['Bengali', 'English']],
  ['sharmistha-sen', 'Dr. Sharmistha Sen', 'F', 'Eye Specialist', 'MBBS, MS (Ophthalmology), DNB', 12, 'Drishti Eye Care Hospital', 'Colonel Chowmuhani', 'Agartala', 4.89, 215, 350, 450, true, ['Bengali', 'Hindi', 'English']],
  ['kaushik-sengupta', 'Dr. Kaushik Sengupta', 'M', 'Gastroenterologist', 'MBBS, MD, DM (Gastroenterology)', 16, 'Apollo Clinic & Gastro Care Centre', 'Akhaura Road', 'Agartala', 4.93, 280, 600, 750, true, ['Bengali', 'Hindi', 'English']],
  ['prasenjit-das', 'Dr. Prasenjit Das', 'M', 'Urologist', 'MBBS, MS, MCh (Urology)', 15, 'ILS Hospitals Agartala', 'Capital Complex', 'Agartala', 4.91, 195, null, 800, false, ['Bengali', 'English']],
  ['swapan-bhowmik', 'Dr. Swapan Bhowmik', 'M', 'Nephrologist', 'MBBS, MD, DM (Nephrology), DNB', 18, 'Tripura Kidney Care & Dialysis Institute', 'Hapania', 'Agartala', 4.95, 260, 700, 850, true, ['Bengali', 'Hindi', 'English']],
  ['subrata-paul', 'Dr. Subrata Paul', 'M', 'Pulmonologist', 'MBBS, MD (Pulmonary Medicine), DNB', 13, 'Agartala Chest & Allergy Clinic', 'Banamalipur', 'Agartala', 4.88, 190, 450, 600, true, ['Bengali', 'English']],
  ['ratan-dey', 'Dr. Ratan Dey', 'M', 'Endocrinologist', 'MBBS, MD, DM (Endocrinology)', 14, 'Tripura Diabetes & Hormone Center', 'Radhanagar', 'Agartala', 4.92, 310, 550, 700, true, ['Bengali', 'Hindi', 'English']],
  ['joydeep-majumder', 'Dr. Joydeep Majumder', 'M', 'General Surgeon', 'MBBS, MS (General Surgery), FMAS', 15, 'Tripura Medical College Hospital', 'Hapania', 'Agartala', 4.87, 220, null, 650, false, ['Bengali', 'English']],
  ['tanmoy-chakraborty', 'Dr. Tanmoy Chakraborty', 'M', 'Oncologist', 'MBBS, MD, DM (Medical Oncology), DNB', 16, 'Regional Cancer Centre – ILS Onco Wing', 'Capital Complex', 'Agartala', 4.97, 350, 800, 1000, true, ['Bengali', 'Hindi', 'English']],
  ['rina-ghosh', 'Dr. Rina Ghosh', 'F', 'Physiotherapist', 'BPT, MPT (Orthopedic & Sports Physiotherapy)', 9, 'Active Life Physio & Rehab Care', 'Dhaleswar', 'Agartala', 4.86, 175, 299, 400, true, ['Bengali', 'English']],
  ['alok-nath', 'Dr. Alok Nath', 'M', 'Lifestyle Medicine', 'MBBS, MD, Diploma in Clinical Nutrition & Lifestyle Medicine', 11, 'Holistic Health & Lifestyle Wellness Clinic', 'Post Office Chowmuhani', 'Agartala', 4.84, 140, 350, 450, true, ['Bengali', 'Hindi', 'English']],
]

export const doctors = raw.map(
  ([id, name, gender, specialty, degrees, exp, hospital, area, city, rating, reviews, videoFee, clinicFee, video, languages]) => ({
    id, name, gender, specialty, degrees, exp, hospital, area, city, rating, reviews, videoFee, clinicFee, video, languages,
  }),
)

export const getDoctor = (id) => doctors.find((d) => d.id === id)

/** Degree tokens, e.g. "MBBS, MD (Internal Medicine)" -> ["MBBS","MD"] */
export const degreeTokens = (d) => (d.degrees.match(/\b[A-Z][A-Za-z]{1,4}\b/g) || []).filter((t) => t === t.toUpperCase() || t === 'MCh')

export const DEGREE_FILTERS = ['MBBS', 'MD', 'MS', 'DNB', 'DM', 'MCh', 'BDS', 'BPT']

export const reviewsFor = (doctor) => {
  const pool = [
    ['Rupa D.', 'Explained everything patiently and did not rush. The prescription arrived on WhatsApp right after the call.'],
    ['Sanjib M.', 'Very punctual. Clinic visit was smooth — no waiting beyond 10 minutes.'],
    ['Moumita S.', 'Listened carefully and suggested simple lifestyle changes along with medicines. Felt better within days.'],
    ['Arjun P.', 'Clear advice and a proper follow-up plan. Would definitely consult again.'],
    ['Priti K.', 'Friendly and reassuring. Answered all my questions in Bengali which made it so easy.'],
  ]
  const start = doctor.name.length % pool.length
  return [0, 1, 2].map((i) => {
    const [who, text] = pool[(start + i) % pool.length]
    return { who, text, rating: i === 1 ? 4 : 5, ago: ['2 days ago', '1 week ago', '3 weeks ago'][i] }
  })
}
