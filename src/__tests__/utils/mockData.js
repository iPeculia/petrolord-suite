export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg'
  }
};

export const mockNotifications = [
  { id: 1, title: 'Test Alert', message: 'This is a test notification', type: 'info', read: false, time: '10m ago' },
  { id: 2, title: 'Critical Error', message: 'System failure imminent', type: 'error', read: true, time: '1h ago' }
];

export const mockHelpArticles = [
  { id: '1', title: 'Getting Started', content: 'Welcome to EarthModel Pro.', category: 'Basics', difficulty: 'Beginner' },
  { id: '2', title: 'Advanced Seismic', content: 'How to interpret seismic data.', category: 'Workflows', difficulty: 'Advanced' }
];

export const mockCourses = [
  { 
    id: 'c1', 
    title: 'EarthModel Essentials', 
    description: 'Learn the basics.', 
    modules: [{ id: 'm1', title: 'Intro' }, { id: 'm2', title: 'Setup' }] 
  },
  { 
    id: 'c2', 
    title: 'Advanced Petrophysics', 
    description: 'Deep dive into logs.', 
    modules: [{ id: 'm3', title: 'Log Analysis' }] 
  }
];

export const mockSettings = {
  theme: 'dark',
  notifications: true,
  autoSave: true,
  density: 'compact'
};