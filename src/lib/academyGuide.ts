import type { Language } from '../types'

export interface AcademySection {
  id: string
  title: string
  bullets: string[]
}

export interface AcademyGuideOverview {
  title: string
  description: string
  sections: AcademySection[]
}

export const getAcademyGuideOverview = (
  language: Language,
): AcademyGuideOverview => {
  if (language === 'ms') {
    return {
      title: 'POLYCC Agentic AI League Academy',
      description:
        'Panduan beginner ini menggunakan hanya maklumat rasmi yang disahkan dalam fail pengetahuan pertandingan.',
      sections: [
        {
          id: 'objective',
          title: 'Competition Objective',
          bullets: [
            'Peserta dijangka belajar dan membina AI Agents menggunakan AWS tools yang disediakan melalui AWS Workshop.',
            'Fokus pertandingan merangkumi Agent Design, Problem Solving, Decision Making, Agentic Thinking, dan AI Workflow Design.',
          ],
        },
        {
          id: 'eligibility',
          title: 'Eligibility',
          bullets: [
            'Terbuka kepada semua pelajar POLYCC yang sedang belajar.',
            'Terbuka kepada pelajar yang baru menamatkan latihan industri.',
            'Tiada latar belakang teknikal diperlukan.',
            'Tiada latar belakang pengaturcaraan diperlukan.',
            'Tiada perkakasan khas diperlukan.',
            'Tiada pemasangan perisian diperlukan.',
          ],
        },
        {
          id: 'team',
          title: 'Team Composition',
          bullets: [
            'Setiap pasukan terdiri daripada 1 pensyarah mentor dan 2 pelajar.',
            'Seorang pensyarah boleh membimbing lebih daripada satu pasukan.',
          ],
        },
        {
          id: 'aws',
          title: 'AWS Workshop and Tools',
          bullets: [
            'Setiap pasukan akan menerima akses percuma ke AWS Workshop.',
            'AWS Workshop ialah persekitaran berasaskan web untuk kegunaan pertandingan.',
            'SageMaker AI Studio disenaraikan sebagai possible tool dalam AWS Workshop.',
            'Bedrock AgentCore disenaraikan sebagai possible tool dalam AWS Workshop.',
          ],
        },
        {
          id: 'final-logistics',
          title: 'Final Logistics',
          bullets: [
            'Kos perjalanan dan penginapan ditanggung oleh institusi, bukan oleh penganjur.',
            'Makanan dan minuman hanya disediakan semasa pusingan final.',
            'Pasukan final mesti membawa laptop dan peralatan peribadi yang diperlukan.',
          ],
        },
        {
          id: 'focus',
          title: 'What Participants Should Focus On Before 13 July',
          bullets: [
            'Belajar konsep AI Agent.',
            'Belajar Goal Design.',
            'Belajar Priority Design.',
            'Belajar Rule Design.',
            'Belajar If-Then Logic.',
            'Belajar Decision Design.',
            'Berlatih menyelesaikan senario.',
          ],
        },
        {
          id: 'gprid',
          title: 'GPRID Framework',
          bullets: [
            'Goal',
            'Priority',
            'Rules',
            'If-Then Logic',
            'Decision',
            'Simulator ini menggunakan GPRID sebagai rangka kerja pemikiran teras.',
          ],
        },
        {
          id: 'purpose',
          title: 'Simulator Purpose',
          bullets: [
            'Aplikasi ini direka untuk membantu pelajar bersedia bagi POLYCC Agentic AI League 2026.',
            'Latihan memfokuskan Agent Thinking, Structured Reasoning, Decision Design, AI Workflow Design, dan Competition Readiness.',
          ],
        },
      ],
    }
  }

  return {
    title: 'POLYCC Agentic AI League Academy',
    description:
      'This beginner guide uses only officially confirmed information from the competition knowledge file.',
    sections: [
      {
        id: 'objective',
        title: 'Competition Objective',
        bullets: [
          'Participants are expected to learn and build AI Agents using AWS tools provided through AWS Workshop.',
          'The competition focuses on Agent Design, Problem Solving, Decision Making, Agentic Thinking, and AI Workflow Design.',
        ],
      },
      {
        id: 'eligibility',
        title: 'Eligibility',
        bullets: [
          'Open to all POLYCC students currently studying.',
          'Open to students who have recently completed industrial training.',
          'No technical background required.',
          'No programming background required.',
          'No special hardware required.',
          'No software installation required.',
        ],
      },
      {
        id: 'team',
        title: 'Team Composition',
        bullets: [
          'Each team consists of 1 lecturer mentor and 2 students.',
          'A lecturer may mentor multiple teams.',
        ],
      },
      {
        id: 'aws',
        title: 'AWS Workshop and Tools',
        bullets: [
          'Each team will receive free access to AWS Workshop.',
          'AWS Workshop is a web-based environment provided for competition use.',
          'SageMaker AI Studio is listed as a possible tool in AWS Workshop.',
          'Bedrock AgentCore is listed as a possible tool in AWS Workshop.',
        ],
      },
      {
        id: 'final-logistics',
        title: 'Final Logistics',
        bullets: [
          'Travel and accommodation costs are covered by the institution, not the organizers.',
          'Food and beverage are provided only during the final round.',
          'Finalist teams must bring a laptop and any required personal equipment.',
        ],
      },
      {
        id: 'focus',
        title: 'What Participants Should Focus On Before 13 July',
        bullets: [
          'Learn AI Agent concepts.',
          'Learn Goal Design.',
          'Learn Priority Design.',
          'Learn Rule Design.',
          'Learn If-Then Logic.',
          'Learn Decision Design.',
          'Practice solving scenarios.',
        ],
      },
      {
        id: 'gprid',
        title: 'GPRID Framework',
        bullets: [
          'Goal',
          'Priority',
          'Rules',
          'If-Then Logic',
          'Decision',
          'This simulator uses GPRID as the core thinking framework.',
        ],
      },
      {
        id: 'purpose',
        title: 'Simulator Purpose',
        bullets: [
          'This application is designed to help students prepare for POLYCC Agentic AI League 2026.',
          'It trains Agent Thinking, Structured Reasoning, Decision Design, AI Workflow Design, and Competition Readiness.',
        ],
      },
    ],
  }
}
