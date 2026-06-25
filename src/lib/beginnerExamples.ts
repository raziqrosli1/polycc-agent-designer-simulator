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
    priority: ['Keselamatan', 'Ketepatan', 'Kelajuan', 'Keadilan'],
    rules: [
      'MESTI eskalasi kes sakit dada untuk semakan segera.',
      'JANGAN turunkan keutamaan pesakit hanya kerana barisan panjang.',
      'SENTIASA tulis sebab untuk keputusan berisiko tinggi.',
    ],
    logic: [
      'Jika pesakit sakit dada teruk, maka utamakan triage segera. Sebab risiko boleh meningkat jika lambat.',
      'Jika maklumat penting tak lengkap, maka minta semakan manusia. Sebab keputusan jadi kurang yakin.',
    ],
    decision:
      'Eskalasi pesakit untuk semakan segera. Keselamatan lebih utama daripada kelajuan.',
  },
}
