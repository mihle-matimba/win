const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const SUPABASE_URL = "https://wbyfhherldmlmmgnsfvt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWZoaGVybGRtbG1tZ25zZnZ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA4NjgzNywiZXhwIjoyMDk2NjYyODM3fQ.wkzxhsFxq_-hCc_5wAomU1D2TgRDA3kszK-sdTnWL-Y";
const HFM_API_KEY = "vuKYbeK3OIzc10s9KESLqQfvGNmr3LDS";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BATCH_SIZE = 1000;
const FIXED_FROM = '2026-01-01';
const FIXED_TO = new Date().toISOString().split('T')[0];

function httpGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(10800000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

async function fetchAndInsertTransactions(client) {
  const { id: clientId, last_trade } = client;
  const lastTradeStr = last_trade.split('T')[0].split(' ')[0];

  const url = `https://hfm.trade245.com/api/accounts/${clientId}/transactions?from_date=${FIXED_FROM}&to_date=${FIXED_TO}`;
  const text = await httpGet(url, { 'X-API-KEY': HFM_API_KEY });

  if (!text || text.trim() === '') {
    console.log(`  ✓ Client ${clientId} | last trade: ${lastTradeStr} | empty response`);
    return 0;
  }

  let transactions = [];
  try {
    const trimmed = text.trim();
    if (trimmed.startsWith('[')) {
      transactions = JSON.parse(trimmed);
    } else if (trimmed.startsWith('{')) {
      const fixed = '[' + trimmed.replace(/\}\{/g, '},{') + ']';
      transactions = JSON.parse(fixed);
    } else {
      console.log(`  ✗ Client ${clientId} | last trade: ${lastTradeStr} | unexpected response format:`);
      console.log(`    ${text.slice(0, 300)}`);
      return 0;
    }
  } catch (e) {
    console.log(`  ✗ Client ${clientId} | last trade: ${lastTradeStr} | parse error: ${e.message}`);
    console.log(`    Raw: ${text.slice(0, 300)}`);
    return 0;
  }

  if (!transactions.length) {
    console.log(`  ✓ Client ${clientId} | last trade: ${lastTradeStr} | 0 transactions (empty array)`);
    return 0;
  }

  // Log a sample of the first transaction's keys on first success, to verify field names
  if (fetchAndInsertTransactions._loggedKeys !== true) {
    fetchAndInsertTransactions._loggedKeys = true;
    console.log(`  ℹ First transaction keys: ${Object.keys(transactions[0]).join(', ')}`);
    console.log(`  ℹ Sample: ${JSON.stringify(transactions[0]).slice(0, 300)}`);
  }

  const rows = transactions.map((t) => ({
    order_id:      t.order_id,
    account_id:    clientId,
    type:          t.type,
    open_price:    t.open_price,
    close_price:   t.close_price,
    open_time:     t.open_time,
    close_time:    t.close_time,
    profit:        t.profit,
    commission:    t.commission,
    comm_deduction: t.comm_deduction,
    rebates:       t.rebates,
    synced_at:     new Date().toISOString(),
  }));

  for (const batch of chunk(rows, BATCH_SIZE)) {
    const { error } = await supabase
      .from('transactions')
      .upsert(batch, { onConflict: 'order_id', ignoreDuplicates: true });
    if (error) throw error;
  }

  console.log(`  ✓ Client ${clientId} | last trade: ${lastTradeStr} | ${transactions.length} transactions processed`);
  return transactions.length;
}

async function syncTransactions() {
  let txnsSynced = 0;
  let failedClients = [];
  let syncLogId = null;

  try {
    const { data: logData } = await supabase
      .from('sync_log')
      .insert({ started_at: new Date().toISOString(), status: 'running' })
      .select('id')
      .single();

    syncLogId = logData?.id;
    console.log(`Created sync log: ${syncLogId}`);

    console.log('Fetching eligible clients from database...');
    const { data: clients } = await supabase
      .from('broker_clients')
      .select('id, last_trade')
      .gte('last_trade', FIXED_FROM);

    if (!clients?.length) {
      console.log('No eligible clients found');
      return { success: true, txns_synced: 0, message: 'No eligible clients' };
    }

    console.log(`Found ${clients.length} clients with last trade from ${FIXED_FROM} onwards`);
    console.log(`Fetching range: ${FIXED_FROM} → ${FIXED_TO}\n`);

    const batches = chunk(clients, 5);

    for (let b = 0; b < batches.length; b++) {
      const batch = batches[b];
      console.log(`Batch ${b + 1}/${batches.length}`);

      const settled = await Promise.allSettled(
        batch.map(async (client) => {
          const count = await fetchAndInsertTransactions(client);
          return { id: client.id, count };
        })
      );

      settled.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          txnsSynced += result.value.count;
        } else {
          const clientId = batch[i].id;
          console.error(`  ✗ Client ${clientId} — ${result.reason?.message}`);
          failedClients.push({ client_id: clientId, error: result.reason?.message });
        }
      });
    }

    const status = failedClients.length ? 'partial' : 'success';

    await supabase
      .from('sync_log')
      .update({
        finished_at:    new Date().toISOString(),
        txns_synced:    txnsSynced,
        clients_failed: failedClients.length,
        error_detail:   failedClients.length ? failedClients : null,
        status
      })
      .eq('id', syncLogId);

    console.log(`\n✓ Sync completed`);
    console.log(`  Clients processed: ${clients.length}`);
    console.log(`  Total transactions processed: ${txnsSynced}`);
    console.log(`  Failed clients: ${failedClients.length}`);

    return { success: true, txns_synced: txnsSynced, failed_clients: failedClients.length, status };

  } catch (err) {
    console.error('✗ Error:', err.message);

    if (syncLogId) {
      await supabase
        .from('sync_log')
        .update({
          finished_at:    new Date().toISOString(),
          status:         'error',
          error_detail:   { message: err.message },
          txns_synced:    txnsSynced,
          clients_failed: failedClients.length
        })
        .eq('id', syncLogId);
    }

    return { success: false, error: err.message };
  }
}

syncTransactions().then(result => {
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
});
