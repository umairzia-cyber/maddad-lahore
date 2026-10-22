# Maddadgaar Purple UI & Original Theme Backup

This directory contains the exact, untouched backup of the purple/violet color scheme and UI components saved on October 23, 2026, before transitioning Maddadgaar to the Editorial Humanism + Swiss Minimalism design system for the general classifieds marketplace.

### Files Backed Up:
1. `globals.css` - Full purple theme stylesheet containing all CSS variables (`--primary: #7c3aed`, `--accent: #f59e0b`, dark mode styles, custom gradients, utility classes).
2. `Marketplace.tsx` - The purple-themed marketplace component with technician bidding filters and cards.
3. `PostJob.tsx` - The original repair request posting flow with plumbing/electrical wizard steps.
4. `UnifiedMaddadApp.tsx` - App shell with pilot demo switcher and purple branding.
5. `TrustStrip.tsx` & `SiteFooter.tsx` - Navigation and footer components.
6. `shared.tsx` - Shared modal and card elements.

### How to Revert Back:
If the team or user wants to restore the purple color scheme and previous UI:
```bash
cp backup_purple_ui/globals.css src/app/globals.css
cp backup_purple_ui/Marketplace.tsx src/components/maddad/Marketplace.tsx
cp backup_purple_ui/PostJob.tsx src/components/maddad/PostJob.tsx
cp backup_purple_ui/UnifiedMaddadApp.tsx src/components/UnifiedMaddadApp.tsx
cp backup_purple_ui/TrustStrip.tsx src/components/TrustStrip.tsx
cp backup_purple_ui/SiteFooter.tsx src/components/SiteFooter.tsx
cp backup_purple_ui/shared.tsx src/components/maddad/shared.tsx
```
