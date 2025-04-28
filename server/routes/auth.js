const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// create user  
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (error) {
        console.error('Signup error:', error.message);
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'User created successfully', user: data.user });
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(401).json({ error: error.message });
    }

    const { access_token, refresh_token, user } = data.session;

    res.json({
        message: 'Login successful',
        token: access_token,
        refresh_token: refresh_token,
        user: user,
    });
});

module.exports = router;
