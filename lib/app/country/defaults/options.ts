export function emptyOption () {
  return { value: '', item: '' };
}

export function otherOption () {
  return { value: '_other', item: '_options.other' };
}

export function onlyExclude () {
  return [
    { value: 'only', item: '_options.onlyExclude.only' },
    { value: 'exclude', item: '_options.onlyExclude.exclude' },
  ];
}
