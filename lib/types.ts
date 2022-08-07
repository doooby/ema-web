export type MaybeData<D> = { ok: false } | { ok: true, data: D };

export type Option = { value: string, text: string, translated?: true };
