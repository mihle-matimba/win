const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const url  = process.env.SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Missing env vars' });

  const supabase = createClient(url, key);

  // ── GET /api/link-account?account_id=123456 ──────────────────
  // Look up broker_clients by id and return name, email, balance
  if (req.method === 'GET') {
    const accountId = req.query.account_id;
    if (!accountId) return res.status(400).json({ error: 'Missing account_id' });

    const { data, error } = await supabase
      .from('broker_clients')
      .select('id, name, email, balance, account_currency')
      .eq('id', accountId)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Account not found' });

    return res.status(200).json({ account: data });
  }

  // ── POST /api/link-account ────────────────────────────────────
  // Link a broker_client to a user in linked_accounts.
  // Rejects if the account is already linked by anyone.
  if (req.method === 'POST') {
    const { user_id, account_id } = req.body;
    if (!user_id || !account_id) return res.status(400).json({ error: 'Missing user_id or account_id' });

    // Check the account exists in broker_clients
    const { data: client, error: clientErr } = await supabase
      .from('broker_clients')
      .select('id')
      .eq('id', account_id)
      .single();

    if (clientErr || !client) return res.status(404).json({ error: 'Account not found in broker records' });

    // Check not already linked (by anyone)
    const { data: existing } = await supabase
      .from('linked_accounts')
      .select('user_id')
      .eq('id', account_id)
      .single();

    if (existing) {
      if (existing.user_id === user_id) {
        return res.status(409).json({ error: 'You have already linked this account.' });
      }
      return res.status(409).json({ error: 'This account is already linked to another user.' });
    }

    // Insert the link
    const { error: insertErr } = await supabase
      .from('linked_accounts')
      .insert({ user_id, id: account_id });

    if (insertErr) return res.status(500).json({ error: insertErr.message });

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
