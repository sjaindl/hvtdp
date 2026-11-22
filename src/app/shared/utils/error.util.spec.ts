import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUtil, GENERIC_ERROR_MESSAGE } from './error.util';

describe('ErrorUtil', () => {
  const httpError = (init: { error?: unknown; status?: number; statusText?: string }) =>
    new HttpErrorResponse({ url: 'https://www.hvtdpstainz.at/api/test.php', ...init });

  it('uses a plain text body', () => {
    expect(ErrorUtil.message(httpError({ error: 'Datenbank nicht erreichbar', status: 500 }))).toBe(
      'Datenbank nicht erreichbar'
    );
  });

  it('uses the jsonError of the PHP API', () => {
    expect(ErrorUtil.message(httpError({ error: { jsonError: 'Malformed UTF-8' }, status: 500 }))).toBe(
      'Malformed UTF-8'
    );
  });

  it('uses the error message of Strapi', () => {
    const error = httpError({ error: { error: { status: 404, name: 'NotFoundError', message: 'Not Found' } }, status: 404 });
    expect(ErrorUtil.message(error)).toBe('Not Found');
  });

  it('uses the text of a response that is not valid JSON', () => {
    const error = httpError({ error: { error: new SyntaxError('Unexpected token'), text: "Table 'Game' doesn't exist" }, status: 200 });
    expect(ErrorUtil.message(error)).toBe("Table 'Game' doesn't exist");
  });

  it('falls back to the HTTP status', () => {
    expect(ErrorUtil.message(httpError({ error: null, status: 503, statusText: 'Service Unavailable' }))).toBe(
      'Serverfehler 503'
    );
  });

  it('skips HTML error pages', () => {
    expect(ErrorUtil.message(httpError({ error: '<html><body>Bad Gateway</body></html>', status: 502 }))).toBe(
      'Serverfehler 502'
    );
  });

  it('uses the generic message when the request never reached a server', () => {
    expect(ErrorUtil.message(httpError({ error: new ProgressEvent('error'), status: 0 }))).toBe(GENERIC_ERROR_MESSAGE);
  });

  it('shortens long messages to 200 characters', () => {
    const message = ErrorUtil.message(httpError({ error: 'x'.repeat(300), status: 500 }));
    expect(message).toBe('x'.repeat(200) + '…');
  });

  it('uses the message of other errors', () => {
    expect(ErrorUtil.message(new Error('Kaputt'))).toBe('Kaputt');
    expect(ErrorUtil.message('Textfehler')).toBe('Textfehler');
  });

  it('falls back to the generic message for unknown values', () => {
    expect(ErrorUtil.message(undefined)).toBe(GENERIC_ERROR_MESSAGE);
    expect(ErrorUtil.message({})).toBe(GENERIC_ERROR_MESSAGE);
    expect(ErrorUtil.message(new Error('  '))).toBe(GENERIC_ERROR_MESSAGE);
  });
});
