/* eslint-disable no-console */
export function notify (
  type: 'error',
  message: string | Error,
  context?: any,
) {
  switch (type) {
    case 'error':
      console.error(message);
      console.log(context);
      break;
  }
}
