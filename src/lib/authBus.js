import { supabase } from './customSupabaseClient';

class AuthBus {
  constructor() {
    this.listeners = [];
    this.initialized = false;
    this.currentSession = null;
    this.currentUser = null;
  }

  initOnce() {
    if (this.initialized) return;
    this.initialized = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      this.currentSession = session;
      this.currentUser = session?.user ?? null;
      this.publish(this.currentSession, this.currentUser);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      // For invited users and password resets, redirect to set-password page
      if (event === 'SIGNED_IN' && (session.user.identities.length === 0 || session.user.last_sign_in_at === null)) {
         const url = new URL(window.location.href);
         const isInvite = url.hash.includes('type=invite') || url.hash.includes('type=recovery');
         if (isInvite) {
            window.location.href = '/set-password' + url.hash;
            return;
         }
      }

      this.currentSession = session;
      this.currentUser = session?.user ?? null;
      this.publish(this.currentSession, this.currentUser);
    });
  }

  subscribe(listener) {
    this.listeners.push(listener);
    // Immediately publish current state to new subscriber
    if (this.initialized) {
      listener(this.currentSession, this.currentUser);
    }
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  publish(session, user) {
    this.listeners.forEach(listener => listener(session, user));
  }

  getSession() {
    return this.currentSession;
  }

  getUser() {
    return this.currentUser;
  }
}

export const authBus = new AuthBus();