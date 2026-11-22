import { TextUtil } from './text.util';

describe('TextUtil', () => {
  describe('excerpt', () => {
    it('turns Markdown into plain text', () => {
      const markdown =
        '# Titel\n\n**Großer** Sieg gegen [SV Gegner](https://example.com)!\n\n![Foto](bild.jpg)\n- Tore: 3';
      expect(TextUtil.excerpt(markdown)).toBe('Großer Sieg gegen SV Gegner! Tore: 3');
    });

    it('removes escaping backslashes', () => {
      expect(TextUtil.excerpt('Am 19\\. September')).toBe('Am 19. September');
    });

    it('cuts long texts at a word boundary', () => {
      const text = 'Das Spiel war spannend, bis zum Schluss.';
      expect(TextUtil.excerpt(text, 24)).toBe('Das Spiel war spannend …');
    });

    it('keeps short texts and handles missing content', () => {
      expect(TextUtil.excerpt('Kurz.')).toBe('Kurz.');
      expect(TextUtil.excerpt(undefined as unknown as string)).toBe('');
    });
  });

  describe('titleCase', () => {
    it('converts words in capitals', () => {
      expect(TextUtil.titleCase('STRAUSS')).toBe('Strauss');
      expect(TextUtil.titleCase('MAYER-HUBER Franz')).toBe('Mayer-Huber Franz');
    });

    it('keeps mixed-case words untouched', () => {
      expect(TextUtil.titleCase('Textil GmbH')).toBe('Textil GmbH');
    });
  });

  it('builds initials from first and last name', () => {
    expect(TextUtil.initials('stefan', 'jaindl')).toBe('SJ');
    expect(TextUtil.initials('', 'Jaindl')).toBe('J');
  });

  it('estimates the reading time with at least one minute', () => {
    expect(TextUtil.readingMinutes('kurz')).toBe(1);
    expect(TextUtil.readingMinutes(Array(600).fill('Wort').join(' '))).toBe(3);
  });
});
