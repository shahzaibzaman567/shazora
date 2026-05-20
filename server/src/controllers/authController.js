const sanitizeReturnTo = (raw) => {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return null;
  return trimmed;
};

const getClientUrl = (req) =>
  (process.env.CLIENT_URL || process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173').replace(/\/+$/, '');

const buildSafeUser = (user) => ({
  _id: user._id,
  id: user._id,
  googleId: user.googleId || '',
  name: user.name,
  email: user.email,
  profilePicture: user.profilePicture || '',
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
});

export const saveReturnTo = (req, res, next) => {
  const returnTo = sanitizeReturnTo(req.query.returnTo);
  if (returnTo) {
    req.session.returnTo = returnTo;
  } else {
    delete req.session.returnTo;
  }

  if (req.query.popup === 'true') {
    req.session.isPopup = true;
  } else {
    delete req.session.isPopup;
  }
  next();
};

export const completeGoogleAuth = (req, res) => {
  const params = new URLSearchParams();
  const returnTo = sanitizeReturnTo(req.session.returnTo);
  const isPopup = req.session.isPopup;

  delete req.session.returnTo;
  delete req.session.isPopup;

  if (returnTo) {
    params.set('returnTo', returnTo);
  }
  if (isPopup) {
    params.set('popup', 'true');
  }

  const redirectUrl = `${getClientUrl(req)}/auth/google/success${params.toString() ? `?${params.toString()}` : ''}`;
  res.redirect(redirectUrl);
};

export const failGoogleAuth = (req, res) => {
  const isPopup = req.session.isPopup;
  delete req.session.returnTo;
  delete req.session.isPopup;

  const params = new URLSearchParams();
  params.set('google_error', 'oauth_failed');
  if (isPopup) {
    params.set('popup', 'true');
  }
  res.redirect(`${getClientUrl(req)}/login?${params.toString()}`);
};

export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  return res.json(buildSafeUser(req.user));
};

export const logoutUser = (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      res.clearCookie('jwt');
      return res.json({ message: 'Logged out successfully' });
    });
  });
};
