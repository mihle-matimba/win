const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Missing env vars' });

  const supabase = createClient(url, key);

  // ── GET /api/profile?user_id=xxx ─────────────────────────────
  if (req.method === 'GET') {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

    const { data, error } = await supabase.auth.admin.getUserById(user_id);
    if (error || !data?.user) return res.status(404).json({ error: 'User not found' });

    const u = data.user;
    return res.status(200).json({
      user: {
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name || '',
        avatar_url: u.user_metadata?.avatar_url || '',
      }
    });
  }

  // ── POST /api/profile ─────────────────────────────────────────
  if (req.method === 'POST') {
    const { action, user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

    // Update display name
    if (action === 'update-name') {
      const { full_name } = req.body;
      if (!full_name) return res.status(400).json({ error: 'Missing full_name' });

      const { data, error } = await supabase.auth.admin.updateUserById(user_id, {
        user_metadata: { full_name }
      });
      if (error) return res.status(400).json({ error: error.message });

      // Return updated user so client can refresh localStorage
      const u = data.user;
      return res.status(200).json({
        user: {
          id: u.id,
          email: u.email,
          full_name: u.user_metadata?.full_name || '',
          avatar_url: u.user_metadata?.avatar_url || '',
        }
      });
    }

    // Upload avatar — accepts { file_base64, file_type, file_name }
    if (action === 'upload-avatar') {
      const { file_base64, file_type, file_name } = req.body;
      if (!file_base64 || !file_type) return res.status(400).json({ error: 'Missing file data' });

      const buffer = Buffer.from(file_base64, 'base64');
      const path = `${user_id}/${file_name || 'avatar'}`;

      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, buffer, { contentType: file_type, upsert: true });

      if (upErr) return res.status(500).json({ error: upErr.message });

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      const avatar_url = urlData?.publicUrl || '';

      // Save avatar_url to user_metadata
      const { data, error } = await supabase.auth.admin.updateUserById(user_id, {
        user_metadata: { avatar_url }
      });
      if (error) return res.status(400).json({ error: error.message });

      const u = data.user;
      return res.status(200).json({
        user: {
          id: u.id,
          email: u.email,
          full_name: u.user_metadata?.full_name || '',
          avatar_url: u.user_metadata?.avatar_url || '',
        }
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
