const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Missing env vars' });

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = createClient(url, key);

  const { account_id } = req.query;
  if (!account_id) return res.status(400).json({ error: 'Missing account_id' });

  /* Fetch ALL rows for the account — no type/symbol filtering — sorted chronologically */
  const { data, error, count } = await supabase
    .from('transactions')
    .select('*', { count: 'exact' })
    .eq('account_id', account_id)
    .order('open_time', { ascending: true })
    .range(0, 4999);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ transactions: data || [], total: count || 0 });
};
