/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './js/*.js',
    './admin/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#223D22',
        plum: '#281936',
        chartreuse: '#DCD870',
        gold: '#ECAB45',
        sage: '#C9D3B5',
        ivory: '#F8F7F0',
        charcoal: '#1F251F',
        'stats-bg': '#E5EBD9',
        muted: '#667066',
        line: '#DDE2D8',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.5rem',
        'pill': '9999px',
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
  safelist: [
    // Classes xuất hiện động trong JS hoặc edge cases
    // NOTE: text-[color:var(--charcoal)]/xx KHÔNG được Tailwind hỗ trợ (opacity modifier với arbitrary var())
    // Trên CDN cũ các class này cũng KHÔNG generate → text hiển thị charcoal 100% (kế thừa body)
    // → giữ nguyên hành vi: generate color: var(--charcoal) đặc
    {
      pattern: /text-\[color:var\(--charcoal\)\]\/\d+/
    },
    'text-[color:var(--charcoal)]/70',
    'text-[color:var(--plum)]',
    'text-[color:var(--forest)]',
    'text-[color:var(--gold)]',
    'line-clamp-3',
  ],
}
