import type { Language } from '../types'

export interface JourneyStage {
  id: string
  title: string
  confirmed: string[]
  assumptions: string[]
  unknowns: string[]
  focusToday: string
}

export interface JourneyOverview {
  currentPhaseTitle: string
  currentPhaseStatus: string
  currentFocus: string
  stages: JourneyStage[]
}

const competitionStartDate = new Date('2026-07-13T00:00:00')

export const getCompetitionJourneyOverview = (
  language: Language,
  today: Date = new Date(),
): JourneyOverview => {
  const beforeCompetition = today.getTime() < competitionStartDate.getTime()

  if (language === 'ms') {
    return {
      currentPhaseTitle: beforeCompetition
        ? 'Fasa Semasa: Self-Training'
        : 'Fasa Semasa: Competition',
      currentPhaseStatus: beforeCompetition
        ? 'Tarikh semasa masih sebelum permulaan rasmi pertandingan pada 13 Julai 2026.'
        : 'Tarikh semasa berada pada atau selepas permulaan rasmi pertandingan pada 13 Julai 2026.',
      currentFocus: beforeCompetition
        ? 'Fokus hari ini: belajar konsep AI Agent, Goal, Priority, Rules, If-Then Logic, Decision, dan berlatih menyelesaikan senario sebelum 13 Julai.'
        : 'Fokus hari ini: pertandingan rasmi telah bermula, tetapi aplikasi ini hanya memaparkan maklumat yang telah disahkan secara rasmi.',
      stages: [
        {
          id: 'eligibility',
          title: '1. Eligibility',
          confirmed: [
            'Terbuka kepada semua pelajar POLYCC yang sedang belajar.',
            'Terbuka kepada pelajar yang baru menamatkan latihan industri.',
            'Tiada latar belakang teknikal diperlukan.',
            'Tiada latar belakang pengaturcaraan diperlukan.',
            'Tiada perkakasan khas diperlukan.',
            'Tiada pemasangan perisian diperlukan.',
          ],
          assumptions: [],
          unknowns: [],
          focusToday:
            'Pastikan semua ahli yang berminat tahu bahawa pertandingan ini tidak memerlukan coding, hardware khas, atau pemasangan perisian.',
        },
        {
          id: 'team',
          title: '2. Team Composition',
          confirmed: [
            'Setiap pasukan terdiri daripada 1 pensyarah mentor dan 2 pelajar.',
            'Seorang pensyarah boleh membimbing lebih daripada satu pasukan.',
          ],
          assumptions: [],
          unknowns: [],
          focusToday:
            'Susun pasukan mengikut struktur rasmi ini sebelum memberi fokus kepada latihan dan penyediaan pertandingan.',
        },
        {
          id: 'aws-workshop',
          title: '3. AWS Workshop',
          confirmed: [
            'Setiap pasukan akan menerima akses percuma ke AWS Workshop.',
            'AWS Workshop ialah persekitaran berasaskan web untuk kegunaan pertandingan.',
          ],
          assumptions: [],
          unknowns: [
            'Jadual workshop yang tepat masih belum disahkan.',
          ],
          focusToday:
            'Anggap AWS Workshop sebagai ruang rasmi pembelajaran dan penggunaan tools pertandingan apabila akses diberikan.',
        },
        {
          id: 'sagemaker',
          title: '4. SageMaker AI Studio',
          confirmed: [
            'SageMaker AI Studio disenaraikan sebagai possible tool dalam AWS Workshop.',
          ],
          assumptions: [],
          unknowns: [],
          focusToday:
            'Fahami bahawa SageMaker AI Studio ialah salah satu tools yang mungkin digunakan melalui AWS Workshop.',
        },
        {
          id: 'agentcore',
          title: '5. Bedrock AgentCore',
          confirmed: [
            'Bedrock AgentCore disenaraikan sebagai possible tool dalam AWS Workshop.',
          ],
          assumptions: [],
          unknowns: [],
          focusToday:
            'Fahami bahawa Bedrock AgentCore ialah salah satu tools yang mungkin digunakan melalui AWS Workshop.',
        },
        {
          id: 'structure',
          title: '6. Competition Structure',
          confirmed: [
            'Struktur pertandingan mempunyai 4 peringkat: Institution Screening, Institution Selection, National Selection, dan Grand Final.',
          ],
          assumptions: [],
          unknowns: [],
          focusToday:
            'Gunakan struktur rasmi ini untuk memahami laluan daripada penyertaan institusi ke peringkat akhir.',
        },
        {
          id: 'screening',
          title: '7. Institution Screening',
          confirmed: [
            'Semua pasukan dari institusi yang sama boleh mengambil bahagian.',
            'Tiada had bilangan pasukan bagi setiap institusi.',
          ],
          assumptions: [],
          unknowns: [],
          focusToday:
            'Fokus kepada prestasi terbaik di peringkat institusi kerana semua pasukan boleh bermula dari sini.',
        },
        {
          id: 'national-selection',
          title: '8. National Selection',
          confirmed: [
            'Hanya satu pasukan dengan skor tertinggi dari setiap institusi akan menjadi wakil institusi.',
            'Pasukan dengan skor tertinggi merentas institusi akan dinilai di peringkat kebangsaan.',
          ],
          assumptions: [],
          unknowns: [],
          focusToday:
            'Matlamat awal ialah menjadi wakil institusi dahulu, kemudian bersaing berdasarkan skor di peringkat kebangsaan.',
        },
        {
          id: 'top-five',
          title: '9. Top 5 Finalists',
          confirmed: [
            'Lima pasukan dengan skor tertinggi dan pengesahan kehadiran akan mara ke final.',
            'Bilangan akhir boleh berubah bergantung pada kapasiti venue.',
          ],
          assumptions: [],
          unknowns: [],
          focusToday:
            'Selain skor tinggi, pasukan juga perlu memberi pengesahan kehadiran untuk layak ke final.',
        },
        {
          id: 'travel',
          title: '10. Travel and Accommodation Rules',
          confirmed: [
            'Kos perjalanan dan penginapan ditanggung oleh institusi.',
            'Tidak disediakan oleh penganjur.',
          ],
          assumptions: [],
          unknowns: [],
          focusToday:
            'Institusi perlu merancang bajet dan logistik sendiri jika pasukan mara ke peringkat akhir.',
        },
        {
          id: 'final-requirements',
          title: '11. Final Round Requirements',
          confirmed: [
            'Pasukan yang mara ke final mesti membawa laptop.',
            'Pasukan juga mesti membawa peralatan peribadi yang diperlukan.',
            'Lokasi final ialah Selangor / Kuala Lumpur.',
          ],
          assumptions: [],
          unknowns: [
            'Lokasi tepat final masih TBD.',
            'Tarikh tepat final masih belum disahkan.',
            'Format cabaran final masih belum disahkan.',
            'Format submission masih belum disahkan.',
            'Scoring rubric masih belum disahkan.',
            'Keperluan presentation masih belum disahkan.',
          ],
          focusToday:
            'Pastikan pasukan sentiasa sedia dengan laptop dan peralatan sendiri sambil menunggu butiran akhir.',
        },
        {
          id: 'confirmed-vs-unknown',
          title: '12. Confirmed vs Unknown Information',
          confirmed: [
            'Permulaan rasmi pertandingan ialah 13 Julai 2026.',
            'AWS Workshop disahkan.',
            'SageMaker AI Studio disenaraikan sebagai possible tool.',
            'Bedrock AgentCore disenaraikan sebagai possible tool.',
            'Tiada coding diperlukan.',
            'Institution screening disahkan.',
            'Satu pasukan bagi setiap institusi akan mara sebagai wakil.',
            'Top five teams advance nationally, tertakluk kepada kapasiti venue.',
            'Final di Selangor / Kuala Lumpur.',
          ],
          assumptions: [],
          unknowns: [
            'Format cabaran final.',
            'Format submission.',
            'Scoring rubric.',
            'Keperluan presentation.',
            'Tarikh final yang tepat.',
            'Jadual workshop yang tepat.',
            'Lokasi final yang tepat.',
          ],
          focusToday:
            'Gunakan hanya maklumat confirmed untuk perancangan. Jika sesuatu tidak disahkan dalam fail rasmi, anggap ia masih unknown.',
        },
        {
          id: 'final-support',
          title: '13. Final Round Support',
          confirmed: [
            'Makanan dan minuman hanya disediakan semasa pusingan final.',
          ],
          assumptions: [],
          unknowns: [],
          focusToday:
            'Jangan anggap sokongan makanan disediakan lebih awal; maklumat rasmi hanya mengesahkan penyediaan semasa final.',
        },
      ],
    }
  }

  return {
    currentPhaseTitle: beforeCompetition
      ? 'Current Phase: Self-Training'
      : 'Current Phase: Competition',
    currentPhaseStatus: beforeCompetition
      ? 'Today is still before the official competition start on 13 July 2026.'
      : 'Today is on or after the official competition start on 13 July 2026.',
    currentFocus: beforeCompetition
      ? 'Focus today: learn AI Agent concepts, Goal, Priority, Rules, If-Then Logic, Decision, and practice solving scenarios before 13 July.'
      : 'Focus today: the official competition period has started, but this app still shows only officially confirmed information.',
    stages: [
      {
        id: 'eligibility',
        title: '1. Eligibility',
        confirmed: [
          'Open to all POLYCC students currently studying.',
          'Open to students who have recently completed industrial training.',
          'No technical background required.',
          'No programming background required.',
          'No special hardware required.',
          'No software installation required.',
        ],
        assumptions: [],
        unknowns: [],
        focusToday:
          'Make sure interested students understand that the competition does not require coding, special hardware, or software installation.',
      },
      {
        id: 'team',
        title: '2. Team Composition',
        confirmed: [
          'Each team consists of 1 lecturer mentor and 2 students.',
          'A lecturer may mentor multiple teams.',
        ],
        assumptions: [],
        unknowns: [],
        focusToday:
          'Organize teams using the confirmed official structure before moving deeper into training and competition preparation.',
      },
      {
        id: 'aws-workshop',
        title: '3. AWS Workshop',
        confirmed: [
          'Each team will receive free access to AWS Workshop.',
          'AWS Workshop is a web-based environment provided for competition use.',
        ],
        assumptions: [],
        unknowns: ['The exact workshop schedule is not yet confirmed.'],
        focusToday:
          'Treat AWS Workshop as the confirmed official environment once access is provided.',
      },
      {
        id: 'sagemaker',
        title: '4. SageMaker AI Studio',
        confirmed: [
          'SageMaker AI Studio is listed as a possible tool in AWS Workshop.',
        ],
        assumptions: [],
        unknowns: [],
        focusToday:
          'Understand that SageMaker AI Studio is one of the named tools students may encounter through AWS Workshop.',
      },
      {
        id: 'agentcore',
        title: '5. Bedrock AgentCore',
        confirmed: [
          'Bedrock AgentCore is listed as a possible tool in AWS Workshop.',
        ],
        assumptions: [],
        unknowns: [],
        focusToday:
          'Understand that Bedrock AgentCore is one of the named tools students may encounter through AWS Workshop.',
      },
      {
        id: 'structure',
        title: '6. Competition Structure',
        confirmed: [
          'The competition has 4 stages: Institution Screening, Institution Selection, National Selection, and Grand Final.',
        ],
        assumptions: [],
        unknowns: [],
        focusToday:
          'Use the confirmed stage structure to understand the official progression from institution level to the final round.',
      },
      {
        id: 'screening',
        title: '7. Institution Screening',
        confirmed: [
          'All teams from the same institution may participate.',
          'There is no limit on the number of teams.',
        ],
        assumptions: [],
        unknowns: [],
        focusToday:
          'Focus on strong internal performance first because every eligible team can enter at the institution stage.',
      },
      {
        id: 'national-selection',
        title: '8. National Selection',
        confirmed: [
          'Only one team with the highest score from each institution becomes the institution representative.',
          'Top scoring teams across institutions are evaluated nationally.',
        ],
        assumptions: [],
        unknowns: [],
        focusToday:
          'The first milestone is to become the highest-scoring team in your institution, then compete nationally.',
      },
      {
        id: 'top-five',
        title: '9. Top 5 Finalists',
        confirmed: [
          'Five teams with the highest scores and attendance confirmation advance to the final.',
          'The final number may change depending on venue capacity.',
        ],
        assumptions: [],
        unknowns: [],
        focusToday:
          'High scores matter, but attendance confirmation is also part of final qualification.',
      },
      {
        id: 'travel',
        title: '10. Travel and Accommodation Rules',
        confirmed: [
          'Travel and accommodation costs are covered by the institution.',
          'These costs are not provided by the organizers.',
        ],
        assumptions: [],
        unknowns: [],
        focusToday:
          'Institutions need to prepare their own logistics and budget if a team reaches the final.',
      },
      {
        id: 'final-requirements',
        title: '11. Final Round Requirements',
        confirmed: [
          'Finalist teams must bring a laptop.',
          'Finalist teams must bring the required personal equipment.',
          'The grand final location is Selangor / Kuala Lumpur.',
        ],
        assumptions: [],
        unknowns: [
          'Exact final location is TBD.',
          'Exact final date is not confirmed.',
          'Final challenge format is not confirmed.',
          'Submission format is not confirmed.',
          'Scoring rubric is not confirmed.',
          'Presentation requirement is not confirmed.',
        ],
        focusToday:
          'Stay prepared to bring your own laptop and equipment while waiting for the remaining final-round details.',
      },
      {
        id: 'confirmed-vs-unknown',
        title: '12. Confirmed vs Unknown Information',
        confirmed: [
          'The official competition start is 13 July 2026.',
          'AWS Workshop is confirmed.',
          'SageMaker AI Studio is listed as a possible tool.',
          'Bedrock AgentCore is listed as a possible tool.',
          'No coding is required.',
          'Institution screening is confirmed.',
          'One team per institution advances as the representative.',
          'Top five teams advance nationally, subject to venue capacity.',
          'The final is in Selangor / Kuala Lumpur.',
        ],
        assumptions: [],
        unknowns: [
          'Final challenge format.',
          'Submission format.',
          'Scoring rubric.',
          'Presentation requirement.',
          'Exact final date.',
          'Exact workshop schedule.',
          'Exact final location.',
        ],
        focusToday:
          'Use confirmed facts for planning. If the official file does not confirm something, treat it as unknown.',
      },
      {
        id: 'final-support',
        title: '13. Final Round Support',
        confirmed: ['Food and beverage are provided only during the final round.'],
        assumptions: [],
        unknowns: [],
        focusToday:
          'Do not assume meals are provided before the final stage; the official file only confirms support during the final round.',
      },
    ],
  }
}
