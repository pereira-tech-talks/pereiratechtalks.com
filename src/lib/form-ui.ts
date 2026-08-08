/**
 * Tiny shared helpers for intake form UX (a11y focus after validation).
 */

export function focusFirstInvalidField(
  fieldOrder: ReadonlyArray<{ key: string; id: string }>,
  errors: Record<string, string>
): void {
  if (typeof document === 'undefined') return;
  const firstInvalid = fieldOrder.find((field) => errors[field.key]);
  if (!firstInvalid) return;
  document.getElementById(firstInvalid.id)?.focus();
}
