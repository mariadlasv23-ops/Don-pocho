const BANNED_WORDS = [
  'idiota',
  'estupido',
  'estúpido',
  'imbecil',
  'imbécil',
  'tonto',
  'basura',
  'mierda',
  'porqueria',
  'porquería',
  'asco',
  'asqueroso',
  'asquerosa',
  'maldito',
  'maldita',
  'puto',
  'puta',
  'carajo',
  'mierd',
  'pendejo',
  'pendeja',
  'huevon',
  'huevón',
  'weon',
  'webon',
  'conchatumare',
  'ctm',
  'verga',
  'estafa',
  'ladron',
  'ladrón',
  'horrible',
  'incomible',
  'vomito',
  'vómito',
];

export function containsProfanity(text: string): boolean {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return BANNED_WORDS.some((word) => {
    const cleanWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const regex = new RegExp(`\\b${cleanWord}\\b|${cleanWord}`, 'i');
    return regex.test(normalized);
  });
}
