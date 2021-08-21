export function afterTimeout (time: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, time));
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
