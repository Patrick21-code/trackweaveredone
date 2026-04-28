# TrackWeave Scripts

This folder contains utility scripts for managing the TrackWeave project.

## Available Scripts

### Dashboard Migration

#### `migrate-to-new-dashboard.sh` (Linux/Mac)
Migrates from the old MusicBrainz API-based dashboard to the new local artist registry dashboard.

**Usage:**
```bash
chmod +x scripts/migrate-to-new-dashboard.sh
./scripts/migrate-to-new-dashboard.sh
```

#### `migrate-to-new-dashboard.bat` (Windows)
Windows version of the dashboard migration script.

**Usage:**
```cmd
scripts\migrate-to-new-dashboard.bat
```

**What it does:**
1. Backs up your current `dashboard.html` to `dashboard-old.html`
2. Replaces `dashboard.html` with the new simplified version
3. Verifies all required files are present
4. Provides a summary of changes

## Manual Migration

If you prefer to migrate manually:

1. **Backup current dashboard:**
   ```bash
   cp src/pages/dashboard.html src/pages/dashboard-old.html
   ```

2. **Install new dashboard:**
   ```bash
   cp src/pages/dashboard-new.html src/pages/dashboard.html
   ```

3. **Verify files exist:**
   - `src/scripts/available-artists.js`
   - `src/scripts/dashboard-simple.js`
   - `src/data/graph_data/` (with CSV files)

## Rollback

To rollback to the old dashboard:

```bash
# Linux/Mac
cp src/pages/dashboard-old.html src/pages/dashboard.html

# Windows
copy src\pages\dashboard-old.html src\pages\dashboard.html
```

## Documentation

For detailed information about the dashboard update, see:
- `docs/DASHBOARD_AVAILABLE_ARTISTS_UPDATE.md`

## Support

If you encounter any issues during migration:
1. Check the browser console for JavaScript errors
2. Verify all files are in the correct locations
3. Ensure you're running the script from the project root directory
4. Review the documentation in the `docs/` folder
