const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Missing env vars' });

  const { id, domain } = req.query;
  if (!id && !domain) return res.status(400).json({ error: 'Provide id or domain' });

  try {
    const supabase = createClient(url, key);

    let query = supabase
      .from('communities')
      .select('id, name, slug, allowed_brokers, primary_color, logo_url');

    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('domain', domain);
    }

    const { data, error } = await query.single();

    if (error || !data) return res.status(404).json({ error: 'Community not found' });

    return res.status(200).json({ community: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
