<script lang="ts">
import type { CertificatePayload } from '@/lib/certificates/types';

interface Props {
  payload: CertificatePayload;
  pageUrl: string;
  labels: {
    print: string;
    downloadJson: string;
    copyLink: string;
    share: string;
    copied: string;
    shared: string;
    shareFailed: string;
  };
}

let { payload, pageUrl, labels }: Props = $props();

let status = $state('');

function clearStatusSoon(): void {
  window.setTimeout(() => {
    status = '';
  }, 2500);
}

function printCertificate(): void {
  window.print();
}

function downloadJson(): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${payload.id}.certificate.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function copyLink(): Promise<void> {
  try {
    await navigator.clipboard.writeText(pageUrl);
    status = labels.copied;
    clearStatusSoon();
  } catch {
    status = labels.shareFailed;
    clearStatusSoon();
  }
}

async function shareLink(): Promise<void> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: payload.event.name,
        text: payload.subject.name,
        url: pageUrl,
      });
      status = labels.shared;
      clearStatusSoon();
      return;
    } catch {
      /* user cancelled or failed — fall through to copy */
    }
  }
  await copyLink();
}
</script>

<div class="ptt-cert-actions" data-testid="certificate-actions">
  <button
    type="button"
    class="ptt-cert-actions__btn"
    data-testid="cert-action-print"
    onclick={printCertificate}
  >
    {labels.print}
  </button>
  <button
    type="button"
    class="ptt-cert-actions__btn ptt-cert-actions__btn--secondary"
    data-testid="cert-action-json"
    onclick={downloadJson}
  >
    {labels.downloadJson}
  </button>
  <button
    type="button"
    class="ptt-cert-actions__btn ptt-cert-actions__btn--secondary"
    data-testid="cert-action-copy"
    onclick={copyLink}
  >
    {labels.copyLink}
  </button>
  <button
    type="button"
    class="ptt-cert-actions__btn ptt-cert-actions__btn--secondary"
    data-testid="cert-action-share"
    onclick={shareLink}
  >
    {labels.share}
  </button>
  <p class="ptt-cert-actions__status" role="status" aria-live="polite">
    {status}
  </p>
</div>
