import { rm } from 'node:fs/promises';
import { join } from 'node:path';

import type { AstroIntegration } from 'astro';

/**
 * Astro integration that removes /internal pages from the build output
 * when INCLUDE_INTERNAL is not set to 'true'.
 *
 * - Production builds: INCLUDE_INTERNAL is not set -> internal pages removed
 * - Staging/dev builds: Set INCLUDE_INTERNAL=true -> internal pages kept
 * - Dev server (npm run dev): Integration is not invoked -> always accessible
 */
export default function excludeInternal(): AstroIntegration {
  return {
    name: 'exclude-internal',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (process.env.INCLUDE_INTERNAL === 'true') {
          logger.info('INCLUDE_INTERNAL=true — keeping /internal pages');
          return;
        }

        const internalDir = join(dir.pathname, 'internal');
        try {
          await rm(internalDir, { recursive: true, force: true });
          logger.info('Removed /internal pages from build output');
        } catch (err: unknown) {
          const code =
            err instanceof Error && 'code' in err
              ? (err as NodeJS.ErrnoException).code
              : undefined;
          if (code === 'ENOENT') {
            // Directory does not exist — nothing to remove
            return;
          }
          logger.error(
            `Failed to remove /internal: ${err instanceof Error ? err.message : String(err)}`
          );
          throw err;
        }
      },
    },
  };
}
