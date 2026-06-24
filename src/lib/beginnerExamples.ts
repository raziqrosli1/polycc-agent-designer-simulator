import type { Language } from '../types'

export const beginnerExamples: Record<
  Language,
  {
    goal: string
    priority: string[]
    rules: string[]
    logic: string[]
    decision: string
  }
> = {
  en: {
    goal:
      'Prioritize patients safely within 10 minutes while keeping urgent cases ahead of routine cases.',
    priority: ['Safety', 'Accuracy', 'Speed', 'Fairness'],
    rules: [
      'MUST escalate any chest-pain case to urgent review.',
      'NEVER downgrade a patient because the queue is long.',
      'ALWAYS record the reason for high-risk decisions.',
    ],
    logic: [
      'IF the patient has severe chest pain THEN prioritize urgent triage BECAUSE delayed care could increase harm.',
      'IF vital signs are incomplete THEN request human review BECAUSE missing data reduces confidence.',
    ],
    decision:
      'Escalate the patient for urgent review because safety outranks speed and the hard-risk rules have been triggered.',
  },
  ms: {
    goal:
      'Utamakan pesakit secara selamat dalam 10 minit sambil memastikan kes mendesak diutamakan berbanding kes rutin.',
    priority: ['Safety', 'Accuracy', 'Speed', 'Fairness'],
    rules: [
      'MUST eskalasi mana-mana kes sakit dada untuk semakan segera.',
      'NEVER menurunkan keutamaan pesakit hanya kerana barisan panjang.',
      'ALWAYS rekod sebab bagi keputusan berisiko tinggi.',
    ],
    logic: [
      'IF pesakit mengalami sakit dada yang teruk THEN utamakan triage segera BECAUSE kelewatan rawatan boleh meningkatkan risiko.',
      'IF tanda vital tidak lengkap THEN minta semakan manusia BECAUSE data yang hilang mengurangkan keyakinan.',
    ],
    decision:
      'Eskalasi pesakit untuk semakan segera kerana safety lebih utama daripada speed dan hard-risk rules telah dicetuskan.',
  },
}
