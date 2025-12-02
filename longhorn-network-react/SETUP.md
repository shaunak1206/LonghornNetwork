# 📦 Longhorn Network - Setup & Running Instructions

Complete guide to set up and run the Longhorn Network React application.

## 🎯 Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software

1. **Node.js** (version 14.0 or higher)
   - Download from: https://nodejs.org/
   - Check installation: `node --version`
   - Recommended: Use LTS (Long Term Support) version

2. **npm** (version 6.0 or higher)
   - Comes bundled with Node.js
   - Check installation: `npm --version`

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/
   - Check installation: `git --version`

### System Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB free space
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## 🚀 Installation Steps

### Step 1: Navigate to the React App Directory

```bash
# From the root LonghornNetwork directory
cd longhorn-network-react
```

### Step 2: Install Dependencies

This command installs all required packages listed in `package.json`:

```bash
npm install
```

**What gets installed:**
- React (UI library)
- TypeScript (type safety)
- React Scripts (build tools)
- Testing libraries
- Development dependencies

**Expected output:**
```
added 1333 packages in 25s
```

**Note:** If you see security warnings, they can typically be ignored for development. If you want to fix them:

```bash
npm audit fix
```

### Step 3: Start the Development Server

```bash
npm start
```

**What happens:**
1. Compiles TypeScript files
2. Bundles JavaScript and CSS
3. Starts local development server
4. Opens browser automatically at http://localhost:3000

**Expected output:**
```
Compiled successfully!

You can now view longhorn-network-react in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

### Step 4: Explore the Application

Once the browser opens:

1. **Test Case 1** loads by default
2. Click through different test cases to see different student networks
3. Try running the algorithms:
   - "Match Roommates" - Gale-Shapley algorithm
   - "Form Pods" - Prim's algorithm
   - "Run Social Sim" - Threading simulation
4. Use the referral path finder:
   - Select a student
   - Enter "DummyCompany" (for Test Case 2) or "Google" (for Test Case 1)
   - Click "Find Path"

## 📋 Available Commands

### Development

```bash
# Start development server with hot reload
npm start
```

### Production Build

```bash
# Create optimized production build
npm run build
```

This creates a `build/` folder with:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Ready for deployment

### Testing (if tests are added)

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --watchAll=false
```

### Code Quality

```bash
# Check TypeScript types
npx tsc --noEmit

# Format code (if prettier is installed)
npx prettier --write "src/**/*.{ts,tsx,css}"
```

## 🐛 Troubleshooting

### Issue 1: Port 3000 Already in Use

**Error:**
```
? Something is already running on port 3000.
```

**Solutions:**

Option A - Use different port:
```bash
# macOS/Linux
PORT=3001 npm start

# Windows (PowerShell)
$env:PORT=3001; npm start

# Windows (Command Prompt)
set PORT=3001 && npm start
```

Option B - Kill existing process:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Issue 2: Module Not Found

**Error:**
```
Module not found: Can't resolve './models/Student'
```

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: TypeScript Errors

**Error:**
```
Type 'X' is not assignable to type 'Y'
```

**Solutions:**
1. Check TypeScript version: `npx tsc --version`
2. Regenerate types: `npm run build`
3. Restart IDE/editor
4. Clear TypeScript cache:
   ```bash
   rm -rf node_modules/.cache
   ```

### Issue 4: Blank Page After Start

**Possible causes:**
1. JavaScript errors in console (press F12 to check)
2. Browser cache issues
3. Build artifacts from previous version

**Solutions:**
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (macOS)
2. Clear browser cache
3. Try in incognito/private window
4. Rebuild:
   ```bash
   rm -rf node_modules/.cache
   npm start
   ```

### Issue 5: Slow Performance

**If the app is slow:**
1. Close other browser tabs
2. Disable browser extensions
3. Check system resources (RAM, CPU)
4. Use production build instead:
   ```bash
   npm run build
   npx serve -s build
   ```

## 🌐 Accessing from Other Devices

To access the app from another device on the same network:

1. Find your local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

2. Use the IP shown in the terminal output:
   ```
   On Your Network:  http://192.168.1.x:3000
   ```

3. Access from other device's browser:
   ```
   http://YOUR_IP:3000
   ```

## 📱 Mobile Testing

To test on mobile devices:

1. Ensure mobile device is on same WiFi network
2. Access using the "On Your Network" URL
3. Alternatively, use browser developer tools:
   - Chrome: F12 → Toggle device toolbar (Ctrl+Shift+M)
   - Firefox: F12 → Responsive Design Mode (Ctrl+Shift+M)

## 🚢 Deployment Options

### Option 1: Static Hosting (Vercel, Netlify)

```bash
# Build
npm run build

# Deploy to Vercel
npx vercel --prod

# Deploy to Netlify
npx netlify deploy --prod --dir=build
```

### Option 2: GitHub Pages

```bash
# Add homepage to package.json
# "homepage": "https://yourusername.github.io/longhorn-network"

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy scripts to package.json
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
EXPOSE 3000
```

```bash
docker build -t longhorn-network .
docker run -p 3000:3000 longhorn-network
```

## 🔧 Environment Configuration

Create `.env` file in root for custom configuration:

```bash
# Port (default: 3000)
PORT=3001

# Open browser automatically (default: true)
BROWSER=none

# Enable source maps in production (default: false)
GENERATE_SOURCEMAP=false
```

## 💡 Development Tips

1. **Hot Reload**: Changes to files automatically refresh the browser
2. **Console Logs**: Check browser console (F12) for algorithm outputs
3. **React DevTools**: Install React DevTools browser extension for debugging
4. **TypeScript Errors**: Run `npx tsc --noEmit` to check types without building

## 📞 Getting Help

If you encounter issues not covered here:

1. Check browser console for errors (F12)
2. Review terminal output for build errors
3. Ensure all prerequisites are installed correctly
4. Try the troubleshooting steps above
5. Contact the development team

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] App opens in browser at http://localhost:3000
- [ ] No errors in browser console (F12)
- [ ] Test Case 1 loads and shows 6 students
- [ ] Graph visualization displays correctly
- [ ] "Match Roommates" button creates roommate pairs
- [ ] "Form Pods" button creates 3 groups
- [ ] Referral path finder works with "Google"
- [ ] All 5 view tabs (Graph, Roommates, Pods, Referrals, Social) are accessible
- [ ] Student cards display at bottom of page

## 🎉 Success!

If all steps completed successfully, you're ready to use Longhorn Network!

**Quick Test:**
1. Click "Test Case 2"
2. Enter "DummyCompany" in the company input
3. Click "Find Path"
4. You should see a referral path from Greg → Helen → Ivy

**Hook 'em Horns!** 🤘
