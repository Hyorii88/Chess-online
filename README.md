# Chess Learning Platform

Nền tảng học và chơi cờ vua trực tuyến với AI, puzzles, lessons và multiplayer.

## 📋 Yêu Cầu Hệ Thống

### Phần mềm cần thiết:
- **Node.js**: v18.0.0 trở lên ([Download](https://nodejs.org/))
- **npm**: v9.0.0 trở lên (đi kèm với Node.js)
- **MongoDB**: v5.0 trở lên ([Download](https://www.mongodb.com/try/download/community))
- **Git**: Để clone repository

### Kiểm tra phiên bản đã cài:
```bash
node --version
npm --version
mongod --version
```

---

## 🚀 Cài Đặt và Chạy Project

### 1. Clone Repository (nếu chưa có)
```bash
git clone <repository-url>
cd chess-learning-platform
```

### 2. Cài Đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
# Copy nội dung bên dưới vào file .env
```

**File `backend/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chess-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Cài Đặt Frontend

```bash
# Di chuyển vào thư mục frontend (từ root)
cd ../frontend

# Cài đặt dependencies
npm install

# Tạo file .env.local
# Copy nội dung bên dưới vào file .env.local
```

**File `frontend/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Khởi Động MongoDB

**Trên Windows:**
```bash
# Mở terminal mới và chạy:
mongod
```

**Trên Mac/Linux:**
```bash
# Khởi động MongoDB service
sudo systemctl start mongod
# hoặc
brew services start mongodb-community
```

### 5. Chạy Backend Server

```bash
# Trong thư mục backend
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

### 6. Chạy Frontend Server

```bash
# Mở terminal mới, trong thư mục frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

---

## 📂 Cấu Trúc Project

```
chess-learning-platform/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── sockets/        # Socket.IO handlers
│   │   └── server.js       # Main backend file
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js pages (App Router)
│   │   ├── components/    # React components
│   │   └── lib/          # Utilities, API clients
│   ├── package.json
│   └── .env.local
│
└── README.md
```

---

## 🎮 Hướng Dẫn Sử Dụng

### Đăng Ký / Đăng Nhập
1. Truy cập `http://localhost:3000`
2. Click "Get Started Free" để đăng ký tài khoản mới
3. Hoặc "Sign In" nếu đã có tài khoản

### Tính Năng Chính

#### 🏠 Lobby (Sảnh Chờ)
- **Play vs AI**: Chơi với Stockfish AI (levels 1-20)
- **Quick Match**: Tìm đối thủ cùng trình độ
- **Create Room**: Tạo phòng riêng và mời bạn bè

#### 🧩 Puzzles
- Giải các bài tập chiến thuật
- Từ Mate in 1 đến các tình huống phức tạp

#### 📚 Learn
- Video lessons từ Grandmaster Yasser Seirawan
- Khai cuộc, chiến thuật, cờ tàn

#### 🔍 Analyze
- Phân tích ván đấu với Stockfish engine
- Xem nước đi tốt nhất
- Đánh giá vị thế

#### 🤖 Chess Bot
- AI chatbot tư vấn chiến thuật
- Hỏi đáp về cờ vua

---

## ⚙️ Scripts Hữu Ích

### Backend
```bash
npm run dev          # Chạy development server với nodemon
npm start            # Chạy production server
```

### Frontend
```bash
npm run dev          # Chạy development server
npm run build        # Build cho production
npm start            # Chạy production build
npm run lint         # Kiểm tra code style
```

---

## 🐛 Troubleshooting

### Lỗi: MongoDB connection failed
- ✅ Kiểm tra MongoDB đã chạy chưa: `mongod`
- ✅ Kiểm tra `MONGODB_URI` trong `.env` đúng chưa

### Lỗi: Port already in use
```bash
# Kill process đang dùng port 3000 (frontend)
npx kill-port 3000

# Kill process đang dùng port 5000 (backend)
npx kill-port 5000
```

### Lỗi: CORS / Cannot connect to backend
- ✅ Backend server có đang chạy không?
- ✅ Kiểm tra `NEXT_PUBLIC_API_URL` trong `frontend/.env.local`
- ✅ Clear browser cache và hard refresh (Ctrl + Shift + R)

### Lỗi: Infinite refresh loop khi đăng nhập
```bash
# Xóa build cache và restart
cd frontend
rm -rf .next
npm run dev
```

Sau đó clear localStorage trong browser:
- F12 → Application → Local Storage → Clear

---

## 🔧 Cấu Hình Nâng Cao

### Thay đổi Port

**Backend** (`backend/.env`):
```env
PORT=5001  # Thay vì 5000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

### Truy cập từ thiết bị khác trong cùng mạng LAN

1. Tìm IP của máy chủ:
```bash
# Windows
ipconfig

# Mac/Linux  
ifconfig
```

2. Truy cập từ thiết bị khác:
```
http://<IP-cua-may-chu>:3000
```

Ví dụ: `http://192.168.1.100:3000`

---

## 📝 Notes

- Development servers có **hot reload** - code thay đổi sẽ tự động cập nhật
- MongoDB data được lưu ở `mongodb://localhost:27017/chess-platform`
- JWT tokens hết hạn sau 7 ngày
- Stockfish AI chạy qua API (backend gọi external service)

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console logs (F12 trong browser)
2. Backend terminal output
3. MongoDB logs

---

## 🎯 Quick Start (TL;DR)

```bash
# Terminal 1 - MongoDB
mongod

# Terminal 2 - Backend
cd backend
npm install
npm run dev

# Terminal 3 - Frontend  
cd frontend
npm install
npm run dev

# Mở browser: http://localhost:3000
```

**Happy Coding! ♟️**
