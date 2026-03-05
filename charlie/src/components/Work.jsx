import React from 'react'

const projects = [
  {
    title: 'Pterodactyl MCTools',
    date: '2025-12-28',
    description: "Browse, search, and install Minecraft mods, modpacks, plugins, and resource packs directly from your Pterodactyl panel using Modrinth and CurseForge APIs.",
    role: 'Pterodactyl Addon',
    href: 'https://github.com/probablysubeditor69204/pterodactyl-mctools'
  },
  {
    title: 'Horizon AI',
    date: '2025',
    description: 'A comprehensive AI suite leveraging Gemini for image generation, code assistance, and intelligent natural language processing.',
    role: 'Creator',
    href: 'https://builtbybit.com/resources/horizon-ai.77505/',
    coauthor: 'Made by me & 3c18x'
  },
  {
    title: 'Axalotol',
    date: '2025',
    description: 'A web application featuring unique design aesthetics and fluid user interactions.',
    role: 'Frontend',
    href: 'https://axalotol.vercel.app/'
  },
  {
    title: 'Minecraft World Manager',
    date: '2025',
    description: 'A Pterodactyl panel addon that streamlines server management by installing Minecraft worlds directly from the dashboard.',
    role: 'Plugin Dev',
    href: 'https://builtbybit.com/resources/minecraft-world-manager-pterodactyl.82318/'
  },
  {
    title: 'Streemix',
    date: '2025',
    description: 'A free streaming platform for movies and web series with a modern UI. (Archived due to funding constraints).',
    role: 'Full Stack',
    href: 'https://streemix-v1.vercel.app/'
  }
]

const writings = [
  { title: 'Summer Hosting', date: 'July 2025', href: '/blog/summer-hosting' },
  { title: 'Why Pterodactyl Rules the Game Hosting World', date: 'Nov 2025', href: '/blog/pterodactyl-deep-dive' },
  { title: 'My Experience in the Hosting Industry', date: 'Nov 2025', href: '/blog/hosting' },
  { title: 'On Craftsmanship', date: 'Oct 2025', href: '/blog/craftsmanship' },
  { title: 'The End of Localhost', date: 'Aug 2025', href: '/blog/localhost' }
]

const experience = [
  {
    title: 'Admin',
    company: 'Mcsets',
    period: '2025 — 2026'
  },
  {
    title: 'Developer',
    company: 'SkyRain',
    period: '2024 — 2026'
  }
]

export default function Work() {
  return (
    <section id="work" className="mt-16">
      {/* Experience */}
      <div className="space-y-8 mb-16">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">Experience</h2>
        </div>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.company} className="flex items-baseline justify-between py-2">
              <div>
                <h3 className="text-gray-900 font-medium text-base">{exp.title}</h3>
                <p className="text-gray-600 text-sm">{exp.company}</p>
              </div>
              <span className="text-gray-500 text-sm font-mono">{exp.period}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Work */}
      <div className="space-y-8 mb-16">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">Selected Work</h2>
        </div>
        <div className="grid gap-2">
          {projects.map((project) => (
            <div key={project.title}>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 -mx-4 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-gray-900 font-medium text-lg tracking-tight group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-gray-500 text-sm font-mono">{project.date}</span>
                </div>
                <p className="text-gray-600 text-base leading-relaxed mb-2">
                  {project.description}
                </p>
                {project.coauthor && (
                  <p className="text-gray-500 text-xs mb-3 italic">{project.coauthor}</p>
                )}
                <div className="flex items-center text-gray-500 text-xs font-medium uppercase tracking-wider">
                  <span>{project.role}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3 ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-blue-600"
                    aria-hidden="true"
                  >
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Writing */}
      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">Writing</h2>
        </div>
        <div className="space-y-2">
          {writings.map((post) => (
            <div key={post.title}>
              <a
                className="w-full text-left group flex flex-col sm:flex-row sm:items-baseline justify-between py-3 -mx-2 px-2 hover:bg-gray-100 rounded-lg transition-colors"
                href={post.href}
              >
                <h3 className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <span className="text-gray-500 text-sm font-mono mt-1 sm:mt-0">{post.date}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
