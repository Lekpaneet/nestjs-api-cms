import * as moment from 'moment-timezone';

export class DateTz {
  public static timezone = 'Asia/Bangkok';

  public static getDateNow(
    format: string | '' = '',
    initialDateTime: Date = undefined,
  ) {
    const dateNow = initialDateTime || Date.now();

    return moment.tz(dateNow, DateTz.timezone).format(format);
  }

  public static checkFormat(date: string, format = 'YYYY-MM-DD') {
    return moment(date, format).isValid();
  }
}
