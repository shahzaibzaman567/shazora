/**
 * InsForge has been fully replaced by MongoDB + Express.
 * This stub prevents import errors in any legacy code that still references it.
 */
const noop = () => Promise.resolve({ data: null, error: new Error('InsForge removed. Use MongoDB API.') });

const insforge = {
  auth: {
    getCurrentUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: noop,
    signUp: noop,
    signOut: async () => {},
    signInWithOAuth: noop,
    sendResetPasswordEmail: noop,
    exchangeOAuthCode: noop,
    verifyEmail: noop,
    resetPassword: noop,
    exchangeResetPasswordToken: noop,
  },
  database: {
    from: () => ({
      select: () => ({ data: [], error: null, order: () => ({ data: [], error: null }) }),
      insert: noop,
      update: () => ({ eq: () => ({ select: () => ({ single: noop }), data: null, error: null }) }),
      upsert: () => ({ select: () => ({ single: noop }), data: null, error: null }),
      delete: () => ({ eq: noop }),
      eq: () => ({ single: noop, data: null, error: null }),
    }),
  },
  ai: {
    chat: {
      completions: {
        create: noop,
      },
    },
  },
};

export default insforge;
