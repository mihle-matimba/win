const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  const supabase = createClient(url, key);

  // GET — fetch progress for a user
  if (req.method === 'GET') {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ error: 'Missing user_id' });

    try {
      const { data, error } = await supabase
        .from('course_progress')
        .select('chapter_id, completed_at')
        .eq('user_id', userId);

      if (error) throw error;
      return res.status(200).json({ progress: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST — mark chapter complete
  if (req.method === 'POST') {
    const { user_id, chapter_id } = req.body;
    if (!user_id || !chapter_id) {
      return res.status(400).json({ error: 'Missing user_id or chapter_id' });
    }

    try {
      const { error } = await supabase
        .from('course_progress')
        .upsert({ user_id, chapter_id }, { onConflict: 'user_id,chapter_id' });

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // DELETE — unmark chapter
  if (req.method === 'DELETE') {
    const { user_id, chapter_id } = req.body;
    if (!user_id || !chapter_id) {
      return res.status(400).json({ error: 'Missing user_id or chapter_id' });
    }

    try {
      const { error } = await supabase
        .from('course_progress')
        .delete()
        .eq('user_id', user_id)
        .eq('chapter_id', chapter_id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
