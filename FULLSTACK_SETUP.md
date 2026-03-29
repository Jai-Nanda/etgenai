# 🚀 Spending Storyboard - Full Stack Setup Guide

A complete guide to set up and run the Spending Storyboard application with both frontend and backend.

## 📋 Prerequisites

### Required Software
- **Node.js** 18+ 
- **PostgreSQL** 14+
- **Git**
- **VS Code** (recommended)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

---

## 🗂️ Project Structure

```
windsurf-project/
├── client/                 # React Frontend (current directory)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── prisma/
│   ├── uploads/
│   ├── package.json
│   └── README.md
└── FULLSTACK_SETUP.md      # This file
```

---

## 🛠️ Setup Instructions

### Step 1: Database Setup

1. **Install PostgreSQL** (if not already installed)
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql`
   - **Ubuntu**: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL Service**
   - **Windows**: Start via Services panel
   - **macOS**: `brew services start postgresql`
   - **Ubuntu**: `sudo systemctl start postgresql`

3. **Create Database**
   ```sql
   -- Open PostgreSQL shell
   psql -U postgres
   
   -- Create database
   CREATE DATABASE spending_storyboard;
   
   -- Create user (optional but recommended)
   CREATE USER storyboard_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE spending_storyboard TO storyboard_user;
   
   -- Exit
   \q
   ```

### Step 2: Backend Setup

1. **Navigate to Server Directory**
   ```bash
   cd server
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit the .env file with your configuration
   notepad .env  # Windows
   code .env     # VS Code
   nano .env     # Linux/macOS
   ```

4. **Update `.env` File**
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/spending_storyboard?schema=public"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   
   # Server
   PORT=5000
   NODE_ENV="development"
   
   # CORS
   FRONTEND_URL="http://localhost:5173"
   
   # File Upload
   MAX_FILE_SIZE="5242880"  # 5MB
   UPLOAD_DIR="./uploads"
   ```

5. **Set Up Database Schema**
   ```bash
   # Push schema to database
   npm run db:push
   
   # (Optional) Seed with demo data
   npm run db:seed
   ```

6. **Start Backend Server**
   ```bash
   # Development mode
   npm run dev
   
   # Or production mode
   npm start
   ```

   **Backend should start at:** `http://localhost:5000`

7. **Verify Backend Health**
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status":"OK",...}
   ```

### Step 3: Frontend Setup

1. **Navigate to Root Directory** (if you're in server/)
   ```bash
   cd ..
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Configure Frontend Environment**
   ```bash
   # Create .env file for frontend
   echo "VITE_API_URL=http://localhost:5000" > .env
   ```

4. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```

   **Frontend should start at:** `http://localhost:5173` or `http://localhost:5174`

---

## 🚀 Running the Application

### Development Mode (Recommended)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# In root directory
npm run dev
```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **Database Studio**: `npm run db:studio` (from server/ directory)

---

## 👤 Demo Accounts

After running `npm run db:seed` in the backend, you can use these accounts:

| Email | Password | Role |
|-------|----------|------|
| demo@example.com | demo123456 | Demo User |
| test@example.com | test123456 | Test User |

---

## 📊 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/profile` - Update profile

### File Upload
- `POST /api/upload/csv` - Upload CSV file
- `GET /api/upload/history` - Upload history
- `DELETE /api/upload/:fileId` - Delete upload

### Dashboard
- `GET /api/dashboard/summary` - Dashboard data
- `GET /api/dashboard/transactions` - Transactions list

### Insights
- `GET /api/insights` - Spending insights

---

## 🧪 Testing the Full Stack

### 1. User Registration
1. Visit http://localhost:5173
2. Click "Sign Up"
3. Create a new account
4. Verify you're redirected to dashboard

### 2. CSV Upload
1. Download sample CSV or create one with columns: Date, Description, Amount
2. Navigate to Upload page
3. Upload the CSV file
4. Check dashboard for processed data

### 3. View Insights
1. Navigate to Insights page
2. View AI-powered spending analysis
3. Check recommendations and patterns

---

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -U postgres -l

# Reset database connection
sudo systemctl restart postgresql
```

#### Backend Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Kill process
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # macOS/Linux
```

#### Frontend-Backend Connection Issues
1. Verify both servers are running
2. Check CORS settings in backend `.env`
3. Ensure `VITE_API_URL` is set correctly
4. Check browser console for CORS errors

#### CSV Upload Fails
1. Verify file is CSV format
2. Check file size < 5MB
3. Ensure user is logged in
4. Check backend logs for errors

#### Permissions Issues (Linux/macOS)
```bash
# Fix file permissions
chmod +x server/src/server.js

# Fix directory permissions
sudo chown -R $USER:$USER server/uploads
```

### Debug Commands

```bash
# Check backend logs
cd server && npm run dev

# Check database connection
cd server && npm run db:studio

# Test API directly
curl -X GET http://localhost:5000/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123456"}'
```

---

## 📝 Environment Variables Explained

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | JWT signing secret | `super-secret-key` |
| `PORT` | Backend server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

---

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in `.env`
2. Use a production database (AWS RDS, etc.)
3. Set strong `JWT_SECRET`
4. Use HTTPS
5. Configure reverse proxy (nginx)

### Frontend Deployment  
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update `VITE_API_URL` to production backend

---

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🆘 Support

If you encounter issues:

1. **Check logs** in both frontend and backend terminals
2. **Verify environment variables** are correctly set
3. **Ensure database is running** and accessible
4. **Check network connectivity** between frontend and backend
5. **Review troubleshooting section** above

For additional help, check the individual README files:
- `server/README.md` - Backend specific documentation
- `package.json` scripts and dependencies

---

## 🎉 Success!

You should now have a fully functional full-stack Spending Storyboard application running locally! 

**Next Steps:**
1. Create an account or use demo credentials
2. Upload a CSV file with transaction data
3. Explore the dashboard and insights
4. Customize the application to your needs

Happy coding! 🚀
