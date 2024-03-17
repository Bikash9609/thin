interface Opts {
  useShortForm?: boolean;
  decimalPlaces: number;
}

const defaultOpts: Opts = {
  decimalPlaces: 1,
  useShortForm: true,
};

export function numberToWords(number: string, opts: Opts = defaultOpts) {
  const { decimalPlaces, useShortForm } = opts;
  const units = useShortForm
    ? ['', 'K', 'M', 'B', 'T']
    : ['', 'K', 'Million', 'Billion', 'Trillion'];

  const num = parseFloat(number);

  if (isNaN(num)) {
    return '0';
  }

  if (num === 0) {
    return '0';
  }

  let absoluteNum = Math.abs(num);

  let result = '';
  let index = 0;
  while (absoluteNum >= 1000 && index < units.length) {
    absoluteNum /= 1000;
    index++;
  }

  if (index >= units.length) {
    return '0';
  }

  if (decimalPlaces === 0) {
    result = `${Math.round(absoluteNum)} ${units[index]}`;
  } else {
    result = `${Math.round(absoluteNum * 10 ** decimalPlaces) / 10 ** decimalPlaces} ${
      units[index]
    }`;
  }

  return result.replaceAll(' ', useShortForm ? '' : ' ');
}
