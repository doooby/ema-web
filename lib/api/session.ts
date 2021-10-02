
export async function fetchLocales (
  language: string,
  options: {
    baseUrl: string,
  },
) {
  const path = `/session/translations/${language}`;
  const nativeOptions: any = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await globalThis.fetch(options.baseUrl + path, nativeOptions);
    return await response.json();
  } catch (error) {
    utils.warn('failed to load translations', { language });
    return {};
  }
}
