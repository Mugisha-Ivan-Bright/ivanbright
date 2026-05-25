import { C, G, P } from './terminalColors.js'

export const FS = {
  '~': {
    type: 'dir',
    children: ['about', 'projects', 'skills', 'contact', 'beliefs', 'growth'],
    hidden: ['.hidden'],
  },

  '~/about': {
    type: 'dir',
    children: ['story.txt', 'faith.txt', 'family.txt', 'dream.txt'],
  },

  '~/about/story.txt': {
    type: 'file',
    content: [
      G('I prayed every day to get into Rwanda Coding Academy.', C.white),
      G('', C.bg),
      G('I saw one student from my school get admitted.', C.white),
      G('I made it my mission.', C.white),
      G('', C.bg),
      P([G('family:    ', C.amber), G('father = carpenter · mother = farmer · 5 children', C.white)]),
      P([G('english:   ', C.amber), G('nearly zero when I arrived', C.muted)]),
      P([G('pc:        ', C.amber), G('never owned one before RCA', C.muted)]),
      G('', C.bg),
      G('Then the admission came.', C.white),
      G('It felt like a miracle. Because it was.', C.green, { bold: true }),
      G('', C.bg),
      G('In Year 1, everyone said: this man does not talk.', C.muted),
      G('I was quiet because I was afraid.', C.muted),
      G('Not because I had nothing to say.', C.muted),
      G('', C.bg),
      G('Year 2 changed everything.', C.white),
      G('I started speaking. My confidence grew.', C.white),
      G('I stopped looking down on myself.', C.white),
      G('', C.bg),
      G('Now I build real systems. I lead a community.', C.green),
      G('And I am going to MIT or Stanford.', C.green, { bold: true }),
      G('I have said it out loud. I still mean it.', C.green, { bold: true }),
    ],
  },

  '~/about/faith.txt': {
    type: 'file',
    content: [
      G('Jesus Christ is the foundation of everything', C.white),
      G('I have built and everything I am.', C.white),
      G('', C.bg),
      G('Not performance. Not branding. Reality.', C.green, { bold: true }),
      G('', C.bg),
      G('I do not talk about this to impress anyone.', C.muted),
      G('I talk about it because it is true.', C.muted),
    ],
  },

  '~/about/family.txt': {
    type: 'file',
    content: [
      P([G('father:    ', C.amber), G('carpenter', C.white)]),
      P([G('mother:    ', C.amber), G('farmer', C.white)]),
      P([G('siblings:  ', C.amber), G('4  (I am the oldest)', C.white)]),
      P([G('home:      ', C.amber), G('Gatsibo · Kiramuruzi · Akabingo · Rwanda', C.green)]),
      G('', C.bg),
      G('I did not come from money or connections.', C.muted),
      G('I came from people who worked hard every day.', C.muted),
      G('That is where I learned what effort looks like.', C.white),
    ],
  },

  '~/about/dream.txt': {
    type: 'file',
    content: [
      P([G('target:    ', C.amber), G('MIT or Stanford', C.green, { bold: true })]),
      P([G('timeline:  ', C.amber), G('2027+', C.white)]),
      P([G('status:    ', C.amber), G('working toward it every day', C.white)]),
      G('', C.bg),
      G('People laughed when I said it.', C.muted),
      G('I still mean it.', C.white),
      G('', C.bg),
      G('"Kwizera kwacu kurarema."', C.green, { bold: true }),
      G('(Our faith creates reality.)', C.muted, { italic: true }),
    ],
  },

  '~/projects': {
    type: 'dir',
    children: [
      'uptime', 'medisafe', 'academix',
      'automailio', 'furnit', 'lumen',
      'igihango', 'rfid', 'market-truth',
      'enrollia', 'more',
    ],
  },

  '~/projects/uptime': {
    type: 'dir',
    children: ['README.md', 'architecture.txt', 'why.txt'],
  },

  '~/projects/uptime/README.md': {
    type: 'file',
    content: [
      G('# Uptime & Status Page SaaS', C.white, { bold: true }),
      G('', C.bg),
      G('A production-grade monitoring platform.', C.white),
      G('Watches websites 24/7 from multiple regions worldwide.', C.white),
      G('Detects real outages using multi-region consensus.', C.white),
      G('Notifies teams via Slack, Email, or PagerDuty.', C.white),
      G('Gives every company a public status page.', C.white),
      G('', C.bg),
      P([G('status:  ', C.amber), G('in progress', C.amber)]),
      P([G('stack:   ', C.amber), G('TypeScript · Node.js · PostgreSQL · React · Docker', C.green)]),
      G('', C.bg),
      G('This is the most serious thing I have ever built.', C.white),
      G('I do not know if it will succeed.', C.muted),
      G('But I know it is real.', C.green, { bold: true }),
    ],
  },

  '~/projects/uptime/architecture.txt': {
    type: 'file',
    content: [
      G('$ uptime --architecture', C.amber),
      G('', C.bg),
      P([G('monitoring workers    ', C.muted), G('poll endpoints every 30–60s', C.green)]),
      P([G('multi-region nodes    ', C.muted), G('consensus required for outage', C.green)]),
      P([G('alert dispatcher      ', C.muted), G('Slack · Email · PagerDuty', C.green)]),
      P([G('status page engine    ', C.muted), G('public · live · 90-day history', C.green)]),
      P([G('billing layer         ', C.muted), G('subscription plans · multi-tenant', C.green)]),
      P([G('tenant isolation      ', C.muted), G('each company fully separated', C.green)]),
    ],
  },

  '~/projects/uptime/why.txt': {
    type: 'file',
    content: [
      G('The first version raised false alarms.', C.white),
      G('', C.bg),
      G('A single node would see a timeout — maybe a DNS hiccup —', C.muted),
      G('and immediately fire an alert.', C.muted),
      G('Teams got paged at 3am for something that resolved in 4 seconds.', C.muted),
      G('', C.bg),
      G('Multi-region consensus fixed this.', C.white),
      G('If my node in Africa sees failure but Europe and Asia don\'t —', C.white),
      G('that is my problem, not yours.', C.white),
      G('Only when the majority agree: then we alert.', C.green, { bold: true }),
      G('', C.bg),
      G('Reliability engineering is not about detecting failures.', C.white),
      G('It is about distinguishing real failures from noise.', C.green, { bold: true }),
    ],
  },

  '~/projects/medisafe': {
    type: 'dir',
    children: ['README.md', 'why.txt'],
  },

  '~/projects/medisafe/README.md': {
    type: 'file',
    content: [
      G('# MediSafe', C.white, { bold: true }),
      G('', C.bg),
      G('An AI-powered medication management assistant.', C.white),
      G('Built for patients living with chronic illness.', C.white),
      P([G('status:  ', C.amber), G('shipped', C.green)]),
      P([G('stack:   ', C.amber), G('TypeScript · AI/NLP · React', C.green)]),
      P([G('github:  ', C.amber), G('github.com/codewithmugisha/MediSafe', C.blue)]),
    ],
  },

  '~/projects/medisafe/why.txt': {
    type: 'file',
    content: [
      G('When software is wrong in most domains, you lose data.', C.white),
      G('When medication software is wrong, someone could be harmed.', C.white),
      G('', C.bg),
      G('That responsibility shaped every decision.', C.muted),
      G('How I handled user input.', C.muted),
      G('How I kept the AI within safe boundaries.', C.muted),
      G('', C.bg),
      G('Building for healthcare taught me:', C.white),
      G('engineering is ethics.', C.green, { bold: true }),
    ],
  },

  '~/projects/academix': {
    type: 'dir',
    children: ['README.md', 'architecture.txt'],
  },

  '~/projects/academix/README.md': {
    type: 'file',
    content: [
      G('# Academix', C.white, { bold: true }),
      G('', C.bg),
      G('A full microservices school management system.', C.white),
      P([G('status:  ', C.amber), G('shipped', C.green)]),
      P([G('stack:   ', C.amber), G('TypeScript · Microservices · REST APIs', C.green)]),
      P([G('github:  ', C.amber), G('github.com/codewithmugisha/Academix', C.blue)]),
    ],
  },

  '~/projects/academix/architecture.txt': {
    type: 'file',
    content: [
      G('I chose microservices because the domain had', C.white),
      G('independent bounded contexts — students, records,', C.white),
      G('and administration each change at different rates.', C.white),
      G('', C.bg),
      G('What I did not expect: how quickly distributed systems', C.muted),
      G('introduce real complexity. Authentication across services,', C.muted),
      G('shared data boundaries, debugging across processes.', C.muted),
      G('', C.bg),
      G('These became engineering problems. Not tutorial problems.', C.green, { bold: true }),
      G('That is when I understood the difference.', C.white),
    ],
  },

  '~/projects/automailio': {
    type: 'dir',
    children: ['README.md'],
  },

  '~/projects/automailio/README.md': {
    type: 'file',
    content: [
      G('# Automailio', C.white, { bold: true }),
      G('', C.bg),
      G('A full-stack email automation platform.', C.white),
      G('Campaigns, templates, scheduling, delivery logs.', C.white),
      P([G('stack:   ', C.amber), G('Java · Spring Boot · Quartz · PostgreSQL · React · Docker', C.green)]),
      P([G('status:  ', C.amber), G('in progress', C.amber)]),
      G('', C.bg),
      G('Spring Boot with Java is not what most RCA students touch.', C.muted),
      G('I went there anyway.', C.white),
      G('This one taught me that building for reliability', C.white),
      G('is a completely different challenge than building for functionality.', C.green, { bold: true }),
    ],
  },

  '~/projects/furnit': {
    type: 'dir',
    children: ['README.md'],
  },

  '~/projects/furnit/README.md': {
    type: 'file',
    content: [
      G('# Furnit', C.white, { bold: true }),
      G('', C.bg),
      G('A furniture web experience.', C.white),
      P([G('stack:   ', C.amber), G('JavaScript · React · CSS', C.green)]),
      P([G('stars:   ', C.amber), G('2', C.white)]),
      P([G('live:    ', C.amber), G('furnit-kappa.vercel.app', C.blue)]),
      G('', C.bg),
      G('The first project where I genuinely cared about', C.muted),
      G('how it looked — not just whether it worked.', C.white),
    ],
  },

  '~/projects/more': {
    type: 'dir',
    children: ['list.txt'],
  },

  '~/projects/more/list.txt': {
    type: 'file',
    content: [
      G('lumen          full-stack TypeScript · 2 stars · deployed', C.white),
      G('igihango       digital contracts · Rwanda-first · JS + Python', C.white),
      G('rfid           RFID web system · hardware meets software', C.white),
      G('market-truth   market data tool · someone forked it', C.white),
      G('enrollia       enrollment dashboard · Supabase · SQL', C.white),
      G('', C.bg),
      G('+ 31 more across two GitHub accounts.', C.muted),
      G('some finished. some broken. all real.', C.muted),
      G('', C.bg),
      P([G('github:   ', C.amber), G('github.com/Mugisha-Ivan-Bright', C.blue)]),
      P([G('github:   ', C.amber), G('github.com/codewithmugisha', C.blue)]),
    ],
  },

  '~/skills': {
    type: 'dir',
    children: ['languages.txt', 'tools.txt', 'learning.txt'],
  },

  '~/skills/languages.txt': {
    type: 'file',
    content: [
      P([G('primary:    ', C.amber), G('TypeScript · JavaScript', C.green, { bold: true })]),
      P([G('backend:    ', C.amber), G('Python · Java (Spring Boot)', C.green)]),
      P([G('systems:    ', C.amber), G('C++  (Bluetooth, servo control)', C.green)]),
      P([G('database:   ', C.amber), G('SQL · PLpgSQL', C.green)]),
      P([G('web:        ', C.amber), G('HTML · CSS', C.green)]),
      P([G('early:      ', C.amber), G('PHP  (moved on)', C.dim)]),
      G('', C.bg),
      G('Every language listed here appears in a real repo.', C.muted),
      G('That is the only standard I hold myself to.', C.white),
    ],
  },

  '~/skills/tools.txt': {
    type: 'file',
    content: [
      P([G('frontend:   ', C.amber), G('React · Vite · Tailwind · Refine · Ant Design', C.green)]),
      P([G('backend:    ', C.amber), G('Node.js · Spring Boot · REST APIs · Quartz · Flyway', C.green)]),
      P([G('database:   ', C.amber), G('PostgreSQL · Supabase', C.green)]),
      P([G('infra:      ', C.amber), G('Docker · docker-compose · Vercel', C.green)]),
      P([G('ai:         ', C.amber), G('OpenAI API · NLP integration', C.green)]),
      P([G('hardware:   ', C.amber), G('RFID · Bluetooth C++ · servo control', C.green)]),
      P([G('workflow:   ', C.amber), G('Git · GitHub · VS Code · OpenCode', C.green)]),
    ],
  },

  '~/skills/learning.txt': {
    type: 'file',
    content: [
      G('Things I am actively studying right now.', C.muted),
      G('Not resume padding. Honest.', C.muted),
      G('', C.bg),
      P([G('→ ', C.amber), G('C  (systems programming)', C.white)]),
      P([G('→ ', C.amber), G('distributed systems design', C.white)]),
      P([G('→ ', C.amber), G('infrastructure engineering', C.white)]),
      P([G('→ ', C.amber), G('multi-region consensus (building it in Uptime)', C.white)]),
    ],
  },

  '~/contact': {
    type: 'dir',
    children: ['email.txt', 'phone.txt', 'github.txt', 'location.txt'],
  },

  '~/contact/email.txt': {
    type: 'file',
    content: [
      P([G('email:     ', C.amber), G('mugishaivanbright250@gmail.com', C.green, { bold: true })]),
      G('', C.bg),
      G('open to:', C.muted),
      P([G('→ ', C.amber), G('part-time work', C.white)]),
      P([G('→ ', C.amber), G('collaboration', C.white)]),
      P([G('→ ', C.amber), G('sponsorship', C.white)]),
      P([G('→ ', C.amber), G('mentorship', C.white)]),
      P([G('→ ', C.amber), G('anything meaningful', C.white)]),
    ],
  },

  '~/contact/phone.txt': {
    type: 'file',
    content: [
      P([G('phone:     ', C.amber), G('+250 735 024 932', C.green, { bold: true })]),
      P([G('timezone:  ', C.amber), G('Rwanda (EAT, UTC+3)', C.white)]),
    ],
  },

  '~/contact/github.txt': {
    type: 'file',
    content: [
      P([G('account 1: ', C.amber), G('github.com/Mugisha-Ivan-Bright', C.blue)]),
      P([G('account 2: ', C.amber), G('github.com/codewithmugisha', C.blue)]),
      G('', C.bg),
      G('run "github" or "github2" to open in browser', C.muted),
    ],
  },

  '~/contact/location.txt': {
    type: 'file',
    content: [
      P([G('home:      ', C.amber), G('Rwanda · Gatsibo · Kiramuruzi · Akabingo', C.green)]),
      P([G('current:   ', C.amber), G('Rwanda Coding Academy · Kigali', C.green)]),
      P([G('timezone:  ', C.amber), G('East Africa · UTC+3', C.white)]),
    ],
  },

  '~/beliefs': {
    type: 'dir',
    children: ['faith.txt', 'honesty.txt', 'hardwork.txt', 'people.txt'],
  },

  '~/beliefs/faith.txt': {
    type: 'file',
    content: [
      G('Jesus Christ is the foundation of everything I am.', C.white),
      G('Not performance. Not branding. Reality.', C.green, { bold: true }),
    ],
  },

  '~/beliefs/honesty.txt': {
    type: 'file',
    content: [
      G('This portfolio only contains things I have actually done.', C.white),
      G('I would rather show you less and mean it,', C.white),
      G('than show you more and fake it.', C.green, { bold: true }),
    ],
  },

  '~/beliefs/hardwork.txt': {
    type: 'file',
    content: [
      G('I came from nothing on paper.', C.white),
      G('No PC. No English. No connections.', C.muted),
      G('What I had was effort and prayer.', C.white),
      G('It was enough to get me here.', C.green, { bold: true }),
      G('It will be enough to take me further.', C.green, { bold: true }),
    ],
  },

  '~/beliefs/people.txt': {
    type: 'file',
    content: [
      G('Code is a tool.', C.white),
      G('The goal is always people.', C.green, { bold: true }),
      G('I build software the way I lead community:', C.muted),
      G('not for the recognition, but for the impact.', C.white),
    ],
  },

  '~/growth': {
    type: 'dir',
    children: ['journal.txt'],
  },

  '~/growth/journal.txt': {
    type: 'file',
    content: [
      G('Aug 2023  admitted to RCA · first PC · everything new', C.white),
      G('Nov 2023  built PHP-CALC · my first real project', C.white),
      G('Feb 2024  JavaScript started making sense', C.white),
      G('Feb 2024  three chat apps · all broke · architecture wrong', C.red),
      G('Mar 2024  first deployed project · URL worked on someone else\'s phone', C.green),
      G('May 2024  started TypeScript · types changed everything', C.white),
      G('Aug 2024  Year 2 · everything changed · found my voice', C.green, { bold: true }),
      G('Sep 2024  appointed Head of Community Outreach · RCA', C.green, { bold: true }),
      G('Jan 2025  shipped MARKET-TRUTH · someone forked it', C.white),
      G('Feb 2025  built RFID system · hardware meets software', C.white),
      G('Feb 2025  wrote C++ for Bluetooth · curiosity, not syllabus', C.white),
      G('Mar 2025  started Java seriously · Spring Boot · heavy', C.white),
      G('Apr 2025  built Igihango · Rwanda-first thinking', C.white),
      G('May 2025  shipped Furnit · first project I cared about visually', C.white),
      G('Mar 2026  shipped Lumen · frontend + backend · 2 stars', C.white),
      G('Mar 2026  Automailio · Spring Boot · Docker · most complete yet', C.white),
      G('Apr 2026  Uptime v1 · raised false alarms · scrapped it', C.red),
      G('May 2026  Uptime v2 · multi-region consensus · the real thing', C.green, { bold: true }),
      G('', C.bg),
      G('Not optimized for activity.', C.muted),
      G('Optimized for understanding.', C.green, { bold: true }),
    ],
  },

  '~/.hidden': {
    type: 'dir',
    hidden: true,
    children: ['mit-dream.txt', 'message.txt'],
  },

  '~/.hidden/mit-dream.txt': {
    type: 'file',
    content: [
      G('This is the dream I say out loud even when people laugh.', C.white),
      G('', C.bg),
      G('MIT or Stanford.', C.green, { bold: true }),
      G('Research in distributed systems and AI', C.white),
      G('for low-resource, high-need environments.', C.white),
      G('Like the one I grew up in.', C.muted),
      G('', C.bg),
      G('I am a Year 2 student at Rwanda Coding Academy.', C.muted),
      G('I have never left Rwanda.', C.muted),
      G('I have never had a mentor at a big tech company.', C.muted),
      G('I have never owned a PC before 2023.', C.muted),
      G('', C.bg),
      G('And I still believe it will happen.', C.green, { bold: true }),
      G('', C.bg),
      G('Because faith is not the absence of doubt.', C.green),
      G('It is choosing to build anyway.', C.green, { bold: true }),
    ],
  },

  '~/.hidden/message.txt': {
    type: 'file',
    content: [
      G('If you are reading this, you are a developer.', C.white),
      G('You typed the commands. You found the hidden folder.', C.white),
      G('You went further than most people do.', C.white),
      G('', C.bg),
      G('That means something.', C.green, { bold: true }),
      G('', C.bg),
      G('If you are building something meaningful —', C.muted),
      G('something difficult, something human-centered —', C.muted),
      G('I would genuinely love to hear about it.', C.white),
      G('', C.bg),
      P([G('email:  ', C.amber), G('mugishaivanbright250@gmail.com', C.green, { bold: true })]),
      P([G('phone:  ', C.amber), G('+250 735 024 932', C.green, { bold: true })]),
      G('', C.bg),
      G('— Mugisha Ivan Bright', C.amber, { bold: true }),
    ],
  },
}

export function getDirEntry(path) {
  const n = path === '~' ? '~' : path.replace(/\/$/, '')
  const entry = FS[n]
  if (!entry) {
    const parent = n.substring(0, n.lastIndexOf('/'))
    const name = n.substring(n.lastIndexOf('/') + 1)
    const parentEntry = FS[parent]
    if (parentEntry?.children?.includes(name) || parentEntry?.hidden?.includes(name)) {
      return null
    }
    return null
  }
  return entry
}

export function getFileContent(fp) {
  const key = fp.startsWith('~') ? fp : `~${fp.startsWith('/') ? '' : '/'}${fp}`
  const entry = FS[key]
  if (!entry || entry.type !== 'file') return null
  return entry.content
}

export function getDirChildren(cwd, showHidden = false) {
  const entry = getDirEntry(cwd)
  if (!entry || entry.type !== 'dir') return null
  const all = [...(entry.children || [])]
  if (showHidden && entry.hidden) {
    all.push(...entry.hidden)
  }
  return all
}

export function isHiddenDir(path) {
  const entry = FS[path]
  return entry?.hidden === true
}

export function resolvePath(cwd, target) {
  if (!target || target === '~') return '~'
  if (target === '..') {
    if (cwd === '~') return '~'
    const parts = cwd.replace(/^~\//, '').split('/').filter(Boolean)
    parts.pop()
    return '~' + (parts.length > 0 ? '/' + parts.join('/') : '')
  }
  if (target.startsWith('~')) return target
  if (target === '.') return cwd
  const parts = cwd === '~' ? [] : cwd.replace(/^~\//, '').split('/').filter(Boolean)
  for (const p of target.split('/').filter(Boolean)) {
    if (p === '..') { if (parts.length > 0) parts.pop() }
    else if (p === '.') {}
    else parts.push(p)
  }
  return '~' + (parts.length > 0 ? '/' + parts.join('/') : '')
}
