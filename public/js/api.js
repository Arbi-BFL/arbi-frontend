// API helper functions - Use relative URLs to avoid mixed content
export async function fetchAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { error: error.message };
  }
}

export async function getWalletBalances() {
  return await fetchAPI('/api/wallet/balances');
}

export async function getEmailStats() {
  return await fetchAPI('/api/email/stats');
}

export async function getAnalyticsStats() {
  return await fetchAPI('/api/analytics/stats');
}

export async function getOnchainStats() {
  return await fetchAPI('/api/onchain/stats');
}

export async function getOnchainTransactions() {
  return await fetchAPI('/api/onchain/transactions');
}
