import { afterEach, describe, expect, it, vi } from 'vitest';

import { focusFirstInvalidField } from '@/lib/form-ui';

describe('form-ui', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('focuses the first field with an error', () => {
    const focus = vi.fn();
    vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'field-b') {
        return { focus } as unknown as HTMLElement;
      }
      return null;
    });

    focusFirstInvalidField(
      [
        { key: 'a', id: 'field-a' },
        { key: 'b', id: 'field-b' },
        { key: 'c', id: 'field-c' },
      ],
      { a: '', b: 'Required', c: 'Also bad' }
    );

    expect(document.getElementById).toHaveBeenCalledWith('field-b');
    expect(focus).toHaveBeenCalledTimes(1);
  });

  it('does nothing when there are no field errors', () => {
    const getElementById = vi.spyOn(document, 'getElementById');

    focusFirstInvalidField([{ key: 'a', id: 'field-a' }], { a: '' });

    expect(getElementById).not.toHaveBeenCalled();
  });
});
