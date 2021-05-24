
export function notify (
  type: 'error',
  message: string,
  context?: any,
) {
  switch (type) {
    case 'error':
      // eslint-disable-next-line no-console
      console.error(message, context);
      break;
  }
}
