import { UrlSegment } from '@angular/router';
import { withOptionalSeason } from './routes';

describe('routes', () => {
  const segments = (...paths: string[]) => paths.map((path) => new UrlSegment(path, {}));
  const match = withOptionalSeason('championship');

  it('matches the page with and without a season as one route', () => {
    expect(match(segments('championship'), null!, null!)?.posParams).toEqual({});
    expect(
      match(segments('championship', '2025-2026'), null!, null!)?.posParams?.['season']?.path
    ).toBe('2025-2026');
  });

  it('does not match other pages or deeper paths', () => {
    expect(match(segments('gallery'), null!, null!)).toBeNull();
    expect(match(segments('championship', '2025-2026', 'x'), null!, null!)).toBeNull();
    expect(match([], null!, null!)).toBeNull();
  });
});
