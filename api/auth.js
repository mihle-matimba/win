const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  const supabase = createClient(url, key);
  const { action, email, password, name } = req.body;

  try {
    // ── Sign Up ──
    if (action === 'sign-up') {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name: name },
        email_confirm: true,
      });

      if (error) return res.status(400).json({ error: error.message });

      // Sign them in immediately
      const { data: signIn, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });

      if (signInErr) {
        return res.status(200).json({ confirmEmail: true });
      }

      return res.status(200).json({
        user: signIn.user,
        session: signIn.session,
      });
    }

    // ── Sign In ──
    if (action === 'sign-in') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) return res.status(401).json({ error: error.message });

      return res.status(200).json({
        user: data.user,
        session: data.session,
      });
    }

    // ── Reset Password ──
    if (action === 'reset-password') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${req.headers.origin || 'https://win-trading.vercel.app'}/designs/auth`,
      });

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
