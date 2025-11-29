# MongoDB Setup Guide for AgriCraft

## Option 1: MongoDB Atlas (Cloud - Recommended) ⭐ Recommended

MongoDB Atlas is a free cloud database service. No installation required!

### Steps:

1. **Create a free account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a cluster:**
   - After logging in, click "Build a Database"
   - Choose the FREE tier (M0)
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Create a database user:**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter a username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist your IP:**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your current IP
   - Click "Confirm"

5. **Get your connection string:**
   - Go to "Database" in the left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `agricraft` (or leave it to use the default)

6. **Update your .env file:**
   - Open `server/.env`
   - Replace the `MONGODB_URI` line with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/agricraft?retryWrites=true&w=majority
   PORT=4000
   ```

7. **Restart your server:**
   ```powershell
   npm --prefix server run dev
   ```

---

## Option 2: Install MongoDB Locally

### For Windows:

1. **Download MongoDB:**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and run the installer

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Keep default settings
   - Complete the installation

3. **Verify MongoDB is running:**
   ```powershell
   # MongoDB should start automatically as a service
   # Check if it's running:
   net start MongoDB
   ```

4. **Your .env file should already be correct:**
   ```
   MONGODB_URI=mongodb://localhost:27017/agricraft
   PORT=4000
   ```

5. **Restart your server:**
   ```powershell
   npm --prefix server run dev
   ```

---

## Troubleshooting

### If MongoDB connection still fails:

1. **Check if MongoDB is running:**
   ```powershell
   # For local MongoDB:
   net start MongoDB
   ```

2. **Test connection manually:**
   ```powershell
   # If MongoDB is installed locally:
   mongosh
   ```

3. **Check your .env file:**
   - Make sure there are no extra spaces
   - Make sure the password in the connection string is URL-encoded (replace special characters with % codes)

4. **For MongoDB Atlas:**
   - Make sure your IP is whitelisted
   - Make sure your database user password doesn't have special characters that need encoding
   - Try regenerating the connection string

---

## Current Status

Your server is currently running with the **local JSON database** as a fallback. This means:
- ✅ Server is working
- ❌ Cart persistence won't work (carts are stored in MongoDB)
- ❌ Order tracking won't work (orders need MongoDB)
- ✅ Basic functionality will work

**To enable full features, set up MongoDB using one of the options above.**

