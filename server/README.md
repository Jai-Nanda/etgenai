# Spending Storyboard Backend

A production-ready Node.js + Express + PostgreSQL backend for the Spending Storyboard application.

## 🚀 Features

- **Authentication**: JWT-based user auth with bcrypt password hashing
- **File Upload**: Secure CSV file upload with Multer
- **Data Processing**: Smart CSV parsing with auto-categorization
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful APIs with proper error handling
- **Security**: Helmet, CORS, input validation
- **Insights**: Real-time spending analysis and recommendations

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## 🛠️ Installation

1. **Clone and navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp env.example .env
```

4. **Configure your `.env` file:**
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

5. **Set up PostgreSQL database:**
```sql
CREATE DATABASE spending_storyboard;
```

6. **Run database migrations:**
```bash
npm run db:push
```

7. **Seed database with demo data (optional):**
```bash
npm run db:seed
```

## 🏃‍♂️ Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### User Model
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `passwordHash`: Bcrypt hashed password
- `createdAt`, `updatedAt`: Timestamps

### Transaction Model
- `id`: Primary key
- `userId`: Foreign key to User
- `uploadedFileId`: Foreign key to UploadedFile (optional)
- `date`: Transaction date
- `description`: Transaction description
- `amount`: Transaction amount
- `type`: Transaction type (income/expense)
- `category`: Auto-categorized spending category
- `sourceFileName`: Original CSV filename
- `createdAt`, `updatedAt`: Timestamps

### UploadedFile Model
- `id`: Primary key
- `userId`: Foreign key to User
- `originalName`: Original filename
- `fileName`: Stored filename
- `filePath`: File path on server
- `fileSize`: File size in bytes
- `mimeType`: File MIME type
- `status`: Processing status (uploaded/processed/failed)
- `createdAt`, `updatedAt`: Timestamps

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### File Upload
- `POST /api/upload/csv` - Upload CSV file
- `GET /api/upload/history` - Get upload history
- `DELETE /api/upload/:fileId` - Delete upload and transactions

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/transactions` - Get transactions with pagination

### Insights
- `GET /api/insights` - Get spending insights and analysis

### Health Check
- `GET /health` - Server health status

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Database and environment config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app configuration
│   └── server.js        # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── uploads/             # Temporary file upload directory
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Request body validation
- **File Upload Security**: File type and size validation
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers
- **SQL Injection Prevention**: Prisma ORM

## 📈 CSV Processing

The backend automatically processes CSV files with:

- **Smart Parsing**: Handles various CSV formats
- **Auto-categorization**: Rules-based category assignment
- **Data Normalization**: Consistent data structure
- **Error Handling**: Graceful error management
- **File Cleanup**: Automatic temporary file deletion

### Supported CSV Columns
- Date/Transaction Date
- Description/Narration/Particulars
- Amount
- Debit/Credit
- Type
- Category

### Auto-categorization Rules
- Food: swiggy, zomato, cafe, restaurant, pizza, etc.
- Travel: uber, ola, metro, petrol, taxi, etc.
- Shopping: amazon, flipkart, myntra, store, etc.
- Entertainment: netflix, spotify, movie, gaming, etc.
- Education: fee, course, books, college, etc.
- Health: hospital, clinic, pharmacy, medicine, etc.
- Bills: electricity, water, rent, recharge, etc.
- Income: salary, refund, deposit, bonus, etc.

## 🧪 Testing Demo Accounts

After seeding the database, you can use these demo accounts:

- **Email**: demo@example.com | **Password**: demo123456
- **Email**: test@example.com | **Password**: test123456

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start with nodemon

# Database
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed demo data

# Production
npm start                # Start production server
```

## 🚀 Deployment

1. **Set production environment variables**
2. **Build the application**: `npm install --production`
3. **Run database migrations**: `npm run db:migrate`
4. **Start the server**: `npm start`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiration time | 7d |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `MAX_FILE_SIZE` | Max file size in bytes | 5242880 |
| `UPLOAD_DIR` | Upload directory | ./uploads |

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

### File Upload Issues
- Check uploads directory permissions
- Verify file size limits
- Ensure CSV format is valid

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration
- Ensure proper Authorization header

## 📞 API Response Format

All APIs return consistent JSON responses:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔄 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **CORS** is configured for the frontend URL
2. **JWT tokens** are stored in localStorage
3. **API client** handles authentication automatically
4. **Error handling** provides user-friendly messages

## 📄 License

MIT License
