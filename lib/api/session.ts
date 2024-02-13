
export async function fetchLocales (
  context: any,
  language: string,
) {
  const path = `${context.$config.apiBaseUrl}/public/translations/${language}`;
  const nativeOptions: any = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await globalThis.fetch(path, nativeOptions);
    return await response.json();
  } catch (error) {
    utils.warn('failed to load translations', { language });
    return {};
  }
}

export async function reloadLocales (
  context: any,
  language: string,
) {
  const messages = await fetchLocales(context, language);
  context.$i18n.setLocaleMessage(language, messages);
  context.$forceUpdate();
}
