const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Missing env vars' });

  const supabase = createClient(url, key);

  /* GET /api/journal-entry?user_id=&account_id=&order_id= */
  if (req.method === 'GET') {
    const { user_id, account_id, order_id } = req.query;
    if (!user_id || !account_id || !order_id)
      return res.status(400).json({ error: 'Missing user_id, account_id or order_id' });

    const { data, error } = await supabase
      .from('trade_journal')
      .select('stars, notes, updated_at')
      .eq('user_id', user_id)
      .eq('account_id', account_id)
      .eq('order_id', order_id)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ entry: data || null });
  }

  /* POST /api/journal-entry  body: { user_id, account_id, order_id, stars, notes } */
  if (req.method === 'POST') {
    const { user_id, account_id, order_id, stars, notes } = req.body || {};
    if (!user_id || !account_id || !order_id)
      return res.status(400).json({ error: 'Missing user_id, account_id or order_id' });

    const { data, error } = await supabase
      .from('trade_journal')
      .upsert(
        { user_id, account_id, order_id, stars: stars ?? 0, notes: notes ?? '', updated_at: new Date().toISOString() },
        { onConflict: 'user_id,account_id,order_id' }
      )
      .select('stars, notes, updated_at')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ entry: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
