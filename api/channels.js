const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Missing env vars' });

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('channels')
      .select('id, name, url, icon_url, sort_order')
      .eq('published', true)
      .order('sort_order');

    if (error) throw error;
    return res.status(200).json({ channels: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
