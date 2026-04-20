const CONFIRM_TTL_MS = 5 * 60 * 1000;
const pendingConfirmations = new Map();

function getPending(userId) {
  const entry = pendingConfirmations.get(userId);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    pendingConfirmations.delete(userId);
    return null;
  }

  return entry.transactionData;
}

function setPending(userId, transactionData) {
  pendingConfirmations.set(userId, {
    transactionData,
    expiresAt: Date.now() + CONFIRM_TTL_MS,
  });
}

function clearPending(userId) {
  pendingConfirmations.delete(userId);
}

module.exports = {
  clearPending,
  getPending,
  setPending,
};
