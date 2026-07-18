import { describe, it, expect } from 'vitest';
import { cn } from '../lib/utils';

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('handles conditional class names', () => {
    expect(cn('bg-red-500', false && 'text-white', 'p-4')).toBe('bg-red-500 p-4');
  });

  it('resolves conflicting tailwind classes', () => {
    expect(cn('p-4 p-8')).toBe('p-8');
  });
});
