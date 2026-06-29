const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Missing env vars' });

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = createClient(url, key);

  const { account_id, page = '0', per_page = '16', symbol, type, profit_min, profit_max } = req.query;
  if (!account_id) return res.status(400).json({ error: 'Missing account_id' });

  const pageNum = Math.max(0, parseInt(page, 10) || 0);
  const perPage = Math.min(500, Math.max(1, parseInt(per_page, 10) || 16));
  const from = pageNum * perPage;
  const to = from + perPage - 1;

  /* Build query — all filters applied BEFORE range so pagination is over the filtered set */
  let q = supabase
    .from('transactions')
    .select('*', { count: 'exact' })
    .eq('account_id', account_id)
    .not('type', 'ilike', '%deposit%')
    .not('type', 'ilike', '%withdrawal%')
    .not('type', 'ilike', '%balance%')
    .not('type', 'ilike', '%credit%')
    /* NULL symbol rows must pass — only exclude if symbol explicitly matches */
    .or('symbol.is.null,and(symbol.not.ilike.%deposit%,symbol.not.ilike.%withdrawal%)');

  if (symbol)                    q = q.ilike('symbol', `%${symbol}%`);
  if (type)                      q = q.ilike('type', type);
  if (profit_min !== undefined)  q = q.gte('profit', parseFloat(profit_min));
  if (profit_max !== undefined)  q = q.lte('profit', parseFloat(profit_max));

  q = q.order('open_time', { ascending: false }).range(from, to);

  const { data, error, count } = await q;

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({
    transactions: data || [],
    total: count || 0,
    page: pageNum,
    per_page: perPage,
  });
};
