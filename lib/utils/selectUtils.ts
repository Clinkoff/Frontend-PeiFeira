export function withPlaceholder<T extends Record<string, any>>(
  data: T[] | undefined,
  labelKey: keyof T,
  valueKey: keyof T,
  placeholderLabel = 'Selecione uma opção'
) {
  const placeholder = { [labelKey]: placeholderLabel, [valueKey]: null } as T;
  return [placeholder, ...(data || [])];
}
