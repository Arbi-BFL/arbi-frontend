// API helper functions
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
  return await fetchAPI('https://wallet.arbi.betterfuturelabs.xyz/api/balances');
}

export async function getEmailStats() {
  return await fetchAPI('https://email.arbi.betterfuturelabs.xyz/api/stats');
}

export async function getAnalyticsStats() {
  return await fetchAPI('https://analytics.arbi.betterfuturelabs.xyz/api/stats');
}

export async function getOnchainStats() {
  return await fetchAPI('https://data.betterfuturelabs.xyz/api/stats');
}

export async function getOnchainTransactions() {
  return await fetchAPI('https://data.betterfuturelabs.xyz/api/transactions');
}
