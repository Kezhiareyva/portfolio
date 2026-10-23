// Run with `npm run seed`. Re-running replaces the seeded content and never touches admin users.
import config from '@payload-config'
import { getPayload } from 'payload'

type Localized<T> = { en: T; id: T }

const payload = await getPayload({ config })

// ---------- Globals ----------

const profile = {
  name: 'Kezhia Reyva Cahya Erliyana',
  role: {
    en: 'Web developer and UI/UX designer',
    id: 'Web developer dan UI/UX designer',
  },
  intro: {
    en: 'I build React dashboards and PHP/MySQL web apps, and design the interfaces they run on. Right now I maintain the Tel-U ATC website, after a year-long internship at RA-ATAP building a real-time altimeter dashboard.',
    id: 'Saya membangun dashboard React dan aplikasi web PHP/MySQL, sekaligus mendesain antarmukanya. Saat ini saya mengelola website Tel-U ATC, setelah setahun magang di RA-ATAP membangun dashboard altimeter real-time.',
  },
  location: { en: 'Bandung, Indonesia', id: 'Bandung, Indonesia' },
  availability: {
    en: 'Open to web developer, frontend and UI/UX roles',
    id: 'Terbuka untuk posisi web developer, frontend, dan UI/UX',
  },
  about: {
    en: [
      'I graduated from Telkom University in 2026 with a D3 in Computer Technology, and I have been building web projects since vocational school at SMK Telkom Malang.',
      'My work sits between design and code. I sketch and prototype in Figma, then build the result in React, Next.js and TypeScript, or PHP and MySQL when a project calls for it. Computer Technology also gave me hands-on time with hardware, from an RFID parking system to a line follower robot.',
      'Since 2024 I have also taught digital arts at Kodland, which has made me better at explaining technical ideas and working with different people.',
    ],
    id: [
      'Saya lulus D3 Teknologi Komputer dari Telkom University pada 2026, dan sudah membangun proyek web sejak SMK di SMK Telkom Malang.',
      'Pekerjaan saya ada di antara desain dan kode. Saya membuat sketsa dan prototipe di Figma, lalu membangunnya dengan React, Next.js, dan TypeScript, atau PHP dan MySQL bila proyeknya membutuhkan. Dari Teknologi Komputer, saya juga terbiasa dengan perangkat keras, mulai dari sistem parkir RFID sampai robot line follower.',
      'Sejak 2024 saya juga mengajar seni digital di Kodland, yang membuat saya lebih terampil menjelaskan ide teknis dan bekerja dengan banyak orang.',
    ],
  },
  education: [
    {
      school: 'Telkom University',
      program: { en: 'D3 Computer Technology', id: 'D3 Teknologi Komputer' },
      period: '2023 – 2026',
    },
    {
      school: 'SMK Telkom Malang',
      program: { en: 'Software Engineering', id: 'Rekayasa Perangkat Lunak' },
      period: '2020 – 2023',
    },
  ],
  links: {
    email: 'kezhiarce@gmail.com',
    linkedin: 'https://www.linkedin.com/in/kezhiarce/',
    github: 'https://github.com/Kezhiareyva',
  },
}

const skills: { label: Localized<string>; items: string[] }[] = [
  {
    label: { en: 'Frontend', id: 'Frontend' },
    items: [
      'React.js',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'HTML',
      'CSS',
      'Bootstrap',
    ],
  },
  {
    label: { en: 'Backend and data', id: 'Backend dan data' },
    items: ['PHP', 'Node.js', 'MySQL', 'REST APIs', 'Docker', 'Git'],
  },
  {
    label: { en: 'Design', id: 'Desain' },
    items: [
      'Figma',
      'UI/UX design',
      'Adobe Illustrator',
      'Adobe Photoshop',
      'Adobe Premiere Pro',
      'Blender',
    ],
  },
  {
    label: { en: 'Mobile and hardware', id: 'Mobile dan perangkat keras' },
    items: ['Java (Android)', 'Android Studio', 'IoT', 'Microcontrollers', 'RFID'],
  },
]

const site = {
  title: {
    en: 'Kezhia Reyva | Web developer and UI/UX designer',
    id: 'Kezhia Reyva | Web developer dan UI/UX designer',
  },
  description: {
    en: 'Portfolio of Kezhia Reyva Cahya Erliyana, a web developer and UI/UX designer from Bandung who builds with React, Next.js and TypeScript.',
    id: 'Portofolio Kezhia Reyva Cahya Erliyana, web developer dan UI/UX designer dari Bandung yang membangun dengan React, Next.js, dan TypeScript.',
  },
}

// ---------- Collections ----------

type ExperienceSeed = {
  role: Localized<string>
  organization: string
  employmentType?: Localized<string>
  location?: Localized<string>
  startDate: string
  endDate?: string
  current?: boolean
  highlights: Localized<string[]>
  skills: string[]
  order: number
}

const experiences: ExperienceSeed[] = [
  {
    role: { en: 'Web Developer', id: 'Web Developer' },
    organization: 'Tel-U ATC',
    location: { en: 'Bandung', id: 'Bandung' },
    startDate: '2026-07-01',
    current: true,
    highlights: {
      en: [
        'Maintain and optimize the Tel-U ATC website for performance, responsiveness and secure access.',
        "Monitor the system, troubleshoot issues and ship regular feature updates to keep the institution's digital services stable.",
      ],
      id: [
        'Mengelola dan mengoptimalkan website Tel-U ATC agar cepat, responsif, dan aman diakses.',
        'Memantau sistem, menangani kendala teknis, dan merilis pembaruan fitur secara rutin agar layanan digital institusi tetap stabil.',
      ],
    },
    skills: ['Web Development', 'Troubleshooting', 'Docker'],
    order: 3,
  },
  {
    role: { en: 'Social Media Officer', id: 'Social Media Officer' },
    organization: 'Tel-U ATC',
    location: { en: 'Bandung', id: 'Bandung' },
    startDate: '2026-07-01',
    current: true,
    highlights: {
      en: [
        "Plan, curate and publish content for Tel-U ATC's official social media channels.",
        'Manage two-way communication with the online audience and keep a professional institutional image.',
      ],
      id: [
        'Merencanakan, mengkurasi, dan menerbitkan konten untuk media sosial resmi Tel-U ATC.',
        'Mengelola komunikasi dua arah dengan audiens daring dan menjaga citra institusi yang profesional.',
      ],
    },
    skills: ['Social Media Management', 'Content Planning'],
    order: 2,
  },
  {
    role: { en: 'Administrator', id: 'Administrator' },
    organization: 'Tel-U ATC',
    location: { en: 'Bandung', id: 'Bandung' },
    startDate: '2026-07-01',
    current: true,
    highlights: {
      en: ['Coordinate administrative needs between internal teams and external stakeholders.'],
      id: ['Mengoordinasikan kebutuhan administrasi antara tim internal dan pihak eksternal.'],
    },
    skills: ['Administration', 'Stakeholder Management'],
    order: 1,
  },
  {
    role: { en: 'Web Developer Intern', id: 'Web Developer (Magang)' },
    organization: 'RA-ATAP',
    employmentType: { en: 'Internship', id: 'Magang' },
    location: { en: 'Bandung', id: 'Bandung' },
    startDate: '2025-08-01',
    endDate: '2026-07-01',
    highlights: {
      en: [
        'Built a web-based altimeter monitoring dashboard in React.',
        'Integrated APIs to track and display altimeter data in real time.',
      ],
      id: [
        'Membangun dashboard pemantauan altimeter berbasis web dengan React.',
        'Mengintegrasikan API untuk melacak dan menampilkan data altimeter secara real-time.',
      ],
    },
    skills: ['React.js', 'JavaScript', 'REST APIs', 'Data Visualization'],
    order: 0,
  },
  {
    role: { en: 'Digital Arts Tutor', id: 'Tutor Seni Digital' },
    organization: 'Kodland',
    employmentType: { en: 'Freelance', id: 'Freelance' },
    location: { en: 'Remote', id: 'Remote' },
    startDate: '2024-07-01',
    current: true,
    highlights: {
      en: [
        'Teach interactive digital arts classes with creative strategies that keep students engaged.',
        "Adapt to each student's pace and guide them through new concepts to build their confidence.",
        'Work with the team to keep classes running smoothly and keep refining my teaching methods.',
      ],
      id: [
        'Mengajar kelas seni digital yang interaktif dengan strategi kreatif agar siswa tetap antusias.',
        'Menyesuaikan dengan kecepatan belajar tiap siswa dan membimbing mereka memahami konsep baru agar lebih percaya diri.',
        'Bekerja sama dengan tim agar kelas berjalan lancar dan terus memperbaiki metode mengajar.',
      ],
    },
    skills: ['Teaching', 'Communication', 'Graphic Design'],
    order: 0,
  },
  {
    role: { en: 'Android Developer Intern', id: 'Android Developer (Magang)' },
    organization: 'University of Brawijaya',
    employmentType: { en: 'Internship', id: 'Magang' },
    location: { en: 'Malang', id: 'Malang' },
    startDate: '2022-07-01',
    endDate: '2022-12-01',
    highlights: {
      en: [
        'Built an Android infrastructure management app in Java, connected to a RESTful API.',
        'Built an Android attendance app for the internship program.',
        'Created a network monitoring website with HTML and CSS and helped fellow interns with their web projects.',
      ],
      id: [
        'Membangun aplikasi Android manajemen infrastruktur dengan Java yang terhubung ke RESTful API.',
        'Membangun aplikasi Android untuk presensi program magang.',
        'Membuat website pemantauan jaringan dengan HTML dan CSS serta membantu proyek web sesama peserta magang.',
      ],
    },
    skills: ['Android Development', 'Java', 'REST APIs'],
    order: 0,
  },
]

type ProjectSeed = {
  slug: string
  title: Localized<string>
  context: string
  year?: string
  summary: Localized<string>
  stack: string[]
  demo?: 'none' | 'altimeter' | 'sketch'
  featured?: boolean
  order: number
}

const projects: ProjectSeed[] = [
  {
    slug: 'altimeter-dashboard',
    title: {
      en: 'Real-time altimeter monitoring dashboard',
      id: 'Dashboard pemantauan altimeter real-time',
    },
    context: 'RA-ATAP',
    year: '2025–2026',
    summary: {
      en: 'A web dashboard that tracks altimeter readings live. Built in React and connected to APIs, so the numbers and the chart update as new data arrives.',
      id: 'Dashboard web yang memantau data altimeter secara langsung. Dibangun dengan React dan terhubung ke API, sehingga angka dan grafiknya ikut berubah saat data baru masuk.',
    },
    stack: ['React.js', 'JavaScript', 'REST APIs'],
    demo: 'altimeter',
    featured: true,
    order: 1,
  },
  {
    slug: 'laundry-database',
    title: { en: 'Laundry business database system', id: 'Sistem database usaha laundry' },
    context: 'Telkom University',
    summary: {
      en: 'A database for a laundry business that stores customer data, tracks every service order and records transactions.',
      id: 'Database untuk usaha laundry yang menyimpan data pelanggan, melacak setiap pesanan layanan, dan mencatat transaksi.',
    },
    stack: ['MySQL', 'Database Design'],
    demo: 'sketch',
    featured: true,
    order: 2,
  },
  {
    slug: 'rfid-parking',
    title: { en: 'RFID-based parking system', id: 'Sistem parkir berbasis RFID' },
    context: 'Telkom University',
    summary: {
      en: 'A parking system built around RFID that ties the hardware components and the software that runs them into one working system.',
      id: 'Sistem parkir berbasis RFID yang menyatukan komponen perangkat keras dan perangkat lunaknya menjadi satu sistem yang berjalan.',
    },
    stack: ['RFID', 'Microcontrollers', 'Embedded Systems'],
    order: 3,
  },
  {
    slug: 'line-follower',
    title: { en: 'Line follower robot', id: 'Robot line follower' },
    context: 'Telkom University',
    summary: {
      en: 'A robot that follows a line using sensor-based navigation, with the control logic programmed on a microcontroller.',
      id: 'Robot yang mengikuti garis dengan navigasi berbasis sensor, dengan logika kendali yang diprogram pada mikrokontroler.',
    },
    stack: ['Microcontrollers', 'Sensors'],
    order: 4,
  },
  {
    slug: 'infrastructure-android',
    title: {
      en: 'Infrastructure management Android app',
      id: 'Aplikasi Android manajemen infrastruktur',
    },
    context: 'University of Brawijaya',
    year: '2022',
    summary: {
      en: 'An Android app for managing infrastructure data, built in Java and connected to a RESTful API.',
      id: 'Aplikasi Android untuk mengelola data infrastruktur, dibangun dengan Java dan terhubung ke RESTful API.',
    },
    stack: ['Java', 'Android Studio', 'REST APIs'],
    order: 5,
  },
  {
    slug: 'spp-web-app',
    title: { en: 'School tuition (SPP) web app', id: 'Aplikasi web pembayaran SPP' },
    context: 'SMK Telkom Malang',
    summary: {
      en: 'A web app for managing school tuition (SPP) payments.',
      id: 'Aplikasi web untuk mengelola pembayaran SPP sekolah.',
    },
    stack: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'PHP', 'MySQL'],
    order: 6,
  },
]

const certifications = [
  {
    name: 'Google UX Design',
    issuer: 'Google',
    issuedAt: '2026-07-01',
    credentialId: 'Z1FS6YEIDZNI',
    credentialUrl: 'https://coursera.org/verify/professional-cert/Z1FS6YEIDZNI',
  },
  {
    name: 'Google AI',
    issuer: 'Google',
    issuedAt: '2026-06-01',
    credentialId: '0BCCA009X2YU',
    credentialUrl: 'https://coursera.org/verify/professional-cert/0BCCA009X2YU',
  },
  {
    name: 'Google Data Analysis with Python',
    issuer: 'Google',
    issuedAt: '2026-06-01',
    credentialId: 'SU87LTV4I4H9',
    credentialUrl: 'https://coursera.org/verify/specialization/SU87LTV4I4H9',
  },
  { name: 'Microsoft Certified: Azure AI Fundamentals', issuer: 'Microsoft' },
  {
    name: 'Certificate of Competency Android',
    issuer: 'DOT Indonesia',
    credentialId: 'ID/DOT/20230404/D0002_185',
  },
  { name: 'Junior Graphic Design', issuer: 'BNSP' },
  { name: 'Junior Network Administrator', issuer: 'BNSP' },
  { name: 'EPrT (English Proficiency Test)', issuer: 'Telkom University', issuedAt: '2025-05-01' },
  { name: 'IC3 Digital Literacy Certification', issuer: 'Certiport' },
].map((cert, index) => ({ ...cert, order: index + 1 }))

// ---------- Write ----------

async function clear(collection: 'experiences' | 'projects' | 'certifications') {
  await payload.delete({ collection, where: { id: { exists: true } } })
}

// `education` and `groups` are non-localized arrays with localized fields, so the Indonesian
// pass reuses the English row ids. New ids would replace the rows and drop the English values.
const enProfile = await payload.updateGlobal({
  slug: 'profile',
  locale: 'en',
  data: {
    name: profile.name,
    role: profile.role.en,
    intro: profile.intro.en,
    location: profile.location.en,
    availability: profile.availability.en,
    about: profile.about.en.map((text) => ({ text })),
    education: profile.education.map((e) => ({
      school: e.school,
      program: e.program.en,
      period: e.period,
    })),
    links: profile.links,
  },
})
await payload.updateGlobal({
  slug: 'profile',
  locale: 'id',
  data: {
    role: profile.role.id,
    intro: profile.intro.id,
    location: profile.location.id,
    availability: profile.availability.id,
    about: profile.about.id.map((text) => ({ text })),
    education: (enProfile.education ?? []).map((row, i) => ({
      id: row.id,
      school: row.school,
      period: row.period,
      program: profile.education[i].program.id,
    })),
  },
})

const enSkills = await payload.updateGlobal({
  slug: 'skills',
  locale: 'en',
  data: { groups: skills.map((g) => ({ label: g.label.en, items: g.items })) },
})
await payload.updateGlobal({
  slug: 'skills',
  locale: 'id',
  data: {
    groups: (enSkills.groups ?? []).map((row, i) => ({
      id: row.id,
      items: row.items,
      label: skills[i].label.id,
    })),
  },
})

for (const locale of ['en', 'id'] as const) {
  await payload.updateGlobal({
    slug: 'site',
    locale,
    data: { title: site.title[locale], description: site.description[locale] },
  })
}

await clear('experiences')
for (const exp of experiences) {
  const doc = await payload.create({
    collection: 'experiences',
    locale: 'en',
    data: {
      role: exp.role.en,
      organization: exp.organization,
      employmentType: exp.employmentType?.en,
      location: exp.location?.en,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current ?? false,
      highlights: exp.highlights.en.map((text) => ({ text })),
      skills: exp.skills,
      order: exp.order,
    },
  })
  await payload.update({
    collection: 'experiences',
    id: doc.id,
    locale: 'id',
    data: {
      role: exp.role.id,
      employmentType: exp.employmentType?.id,
      location: exp.location?.id,
      highlights: exp.highlights.id.map((text) => ({ text })),
    },
  })
}

await clear('projects')
for (const project of projects) {
  const doc = await payload.create({
    collection: 'projects',
    locale: 'en',
    data: {
      slug: project.slug,
      title: project.title.en,
      context: project.context,
      year: project.year,
      summary: project.summary.en,
      stack: project.stack,
      demo: project.demo ?? 'none',
      featured: project.featured ?? false,
      order: project.order,
    },
  })
  await payload.update({
    collection: 'projects',
    id: doc.id,
    locale: 'id',
    data: { title: project.title.id, summary: project.summary.id },
  })
}

await clear('certifications')
for (const cert of certifications) {
  await payload.create({ collection: 'certifications', data: cert })
}

payload.logger.info(
  'Seed complete: profile, skills, site, 6 experiences, 6 projects, 9 certifications.',
)
process.exit(0)
