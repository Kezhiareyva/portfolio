import { useState } from 'react'

function App() {
  const defaultProjects = [
    {
      id: 5,
      title: 'Digital Arts Tutor | Freelance at Kodland',
      description: 'Delivered interactive digital arts classes, adapted instructional methods to individual learning paces, and collaborated with team members to ensure seamless class delivery.',
      imageUrl: '',
      link: ''
    },
    {
      id: 1,
      title: 'Web Developer Intern | RA-ATAP',
      description: 'Developed a web-based altimeter monitoring dashboard using React with API integration for real-time data tracking.',
      imageUrl: '',
      link: 'http://tes.kezhia.online/'
    },
    {
      id: 2,
      title: 'Web Developer | TEL-U ATC',
      description: 'Manage, maintain, and optimize the infrastructure and functionality of the Tel-U ATC website to ensure optimal performance, responsiveness, and secure user access.',
      imageUrl: '',
      link: 'https://amto.telkomuniversity.ac.id/'
    },
    {
      id: 3,
      title: 'Android Developer Intern | Brawijaya University',
      description: 'Created Android app of infrastructure management with RESTful API, internship attendance system, and network monitoring website using HTML/CSS.',
      imageUrl: '',
      link: ''
    },
    {
      id: 4,
      title: 'College Projects | Telkom University',
      description: 'Built websites using HTML/CSS, JS, PHP, Node.js, MySQL. Designed an RFID-based parking system, AC-to-DC power supply, and a laundry database system.',
      imageUrl: '',
      links: [
        { name: 'Dashboard Project', url: 'http://dashboard.kezhia.online/' },
        { name: 'Tasks Project', url: 'http://tasks.kezhia.online/' }
      ]
    }
  ];

  const [projects] = useState(defaultProjects);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
      <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Kezhia Reyva Cahya Erliyana
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
            <a href="#projects" className="text-slate-300 hover:text-white transition-colors">Experience & Projects</a>
            <a href="#contact" className="text-slate-300 hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="about" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Kezhia Reyva Cahya Erliyana</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-300 mb-6">
              Web Developer & UI/UX Enthusiast
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              I am a Computer Technology student at Telkom University with a strong interest in Web Development and UI/UX Design. I have hands-on experience in developing web applications through academic and internship projects, using technologies such as React, HTML, CSS, JavaScript, PHP, and Node.js.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="#projects" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                View My Work
              </a>
              <a href="#contact" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-medium transition-colors border border-slate-700">
                Contact Me
              </a>
              <a href="/Kezhia_Reyva_CV.pdf" download className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-medium transition-colors border border-slate-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download CV
              </a>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        </section>

        {/* Education Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Education</h2>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-400">Telkom University</h3>
                  <span className="text-slate-400 text-sm mt-2 md:mt-0 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">July 2023 - Present</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-300 mb-2">Faculty of Applied Sciences | D3 Computer Technology</h4>
                <ul className="list-disc list-inside text-slate-400 space-y-2 mt-4 marker:text-blue-500">
                  <li>Participated in community service program on IoT training for teachers at SMK Nasional Bandung</li>
                  <li>Participated in training and implementation of LoRa-based automatic irrigation systems</li>
                  <li>Participated in ADTS training at SMKN 12 Bandung</li>
                </ul>
              </div>

              <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-400">SMK Telkom Malang</h3>
                  <span className="text-slate-400 text-sm mt-2 md:mt-0 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">July 2020 - May 2023</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-300 mb-2">Software Engineering</h4>
                <ul className="list-disc list-inside text-slate-400 space-y-2 mt-4 marker:text-blue-500">
                  <li>Member of MPK Organization and METIC Sub-Organization</li>
                  <li>Participated in Utter Academy (Flutter) and DigiUp Telkom (Graphic Design)</li>
                  <li>Learned Android apps development and web development</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-slate-800/30 border-y border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4 text-center">Experience & Projects</h2>
            <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              A showcase of my recent internship experiences and academic projects.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map(project => (
                <div key={project.id} className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all group hover:bg-slate-800">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-blue-400">{project.title}</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-6">{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center group-hover:underline">
                      View Details &rarr;
                    </a>
                  )}
                  {project.links && (
                    <div className="flex flex-col gap-2 mt-2">
                      {project.links.map((linkItem, idx) => (
                        <a key={idx} href={linkItem.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center hover:underline">
                          View {linkItem.name} &rarr;
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills & Certificates Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-8">Technical Skills</h2>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {['React', 'Node.js', 'REST API', 'JavaScript', 'HTML/CSS', 'MySQL', 'PHP', 'Figma', 'Android Studio', 'Java', 'IoT Implementation'].map(skill => (
                  <span key={skill} className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-full text-slate-300 font-medium hover:border-blue-500 hover:text-blue-400 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-8">Soft Skills</h2>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {['Teamwork', 'Communication Skills', 'Teaching Ability', 'Problem Solving', 'Adaptability', 'Creativity', 'Initiative', 'Responsibility', 'Willingness to Learn', 'Work Ethic'].map(skill => (
                  <span key={skill} className="px-6 py-3 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400 font-medium hover:border-blue-500/50 hover:text-blue-300 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold mb-8">Certificates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
                {[
                  'Google UX Design',
                  'Google Data Analysis with Python',
                  'Google AI',
                  'Junior Network Administrator BNSP',
                  'IC3 GS6 Level 1',
                  'Microsoft Certified: Azure AI Fundamentals',
                  'DOT Certificate of Competency Android'
                ].map((cert, idx) => (
                  <div key={idx} className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 flex items-start gap-4 hover:border-blue-500/50 transition-colors">
                    <svg className="w-6 h-6 text-blue-400 shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                    <span className="text-slate-300 font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-slate-800/30 border-t border-slate-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
            <p className="text-lg text-slate-400 mb-10">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
              <a href="mailto:kezhiarce@gmail.com" className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors bg-slate-800 px-6 py-4 rounded-xl border border-slate-700 w-full md:w-auto">
                <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                kezhiarce@gmail.com
              </a>

              <a href="https://wa.me/6285150699415" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors bg-slate-800 px-6 py-4 rounded-xl border border-slate-700 w-full md:w-auto">
                <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                +62851-5069-9415
              </a>
            </div>

            <div className="flex justify-center gap-6">
              <a href="https://www.linkedin.com/in/kezhiarce/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href="https://github.com/Kezhiareyva" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-500 border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} Kezhia Reyva Cahya Erliyana. Built with React & Tailwind.</p>
      </footer>
    </div>
  )
}

export default App
