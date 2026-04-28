#!/bin/bash

# TrackWeave Dashboard Migration Script
# This script migrates from the old MusicBrainz-based dashboard to the new local artist registry dashboard

echo "═══════════════════════════════════════════════════════════"
echo "  TrackWeave Dashboard Migration"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 This script will:"
echo "   1. Backup your current dashboard.html"
echo "   2. Replace it with the new simplified dashboard"
echo "   3. Update navigation links if needed"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration cancelled"
    exit 0
fi

echo ""
echo "🔄 Starting migration..."
echo ""

# Step 1: Backup current dashboard
echo "📦 Backing up current dashboard..."
if [ -f "src/pages/dashboard.html" ]; then
    cp src/pages/dashboard.html src/pages/dashboard-old.html
    echo "✅ Backup created: src/pages/dashboard-old.html"
else
    echo "⚠️  No existing dashboard.html found"
fi

# Step 2: Replace with new dashboard
echo "📝 Installing new dashboard..."
cp src/pages/dashboard-new.html src/pages/dashboard.html
echo "✅ New dashboard installed: src/pages/dashboard.html"

# Step 3: Verify files exist
echo ""
echo "🔍 Verifying installation..."

if [ -f "src/scripts/available-artists.js" ]; then
    echo "✅ available-artists.js found"
else
    echo "❌ available-artists.js missing!"
fi

if [ -f "src/scripts/dashboard-simple.js" ]; then
    echo "✅ dashboard-simple.js found"
else
    echo "❌ dashboard-simple.js missing!"
fi

if [ -d "src/data/graph_data" ]; then
    echo "✅ graph_data folder found"
else
    echo "❌ graph_data folder missing!"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Migration Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Summary:"
echo "   • Old dashboard backed up to: src/pages/dashboard-old.html"
echo "   • New dashboard active at: src/pages/dashboard.html"
echo "   • 22 artists available across 6 genres"
echo ""
echo "🚀 Next steps:"
echo "   1. Test the dashboard in your browser"
echo "   2. Verify all artists are displaying correctly"
echo "   3. Test the search functionality"
echo ""
echo "📖 For more information, see:"
echo "   docs/DASHBOARD_AVAILABLE_ARTISTS_UPDATE.md"
echo ""
