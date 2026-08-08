<script lang="ts">
/**
 * PtdScheduleIcon — stroke glyphs for the agenda timeline, keyed by the
 * `PtdScheduleIcon` union produced in `@/lib/ptdSchedule`.
 */
import type { PtdScheduleIcon } from '@/lib/ptdSchedule';

interface Props {
  name: PtdScheduleIcon;
  size?: number;
}

let { name, size = 18 }: Props = $props();

const PATHS: Record<PtdScheduleIcon, string> = {
  mic: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM5 11a7 7 0 0 0 14 0M12 18v3',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z',
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
  users:
    'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  coffee:
    'M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Zm13 1h1.5a2.5 2.5 0 0 1 0 5H17M6 2v2M10 2v2M14 2v2',
  megaphone: 'M4 10v4h3l6 4V6L7 10H4Zm13-2a5 5 0 0 1 0 8M20 5a9 9 0 0 1 0 14',
  door: 'M4 21h16M6 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17M13 12h.01',
  ticket:
    'M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a3 3 0 0 0 0 6v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1a3 3 0 0 0 0-6V8Zm10-2v12',
  gift: 'M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9Zm-1-4h18v4H3V7Zm9 0v14M12 7S10.5 3 8.5 3a2.5 2.5 0 0 0 0 5M12 7s1.5-4 3.5-4a2.5 2.5 0 0 1 0 5',
  flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
};
</script>

<svg
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill="none"
  stroke="currentColor"
  stroke-width="1.9"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d={PATHS[name]} />
</svg>
