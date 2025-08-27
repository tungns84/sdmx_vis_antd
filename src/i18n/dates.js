import * as R from 'ramda';
import fr from 'date-fns/locale/fr';
import de from 'date-fns/locale/de';
import en from 'date-fns/locale/en';
import es from 'date-fns/locale/es';
import ar from 'date-fns/locale/ar';
import it from 'date-fns/locale/it';
import nl from 'date-fns/locale/nl';
import th from 'date-fns/locale/th';

export const getDateLocale = (locale) =>
  R.propOr(en, locale, { fr, de, en, es, ar, it, nl, th });
