<script lang="ts">
import { onMount } from 'svelte';

import {
  certificateDiplomaPath,
  getCertificateEventId,
  signedCredentialPublicPath,
  verifyCertificateId,
} from '@/lib/certificates';
import { fetchDidDocument, verifyCredential } from '@/lib/certificates/crypto';
import type { VerifyResult } from '@/lib/certificates/registry';
import type { Language } from '@/lib/i18n';

interface Labels {
  idLabel: string;
  idPlaceholder: string;
  submit: string;
  statusLabel: string;
  subject: string;
  event: string;
  certId: string;
  viewDiploma: string;
  emptyHint: string;
  cryptoLabel: string;
  cryptoSigned: string;
  cryptoDemo: string;
  cryptoUnsigned: string;
  cryptoFailed: string;
  cryptoRevokedSigned: string;
  statuses: Record<string, string>;
  reasons: Record<string, string>;
}

interface Props {
  lang: Language;
  formAction: string;
  labels: Labels;
  initialId?: string;
}

let { lang, formAction, labels, initialId = '' }: Props = $props();

let id = $state(initialId);
let result = $state<VerifyResult | null>(null);
let cryptoPending = $state(false);

async function enrichWithCrypto(
  base: VerifyResult,
  certId: string
): Promise<VerifyResult> {
  const eventId = getCertificateEventId(certId);
  if (!eventId) {
    return {
      ...base,
      crypto: { checked: true, signatureValid: false, mode: 'unsigned' },
    };
  }

  try {
    const [didDocument, credentialResponse] = await Promise.all([
      fetchDidDocument(),
      fetch(signedCredentialPublicPath(eventId, certId)),
    ]);

    if (!didDocument || !credentialResponse.ok) {
      return {
        ...base,
        crypto: { checked: true, signatureValid: false, mode: 'unsigned' },
      };
    }

    const credential = await credentialResponse.json();
    const cryptoResult = await verifyCredential(credential, didDocument);
    const isDemoKey = didDocument.id === 'did:web:pereiratechtalks.org';

    return {
      ...base,
      crypto: {
        checked: true,
        signatureValid: cryptoResult.signatureValid,
        provider: cryptoResult.provider,
        mode: cryptoResult.signatureValid
          ? isDemoKey
            ? 'demo'
            : 'signed'
          : 'unsigned',
      },
    };
  } catch {
    return {
      ...base,
      crypto: { checked: true, signatureValid: false, mode: 'unsigned' },
    };
  }
}

async function runVerify(nextId: string): Promise<void> {
  const trimmed = nextId.trim();
  id = trimmed;
  if (!trimmed) {
    result = null;
    return;
  }
  const base = verifyCertificateId(trimmed, lang);
  result = base;
  cryptoPending = true;
  result = await enrichWithCrypto(base, trimmed);
  cryptoPending = false;
}

onMount(() => {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('id') ?? initialId;
  if (fromQuery) {
    void runVerify(fromQuery);
  }
});

function onSubmit(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const data = new FormData(form);
  const next = String(data.get('id') ?? '');
  void runVerify(next);
  const url = new URL(window.location.href);
  if (next.trim()) {
    url.searchParams.set('id', next.trim());
  } else {
    url.searchParams.delete('id');
  }
  history.replaceState({}, '', url.toString());
}

function cryptoMessage(crypto: NonNullable<VerifyResult['crypto']>): string {
  if (!crypto.checked || cryptoPending) {
    return '';
  }
  if (crypto.mode === 'signed' && crypto.signatureValid) {
    return labels.cryptoSigned;
  }
  if (crypto.mode === 'demo' && crypto.signatureValid) {
    return labels.cryptoDemo;
  }
  if (crypto.signatureValid && crypto.mode !== 'unsigned') {
    return labels.cryptoRevokedSigned;
  }
  if (crypto.mode === 'unsigned') {
    return labels.cryptoUnsigned;
  }
  return labels.cryptoFailed;
}
</script>

<form
  method="get"
  action={formAction}
  class="mb-8 flex flex-col sm:flex-row gap-3"
  onsubmit={onSubmit}
>
  <label class="sr-only" for="cert-verify-id">{labels.idLabel}</label>
  <input
    id="cert-verify-id"
    name="id"
    type="text"
    value={id}
    autocomplete="off"
    spellcheck="false"
    placeholder={labels.idPlaceholder}
    class="flex-1 min-h-11 rounded-lg border border-ptt-border bg-ptt-bg-elevated px-3 text-ptt"
  />
  <button
    type="submit"
    class="min-h-11 px-5 rounded-lg bg-ptt-primary text-ptt-bg font-semibold"
  >
    {labels.submit}
  </button>
</form>

{#if result && id}
  {@const statusLabel = labels.statuses[result.status] ?? result.status}
  {@const reasonText = result.reasons
    .map((r) => labels.reasons[r] ?? r)
    .join(' · ')}
  {@const diplomaHref = result.payload
    ? certificateDiplomaPath(result.payload.event.year, result.payload.id, lang)
    : null}
  {@const cryptoText = result.crypto ? cryptoMessage(result.crypto) : ''}
  <div
    class="rounded-2xl border border-ptt-border bg-ptt-bg-elevated p-6"
    data-testid="verify-result"
    data-status={result.status}
    data-valid={result.valid ? 'true' : 'false'}
    data-crypto={result.crypto?.signatureValid ? 'true' : 'false'}
  >
    <p
      class="text-sm uppercase tracking-wide text-gray-600 dark:text-gray-300 mb-1"
    >
      {labels.statusLabel}
    </p>
    <p class="text-2xl font-bold text-ptt mb-3">{statusLabel}</p>
    {#if reasonText}
      <p class="text-gray-600 dark:text-gray-300 mb-4">{reasonText}</p>
    {/if}
    {#if cryptoPending}
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4" data-testid="crypto-pending">
        …
      </p>
    {:else if cryptoText}
      <p
        class="text-sm text-gray-600 dark:text-gray-300 mb-4"
        data-testid="crypto-status"
      >
        <span class="font-semibold text-ptt">{labels.cryptoLabel}:</span>
        {cryptoText}
      </p>
    {/if}
    {#if result.payload}
      <dl class="grid gap-2 text-sm mb-6">
        <div>
          <dt class="font-semibold text-ptt">{labels.subject}</dt>
          <dd class="text-gray-600 dark:text-gray-300">
            {result.payload.subject.name}
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-ptt">{labels.event}</dt>
          <dd class="text-gray-600 dark:text-gray-300">
            {result.payload.event.name}
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-ptt">{labels.certId}</dt>
          <dd class="font-mono text-gray-600 dark:text-gray-300">
            {result.payload.id}
          </dd>
        </div>
      </dl>
    {/if}
    {#if diplomaHref && result.status !== 'unknown'}
      <a
        href={diplomaHref}
        class="inline-flex min-h-11 items-center text-ptt-primary underline underline-offset-2"
      >
        {labels.viewDiploma}
      </a>
    {/if}
  </div>
{:else}
  <p class="text-gray-600 dark:text-gray-300" data-testid="verify-empty">
    {labels.emptyHint}
  </p>
{/if}
