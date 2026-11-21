export type Helpline = { name: string; number: string }

export type GuideTopic = {
  id: string
  label: string
  prompt: string
  keywords: string[]
  title: string
  steps: string[]
  helplines: Helpline[]
  callout?: string
}

const H = {
  erss: { name: 'National Emergency', number: '112' },
  police: { name: 'Assam Police', number: '100' },
  fire: { name: 'Fire & Emergency', number: '101' },
  ambulance: { name: 'Mrityunjoy Ambulance', number: '108' },
  janani: { name: 'Janani Ambulance', number: '102' },
  asdma: { name: 'ASDMA State EOC', number: '1070' },
  asdmaDistrict: { name: 'ASDMA District Helpline', number: '1079' },
  apdcl: { name: 'APDCL Power', number: '1912' },
  lpg: { name: 'LPG Leak', number: '1906' },
  gmch: { name: 'GMCH Bhangagarh', number: '0361-2529457' },
  nemcare: { name: 'Nemcare Hospital', number: '0361-2456111' },
  downtown: { name: 'Down Town Hospital', number: '0361-2331003' },
  women: { name: 'Women Helpline', number: '181' },
  child: { name: 'Childline', number: '1098' },
  cyber: { name: 'Cyber Crime', number: '1930' },
  manas: { name: 'Tele MANAS', number: '14416' },
  traffic: { name: 'Guwahati Traffic Police', number: '0361-2540126' },
  gmc: { name: 'Guwahati Municipal Corp.', number: '0361-2540136' },
} satisfies Record<string, Helpline>

export const GUIDE_TOPICS: GuideTopic[] = [
  {
    id: 'flood',
    label: 'Flood / Waterlogging',
    prompt: 'Water is entering my house in Anil Nagar. What should I do?',
    keywords: ['flood', 'waterlog', 'water logging', 'water-logging', 'inundat', 'submerge', 'rain', 'drain', 'baan', 'pani', 'water entered', 'water entering', 'rising water', 'brahmaputra', 'bharalu', 'boat', 'relief camp', 'evacuat'],
    title: 'Flood & waterlogging — act now',
    steps: [
      'Switch off the main power supply before water reaches sockets; never touch wet switches or electric poles.',
      'Move family members, medicines, documents, and dry food to the upper floor or a relative\u2019s house on higher ground.',
      'Avoid known low-lying stretches: Anil Nagar, Nabin Nagar, Zoo Road, RG Baruah Road, Hatigaon, and the Jalukbari flyover underpass.',
      'Do not walk or drive through moving water — open manholes and drains are invisible under floodwater.',
      'For rescue boats or relief camps call ASDMA 1070 (state) or 1079 (Kamrup Metro district control room).',
      'Drink only boiled or packaged water for the next few days to prevent waterborne diseases.',
      'Report the location in the Report Issue tab so GMC and neighbours can see it on the live feed.',
    ],
    helplines: [H.asdma, H.asdmaDistrict, H.erss, H.apdcl],
    callout: 'If you are trapped, go to the roof (not a closed attic) and call 112 with your exact landmark.',
  },
  {
    id: 'ambulance',
    label: 'Ambulance / Medical',
    prompt: 'Someone collapsed on GS Road and needs an ambulance.',
    keywords: ['ambulance', 'medical', 'injur', 'bleed', 'blood', 'unconscious', 'collapse', 'heart', 'chest pain', 'breath', 'stroke', 'faint', 'sick', 'fever', 'dengue', 'malaria', 'doctor', 'daktar', 'hurt', 'cpr', 'pregnan', 'labour', 'delivery'],
    title: 'Medical emergency — get help fast',
    steps: [
      'Call 108 (Mrityunjoy Ambulance, free across Assam) and give a clear landmark — e.g. "opposite Ganeshguri flyover, GS Road".',
      'Check breathing. If the person is not breathing, start CPR: push hard and fast in the centre of the chest, 100–120 per minute.',
      'For heavy bleeding, press a clean cloth firmly on the wound and keep pressure on.',
      'Do not give food or water to an unconscious person; turn them on their side if they vomit.',
      'Nearest 24/7 emergency: GMCH (Bhangagarh), Nemcare (GS Road, Bhangagarh), Down Town Hospital (Dispur).',
      'For pregnancy or newborn emergencies, call 102 (Janani) for free transport to a government hospital.',
    ],
    helplines: [H.ambulance, H.erss, H.janani, H.gmch],
    callout: '108 is free. Keep your phone line open so the ambulance driver can call you back for directions.',
  },
  {
    id: 'hospital',
    label: 'Nearest hospital',
    prompt: 'Which hospitals in Guwahati have 24-hour emergency?',
    keywords: ['hospital', 'gmch', 'nemcare', 'down town', 'downtown', 'icu', 'admit', 'emergency ward', 'clinic', 'blood bank', 'donor', 'oxygen', 'anti-venom'],
    title: '24/7 emergency hospitals in Guwahati',
    steps: [
      'GMCH, Bhangagarh — government trauma centre, blood bank, anti-venom. Best for serious accidents.',
      'Nemcare Hospital, GS Road, Bhangagarh — private multi-speciality with 24/7 ICU.',
      'Down Town Hospital, GS Road, Dispur — emergency care and cardiac unit.',
      'From north Guwahati / Jalukbari, avoid the flyover during waterlogging; use the Maligaon route towards Bhangagarh.',
      'Call the hospital ahead if possible so the emergency team can prepare.',
      'For blood requirements, contact the GMCH blood bank and post a request in the Report Issue tab under Medical.',
    ],
    helplines: [H.gmch, H.nemcare, H.downtown, H.ambulance],
  },
  {
    id: 'police',
    label: 'Police / Crime',
    prompt: 'There is a fight and someone is threatening people outside my house.',
    keywords: ['police', 'theft', 'thief', 'stolen', 'robbery', 'rob', 'crime', 'fight', 'assault', 'attack', 'threat', 'suspicious', 'missing', 'kidnap', 'fir', 'chain snatch', 'burglar', 'violence', 'goonda', 'scam', 'fraud', 'cyber', 'upi'],
    title: 'Police help in Guwahati',
    steps: [
      'If anyone is in immediate danger, move to a safe place and call 112 or Assam Police 100.',
      'Share your exact location with nearby landmarks (e.g. "Panbazar, near Cotton University gate").',
      'Note descriptions — clothing, vehicle number, direction they went — but do not confront anyone.',
      'For thefts, file an FIR at the nearest police station (Panbazar, Dispur, Jalukbari, Latasil, Chandmari) or online via Assam Police.',
      'For online/UPI fraud, call 1930 within the first hour to improve the chance of freezing the money.',
      'Women can call 181 for dedicated support; children in danger — 1098.',
    ],
    helplines: [H.erss, H.police, H.cyber, H.women],
  },
  {
    id: 'power',
    label: 'Power / Electricity',
    prompt: 'A transformer is sparking near Maligaon and the power is out.',
    keywords: ['power', 'electric', 'electricity', 'current', 'bijuli', 'outage', 'blackout', 'no light', 'transformer', 'spark', 'short circuit', 'live wire', 'wire', 'pole', 'shock', 'apdcl', 'meter'],
    title: 'Power outage or electrical hazard',
    steps: [
      'Stay at least 10 metres away from sparking transformers, fallen wires, or poles standing in water.',
      'Report it to APDCL on 1912 with your consumer number (on the electricity bill) and nearest landmark.',
      'If someone got an electric shock, do not touch them directly — switch off the supply or push them away with dry wood.',
      'Then call 108 for the shock victim, even if they seem fine.',
      'During outages, unplug fridges, TVs, and inverters to avoid damage from voltage surges.',
      'Post the issue in the Report Issue tab under Power so neighbours can upvote it.',
    ],
    helplines: [H.apdcl, H.ambulance, H.erss],
    callout: 'Never try to move a fallen live wire yourself, even with a stick, if it is lying in water.',
  },
  {
    id: 'fire',
    label: 'Fire / Gas leak',
    prompt: 'I smell gas and there is smoke from the kitchen.',
    keywords: ['fire', 'smoke', 'burn', 'flame', 'gas leak', 'gas', 'cylinder', 'lpg', 'blast', 'explosion', 'agoni'],
    title: 'Fire or gas leak — get out first',
    steps: [
      'Alert everyone and leave the building immediately using stairs, not lifts.',
      'For a gas smell: do not switch on/off any light or use a lighter. Turn off the cylinder regulator only if safe, and open windows.',
      'Stay low under smoke and cover your nose and mouth with a wet cloth.',
      'Once outside, call Fire & Emergency Services 101 (or 112). For LPG leaks also call 1906.',
      'If clothes catch fire: Stop, Drop, and Roll.',
      'Treat minor burns with cool running water for 20 minutes; call 108 for serious burns.',
    ],
    helplines: [H.fire, H.lpg, H.erss, H.ambulance],
    callout: 'Never go back inside for belongings. Narrow lanes in Fancy Bazaar and Paltan Bazaar slow fire tenders — call early.',
  },
  {
    id: 'landslide',
    label: 'Landslide',
    prompt: 'I see cracks in the hill slope behind our house in Noonmati.',
    keywords: ['landslide', 'landslip', 'mudslide', 'mud', 'boulder', 'hill', 'slope', 'soil', 'crack', 'retaining wall', 'sinking'],
    title: 'Landslide risk on Guwahati hills',
    steps: [
      'Landslide-prone areas include Noonmati, Kharghuli, Jyotinagar, Narengi, Fatasil, Kalapahar, Sonapur, and Jalukbari hills.',
      'Warning signs: new cracks in walls or ground, tilting trees or poles, sudden muddy water in streams, rumbling sounds.',
      'If you notice these during heavy rain, move your family away from the slope immediately — don\u2019t wait.',
      'Call ASDMA 1070 / 1079 to report and request inspection or evacuation.',
      'Avoid driving on hill roads during intense rain at night.',
      'After a slide, stay away — a second slide often follows. Report trapped people to 112.',
    ],
    helplines: [H.asdma, H.asdmaDistrict, H.erss, H.fire],
  },
  {
    id: 'earthquake',
    label: 'Earthquake',
    prompt: 'What should I do during an earthquake?',
    keywords: ['earthquake', 'quake', 'tremor', 'shaking', 'bhumikamp', 'aftershock', 'building shaking'],
    title: 'Earthquake safety (Assam is Seismic Zone V)',
    steps: [
      'DROP to the ground, take COVER under a sturdy table, and HOLD ON until the shaking stops.',
      'Stay away from windows, glass almirahs, and heavy shelves.',
      'In tall apartments (e.g. Six Mile, Beltola), do not use lifts; wait for shaking to stop before using stairs.',
      'If outdoors, move to an open area away from buildings, electric poles, and flyovers.',
      'After shaking stops, check for gas leaks and injuries. Expect aftershocks.',
      'Report damaged buildings to ASDMA 1070 and emergencies to 112.',
    ],
    helplines: [H.erss, H.asdma, H.fire, H.ambulance],
  },
  {
    id: 'traffic',
    label: 'Road / Traffic',
    prompt: 'There has been an accident on the Jalukbari flyover.',
    keywords: ['traffic', 'jam', 'road', 'pothole', 'accident', 'crash', 'collision', 'signal', 'flyover', 'vehicle', 'bike', 'scooter', 'car', 'truck', 'bus', 'gs road', 'highway', 'nh'],
    title: 'Road accidents & traffic problems',
    steps: [
      'For an accident with injuries, call 108 for an ambulance and 112 for police immediately.',
      'Switch on hazard lights and place something visible behind the vehicles to warn traffic.',
      'Do not move a seriously injured person unless there is fire or other immediate danger.',
      'Good Samaritans who help accident victims are legally protected in India — you won\u2019t be harassed.',
      'For jams, signal failures, or blocked roads, call Guwahati Traffic Police control.',
      'Report potholes and broken roads in the Report Issue tab under Road/Traffic for GMC to see.',
    ],
    helplines: [H.ambulance, H.erss, H.traffic, H.gmc],
  },
  {
    id: 'snake',
    label: 'Snake / Animal bite',
    prompt: 'A snake bit someone in the flooded courtyard.',
    keywords: ['snake', 'snakebite', 'bite', 'bitten', 'dog bite', 'stray dog', 'rabies', 'xaap'],
    title: 'Snake or animal bite',
    steps: [
      'Keep the person calm and still — movement spreads venom faster.',
      'Remove rings, watches, or tight clothing near the bite. Keep the bitten limb below heart level.',
      'Do NOT cut the wound, suck venom, apply ice, or tie a tight tourniquet.',
      'Call 108 and go straight to GMCH, which stocks anti-venom. Note the time of the bite.',
      'For dog bites, wash the wound with soap and running water for 15 minutes and get an anti-rabies vaccine the same day.',
    ],
    helplines: [H.ambulance, H.gmch, H.erss],
    callout: 'Snakebites rise sharply during floods. Most bites are treatable if you reach hospital quickly.',
  },
  {
    id: 'mental',
    label: 'Emotional support',
    prompt: 'I feel overwhelmed and anxious after the floods.',
    keywords: ['stress', 'anxious', 'anxiety', 'depress', 'sad', 'overwhelm', 'panic', 'lonely', 'scared', 'suicid', 'hopeless', 'mental', 'cry', 'trauma'],
    title: 'You\u2019re not alone',
    steps: [
      'What you\u2019re feeling is a normal reaction to a very difficult situation.',
      'Try slow breathing: in for 4 seconds, hold for 4, out for 6. Repeat a few times.',
      'Talk to someone you trust — a family member, friend, or neighbour.',
      'Call Tele MANAS 14416 for free, confidential counselling in Assamese, Hindi, or English, any time.',
      'Limit time watching disaster news; keep small routines like meals and sleep where possible.',
    ],
    helplines: [H.manas, H.erss],
    callout: 'If you or someone else is in immediate danger, call 112 now.',
  },
]

export type AssistantSection = { title: string; steps: string[] }

export type AssistantReply = {
  intro: string
  sections?: AssistantSection[]
  helplines?: Helpline[]
  detected?: string[]
  callout?: string
}

const CORE_HELPLINES: Helpline[] = [H.erss, H.ambulance, H.police, H.fire, H.asdma]

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchKeyword(text: string, keyword: string) {
  const pattern = keyword.length <= 4 ? `\\b${escapeRegex(keyword)}\\b` : `\\b${escapeRegex(keyword)}`
  return new RegExp(pattern, 'i').test(text)
}

const GREETINGS = ['hi', 'hello', 'hey', 'namaskar', 'nomoskar', 'good morning', 'good evening', 'thanks', 'thank you']

export function getAssistantReply(message: string): AssistantReply {
  const text = message.toLowerCase().trim()

  const scored = GUIDE_TOPICS.map((topic) => {
    const hits = topic.keywords.filter((kw) => matchKeyword(text, kw))
    return { topic, hits, score: hits.reduce((acc, kw) => acc + kw.length, 0) }
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)

  if (scored.length > 0) {
    const [primary, secondary] = scored
    const helplines: Helpline[] = []
    for (const { topic } of scored) {
      for (const h of topic.helplines) {
        if (!helplines.some((x) => x.number === h.number)) helplines.push(h)
      }
    }
    return {
      intro: secondary
        ? `It sounds like this involves both ${primary.topic.label.toLowerCase()} and ${secondary.topic.label.toLowerCase()}. Here\u2019s what to do in Guwahati:`
        : `Here\u2019s what to do right now in Guwahati:`,
      sections: scored.map(({ topic }) => ({ title: topic.title, steps: topic.steps })),
      helplines: helplines.slice(0, 6),
      detected: Array.from(new Set(scored.flatMap((s) => s.hits))),
      callout: primary.topic.callout,
    }
  }

  if (GREETINGS.some((g) => text === g || text.startsWith(`${g} `) || text.startsWith(`${g},`))) {
    return {
      intro:
        'Nomoskar! I\u2019m the CommunityConnect Helper for Guwahati. Describe what\u2019s happening — for example "water entering my house" or "need an ambulance at Dispur" — and I\u2019ll give you steps and the right numbers.',
      helplines: CORE_HELPLINES,
    }
  }

  return {
    intro:
      'I couldn\u2019t identify the exact situation. Try mentioning words like flood, ambulance, hospital, police, power, fire, landslide, earthquake, accident, or snake. Meanwhile, these numbers cover most emergencies in Guwahati:',
    helplines: CORE_HELPLINES,
    callout: 'When in doubt, call 112 — it connects to police, fire, and ambulance.',
  }
}
