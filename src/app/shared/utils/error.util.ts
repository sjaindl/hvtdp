import { HttpErrorResponse } from '@angular/common/http';

export const GENERIC_ERROR_MESSAGE =
  'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut.';

const MAX_LENGTH = 200;

export class ErrorUtil {
  /**
   * Returns a readable message for a failed request: the error text sent by the API if there is one,
   * otherwise the HTTP status, otherwise a generic fallback.
   */
  static message(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error;
      const apiMessage =
        ErrorUtil.text(body) ??
        // Response that is not valid JSON (e.g. a PHP/MySQL error); checked before `error.message`,
        // which then holds the JSON parser's error.
        ErrorUtil.text(body?.text) ??
        ErrorUtil.text(body?.jsonError) ?? // PHP API: {"jsonError": "..."}
        ErrorUtil.text(body?.error?.message) ?? // Strapi: {"error": {"message": "..."}}
        ErrorUtil.text(body?.message);
      if (apiMessage) {
        return apiMessage;
      }
      if (error.status > 0) {
        // No status text: HTTP/2 has none, and Angular then fills in a misleading "OK" / "Unknown Error".
        return `Serverfehler ${error.status}`;
      }
      return GENERIC_ERROR_MESSAGE;
    }
    if (error instanceof Error) {
      return ErrorUtil.text(error.message) ?? GENERIC_ERROR_MESSAGE;
    }
    return ErrorUtil.text(error) ?? GENERIC_ERROR_MESSAGE;
  }

  /** Usable text only: skips empty values and HTML error pages, shortens long messages. */
  private static text(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }
    const text = value.trim();
    if (!text || text.startsWith('<')) {
      return null;
    }
    return text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH)}…` : text;
  }
}
