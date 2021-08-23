export function afterTimeout (time: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, time));
}

export function raise (error: Error) {
  notify('error', error);
  throw error;
}

export function notify (
  type: 'error',
  message: string | Error,
  context?: any,
): void {
  switch (type) {
    case 'error':
      console.error(message);
      break;
  }
}

export function waitFor (time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}
