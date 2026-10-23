import type { Palette, PixelGrid } from './PixelArt'

// Player sprite: cream hijab, maroon blazer.
export const playerPalette: Palette = {
  h: '#f3e6c8',
  H: '#d6c294',
  s: '#f2c39b',
  e: '#24123d',
  p: '#f28b9b',
  r: '#c2414f',
  m: '#8a1c3b',
  M: '#5e1029',
  w: '#ffffff',
  k: '#2b1d47',
  K: '#120a20',
}

const playerTop = [
  '......hhhh......',
  '....hhhhhhhh....',
  '...hhhhhhhhhh...',
  '..hhhsssssshhh..',
  '..hhsssssssshh..',
  '..hhsesssseshh..',
  '..hhspsssspshh..',
  '..hhsssrrssshh..',
  '..hhhsssssshhh..',
  '.Hhhhhhhhhhhhhh.',
  '.HHhhhhhhhhhhHH.',
  '..mmmhhhhhhmmm..',
  '.mmmmmwwwwmmmmm.',
  '.mmmmmwwwwmmmmm.',
  '.ssmmmmwwmmmmss.',
  '..mmmmmmmmmmmm..',
  '..MMMMMMMMMMMM..',
] as const

export const playerIdle: PixelGrid = [
  ...playerTop,
  '...kkkk..kkkk...',
  '...kkkk..kkkk...',
  '..KKKKK..KKKKK..',
]

export const playerRunA: PixelGrid = [
  ...playerTop,
  '..kkkk....kkk...',
  '.kkkk......kkk..',
  'KKKK.......KKKK.',
]

export const playerRunB: PixelGrid = [
  ...playerTop,
  '....kkkkkkk.....',
  '.....kkkkk......',
  '....KKKKKKK.....',
]

const ui = (accent: string): Palette => ({
  o: 'var(--edge)',
  w: 'var(--panel)',
  a: accent,
  c: 'var(--coin)',
  C: 'var(--coin-dark)',
  b: 'var(--mint)',
  g: '#9aa3c7',
  e: 'var(--mint)',
  d: '#2b1d47',
  m: '#3ddc84',
  r: 'var(--accent)',
  f: 'var(--coin)',
})

export const iconPalette = ui('var(--accent)')

export const icons: Record<string, PixelGrid> = {
  gauge: [
    '....oooo....',
    '..oowwwwoo..',
    '.owwwwwwwwo.',
    '.owwwwwwaao.',
    'owwwwwwaawwo',
    'owwwwwaawwwo',
    'owwwwccwwwwo',
    'owwwwccwwwwo',
    '.owwwwwwwwo.',
    '.owwwwwwwwo.',
    '..oowwwwoo..',
    '....oooo....',
  ],
  database: [
    '..oooooooo..',
    '.obbbbbbbbo.',
    '.oooooooooo.',
    '.obbbbbbbbo.',
    '.obbbbbbbbo.',
    '.oooooooooo.',
    '.obbbbbbbbo.',
    '.obbbbbbbbo.',
    '.oooooooooo.',
    '.obbbbbbbbo.',
    '..oooooooo..',
    '............',
  ],
  parking: [
    'oooooooooooo',
    'oaaaaaaaaaao',
    'oaawwwwwaaao',
    'oaawwaawwaao',
    'oaawwaawwaao',
    'oaawwwwwaaao',
    'oaawwaaaaaao',
    'oaawwaaaaaao',
    'oaawwaaaaaao',
    'oaaaaaaaaaao',
    'oooooooooooo',
    '.....oo.....',
  ],
  robot: [
    '.....aa.....',
    '.....oo.....',
    '..oooooooo..',
    '..oggggggo..',
    '..ogeggego..',
    '..oggggggo..',
    '..ogoooogo..',
    '..oooooooo..',
    '.oggggggggo.',
    '.oggoggoggo.',
    '.oooooooooo.',
    '..oo....oo..',
  ],
  phone: [
    '...oooooo...',
    '..oddddddo..',
    '..odmmmmdo..',
    '..omwmmwmo..',
    '..odmmmmdo..',
    '..oddddddo..',
    '..odmmmmdo..',
    '..odmmmmdo..',
    '..oddddddo..',
    '..oddwwddo..',
    '...oooooo...',
    '............',
  ],
  school: [
    '.....of.....',
    '.....offf...',
    '.....o......',
    '....rrrr....',
    '..rrrrrrrr..',
    '.rrrrrrrrrr.',
    '.owwwwwwwwo.',
    '.owdwwwwdwo.',
    '.owwwwwwwwo.',
    '.owdwddwdwo.',
    '.owwwddwwwo.',
    'oooooooooooo',
  ],
  star: [
    '.....oo.....',
    '....occo....',
    '....occo....',
    'oooooccooooo',
    'occcccccccco',
    '.occcccccco.',
    '..occcccco..',
    '..occcccco..',
    '.occcooccco.',
    '.occo..occo.',
    'ooo......ooo',
    '............',
  ],
}

export const trophy: PixelGrid = [
  'oooooooooooo',
  'ocCccccccCco',
  'occcccccccco',
  '.occcccccco.',
  '.occcccccco.',
  '..occcccco..',
  '...occcco...',
  '....occo....',
  '.....oo.....',
  '....occo....',
  '...occcco...',
  '..oooooooo..',
]

export const coin: PixelGrid = [
  '..oooo..',
  '.occcco.',
  'ocwcccco',
  'ocwcccco',
  'occcccco',
  'occcccco',
  '.occcco.',
  '..oooo..',
]

export const coinPalette: Palette = {
  o: 'var(--coin-dark)',
  c: 'var(--coin)',
  w: '#fff6c9',
}

export const sun: PixelGrid = [
  '....c....',
  '.c.....c.',
  '...ccc...',
  '..ccccc..',
  'c.ccccc.c',
  '..ccccc..',
  '...ccc...',
  '.c.....c.',
  '....c....',
]

export const moon: PixelGrid = [
  '...ccc...',
  '..cc.....',
  '.cc......',
  '.cc......',
  '.cc......',
  '.cc......',
  '..cc...c.',
  '...cccc..',
  '.........',
]

export const speakerOn: PixelGrid = [
  '...i.....',
  '..ii..i..',
  'iiii...i.',
  'iiii.i.i.',
  'iiii.i.i.',
  'iiii...i.',
  '..ii..i..',
  '...i.....',
  '.........',
]

export const speakerOff: PixelGrid = [
  '...i.....',
  '..ii.....',
  'iiii.i.i.',
  'iiii..i..',
  'iiii.i.i.',
  'iiii.....',
  '..ii.....',
  '...i.....',
  '.........',
]

export const pauseIcon: PixelGrid = [
  '.........',
  '.ii...ii.',
  '.ii...ii.',
  '.ii...ii.',
  '.ii...ii.',
  '.ii...ii.',
  '.ii...ii.',
  '.ii...ii.',
  '.........',
]

export const playIcon: PixelGrid = [
  '.........',
  '.ii......',
  '.iiii....',
  '.iiiiii..',
  '.iiiiiii.',
  '.iiiiii..',
  '.iiii....',
  '.ii......',
  '.........',
]

export const campfire: PixelGrid = [
  '.......y........',
  '......yy........',
  '......yry.......',
  '.....yrry.y.....',
  '.....yrrryy.....',
  '....yrrcrrry....',
  '....yrccccry....',
  '...yrrccccrry...',
  '...yrccccccry...',
  '....yrccccry....',
  '..bbbbbbbbbbbb..',
  '.bbBBbbbbbbBBbb.',
  '..bbbbbbbbbbbb..',
]

export const campfirePalette: Palette = {
  y: '#ffd54a',
  r: '#ff5c3a',
  c: '#fff1a8',
  b: '#8b4a2b',
  B: '#5c2d18',
}

export const cloud: PixelGrid = [
  '......wwww......',
  '....wwwwwwww....',
  '..wwwwwwwwwwwww.',
  '.wwwwwwwwwwwwwww',
  'wwwwwwwwwwwwwwww',
  '.wwwwwwwwwwwwww.',
]

export const cloudPalette: Palette = { w: 'var(--cloud)' }

export function iconForProject(slug: string) {
  if (slug.includes('altimeter') || slug.includes('dashboard')) return icons.gauge
  if (slug.includes('database') || slug.includes('laundry')) return icons.database
  if (slug.includes('parking') || slug.includes('rfid')) return icons.parking
  if (slug.includes('robot') || slug.includes('follower')) return icons.robot
  if (slug.includes('spp') || slug.includes('school')) return icons.school
  if (slug.includes('android') || slug.includes('app')) return icons.phone
  return icons.star
}
