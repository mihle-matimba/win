const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  try {
    const supabase = createClient(url, key);

    const [coursesRes, chaptersRes] = await Promise.all([
      supabase.from('courses').select('*').eq('published', true).order('sort_order'),
      supabase.from('course_chapters').select('*').eq('published', true).order('sort_order'),
    ]);

    if (coursesRes.error) throw coursesRes.error;
    if (chaptersRes.error) throw chaptersRes.error;

    return res.status(200).json({
      courses: coursesRes.data,
      chapters: chaptersRes.data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
