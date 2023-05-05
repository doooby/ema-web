// TODO t81 __supplement
// remove all

export function eysNo () {
  return Object.freeze([
    { value: 'y', text: 'lexicon.yes' },
    { value: 'n', text: 'lexicon.no' },
  ]);
}

export function eysNoOptional () {
  return Object.freeze([
    { value: '', text: '', translated: true },
    { value: 'y', text: 'lexicon.yes' },
    { value: 'n', text: 'lexicon.no' },
  ]);
}

//
export function formalGenders () {
  return Object.freeze([
    { value: 'f', text: 'db.common.genders.females.s' },
    { value: 'm', text: 'db.common.genders.males.s' },
  ]);
}
