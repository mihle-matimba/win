const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Missing env vars' });

  const supabase = createClient(url, key);

  if (req.method === 'GET') {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ error: 'Missing user_id' });

    const { data, error } = await supabase
      .from('linked_accounts')
      .select('id, broker_clients(id, name, email, balance, account_currency, synced_at)')
      .eq('user_id', userId);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ accounts: data || [] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
