import { environment } from '../../../environments/environment';
import { StrapiMedia, mediaUrl, resolveCmsUrl } from './media.util';

describe('media util', () => {
  const cms = environment.cmsUrl;
  const photo: StrapiMedia = {
    url: '/uploads/photo.jpg',
    formats: {
      thumbnail: { url: '/uploads/thumbnail_photo.jpg', width: 245, height: 163 },
      medium: { url: '/uploads/medium_photo.jpg', width: 1000, height: 667 },
    },
  };

  it('resolves relative upload paths against the CMS and keeps absolute URLs', () => {
    expect(resolveCmsUrl('/uploads/a.jpg')).toBe(`${cms}/uploads/a.jpg`);
    expect(resolveCmsUrl('https://example.com/a.jpg')).toBe('https://example.com/a.jpg');
  });

  it('uses the original without a size', () => {
    expect(mediaUrl(photo)).toBe(`${cms}/uploads/photo.jpg`);
  });

  it('uses the requested format', () => {
    expect(mediaUrl(photo, 'thumbnail')).toBe(`${cms}/uploads/thumbnail_photo.jpg`);
    expect(mediaUrl(photo, 'medium')).toBe(`${cms}/uploads/medium_photo.jpg`);
  });

  it('falls back to the next larger format, then to the original', () => {
    expect(mediaUrl(photo, 'small')).toBe(`${cms}/uploads/medium_photo.jpg`);
    expect(mediaUrl(photo, 'large')).toBe(`${cms}/uploads/photo.jpg`);
    expect(mediaUrl({ url: '/uploads/tiny.png' }, 'small')).toBe(`${cms}/uploads/tiny.png`);
  });

  it('returns null without media', () => {
    expect(mediaUrl(null)).toBeNull();
    expect(mediaUrl(undefined, 'small')).toBeNull();
  });
});
