import moment from 'moment';

module.exports = (date, format, locale) => {
  locale = locale ? locale : "es";
  moment.locale(locale);
  return moment(date).format(format);
};
