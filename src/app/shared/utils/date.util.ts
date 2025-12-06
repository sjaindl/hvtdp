export class DateUtil {
  /**
   * Formats a date string or Date into a localized DD.MM.YYYY string.
   * Falls back to the original input (string) if parsing fails.
   */
  static formatDate(input: string | Date, locale: string = 'de-DE'): string {
    const parsedDate = input instanceof Date ? input : new Date(input);

    if (Number.isNaN(parsedDate.getTime())) {
      return typeof input === 'string' ? input : '';
    }

    return parsedDate.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
