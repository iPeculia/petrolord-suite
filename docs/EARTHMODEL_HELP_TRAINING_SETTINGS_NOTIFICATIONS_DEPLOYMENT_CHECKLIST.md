# Deployment Checklist

## Pre-Deployment
- [x] **Code Review**: All pull requests merged and approved.
- [x] **Testing**: Unit and Integration tests passed (Coverage > 80%).
- [x] **Documentation**: User guides and API docs updated.
- [x] **Security**: Vulnerability scan completed; API keys rotated.
- [x] **Backup**: Database snapshot taken.

## Deployment
- [ ] **Environment**: Set `NODE_ENV=production`.
- [ ] **Database**: Run `supabase migration up`.
- [ ] **Functions**: Deploy `help-search`, `notification-delivery`.
- [ ] **Build**: Run `npm run build`.
- [ ] **Deploy**: Push to hosting provider (Vercel/Netlify/AWS).

## Post-Deployment
- [ ] **Sanity Check**: Log in, verify dashboard loads.
- [ ] **Smoke Test**: Send test notification, search help, update setting.
- [ ] **Monitoring**: Check error logs for 5xx errors.
- [ ] **Communication**: Send "New Features" announcement to users.