const PROTECTED_ROUTES = new Set(['/', '/reviews/best-home-blood-pressure-monitors-2026']);
const APPROVAL_ACTIONS = new Set(['publish', 'hold', 'reject']);

export function evaluatePublicationGate(candidate) {
  const blockers = [];
  if (PROTECTED_ROUTES.has(candidate.url)) blockers.push('protected-route');
  if (candidate.isNewPublicUrl !== true) blockers.push('not-declared-new-public-url');
  if (candidate.identityStatus !== 'resolved') blockers.push('exact-model-identity-unresolved');
  if (candidate.eligible !== true) blockers.push('not-eligible');
  if (!Number.isFinite(candidate.evidenceConfidence) || candidate.evidenceConfidence < Number(candidate.minimumEvidenceConfidence ?? 0.7)) blockers.push('evidence-confidence-below-threshold');
  if (!Array.isArray(candidate.primarySources) || candidate.primarySources.length === 0) blockers.push('missing-primary-sources');
  if (!Array.isArray(candidate.materialClaims) || candidate.materialClaims.some((claim) => !Array.isArray(claim.evidenceIds) || claim.evidenceIds.length === 0)) blockers.push('untraceable-material-claims');
  if (!Array.isArray(candidate.images) || candidate.images.some((image) => !image.rightsStatus || image.rightsStatus === 'unknown' || image.rightsStatus === 'found-online')) blockers.push('image-rights-unresolved');
  if (!Array.isArray(candidate.schemaTypes)) blockers.push('schema-not-declared');
  if (candidate.canonical !== candidate.url) blockers.push('canonical-mismatch');
  if (candidate.disclosureStatus !== 'approved') blockers.push('disclosure-not-approved');
  if (candidate.testingStatus == null) blockers.push('testing-status-missing');
  if (candidate.humanApproval?.action !== 'publish') blockers.push('human-publish-approval-required');
  if (candidate.humanApproval?.action && !APPROVAL_ACTIONS.has(candidate.humanApproval.action)) blockers.push('invalid-approval-action');
  return { allowed: blockers.length === 0, blockers, requiredAction: blockers.includes('human-publish-approval-required') ? 'telegram-human-approval' : null };
}

export function buildApprovalPacket(candidate) {
  const packet = {
    schemaVersion: '1.0.0',
    proposedTitle: candidate.title,
    proposedUrl: candidate.url,
    exactProduct: { brand: candidate.brand, model: candidate.exactModel, market: candidate.market, aliases: candidate.modelAliases ?? [] },
    evidenceConfidence: candidate.evidenceConfidence,
    eligibility: { eligible: candidate.eligible, failedGates: candidate.failedGates ?? [] },
    mdrankScore: candidate.eligible ? candidate.mdrankScore ?? null : null,
    primarySources: candidate.primarySources ?? [],
    materialClaims: candidate.materialClaims ?? [],
    importantLimitations: candidate.limitations ?? [],
    images: (candidate.images ?? []).map(({ id, origin, rightsStatus }) => ({ id, origin, rightsStatus })),
    schemaTypes: candidate.schemaTypes ?? [],
    disclosureStatus: candidate.disclosureStatus,
    testingStatus: candidate.testingStatus,
    controls: [
      { action: 'publish', label: 'Publish', requiresExplicitHumanAction: true },
      { action: 'hold', label: 'Hold', requiresExplicitHumanAction: true },
      { action: 'reject', label: 'Reject', requiresExplicitHumanAction: true },
    ],
  };
  return packet;
}

export function formatApprovalPacketMarkdown(packet) {
  const sources = packet.primarySources.map((s) => `- ${s.title ?? s.id}: ${s.url}`).join('\n') || '- None';
  const limits = packet.importantLimitations.map((x) => `- ${x}`).join('\n') || '- None recorded';
  return `## MDRank publication approval\n\n**Title:** ${packet.proposedTitle}\n**URL:** ${packet.proposedUrl}\n**Exact product:** ${packet.exactProduct.brand} ${packet.exactProduct.model} (${packet.exactProduct.market})\n**Eligibility:** ${packet.eligibility.eligible ? 'eligible' : 'not eligible'}\n**MDRank score:** ${packet.mdrankScore ?? 'not available'}\n**Evidence confidence:** ${packet.evidenceConfidence}\n**Testing status:** ${packet.testingStatus}\n**Disclosure:** ${packet.disclosureStatus}\n**Schema:** ${packet.schemaTypes.join(', ') || 'none'}\n\n### Primary sources\n${sources}\n\n### Important limitations\n${limits}\n\n**Controls:** Publish · Hold · Reject\n\nNo action is executed unless a human selects a control.`;
}

export { PROTECTED_ROUTES };
