# Web Đánh Cờ & Học Cờ Online (AI Stockfish)

## Giới thiệu

Web này cho phép người dùng:

* Chơi cờ vua trực tuyến với người khác hoặc với AI Stockfish
* Học cờ qua bài học, video và chiến thuật
* Giải puzzle và bài tập cờ theo độ khó
* Phân tích ván cờ bằng Stockfish từ PGN hoặc FEN


---

## Chức năng chính

**Người chơi có thể:**

* Chơi cờ online realtime, tạo phòng hoặc ghép ngẫu nhiên
* Chơi với AI Stockfish với nhiều mức độ khác nhau
* Xem bài học, video, hướng dẫn chiến thuật
* Giải puzzle: mate in 1, mate in 2, fork, pin…
* Phân tích ván cờ: gợi ý nước đi, đánh giá vị trí
* Lưu lịch sử ván đấu, Elo và thông tin cá nhân
* Chat trực tiếp trong phòng cờ

**Quản trị viên có thể:**

* Quản lý người dùng
* Thêm, sửa, xoá puzzle
* Quản lý bài học
* Theo dõi thống kê trận đấu

---

## Công nghệ sử dụng

**Frontend:** ReactJS / Next.js, Chessboard.jsx hoặc Chessground, Stockfish WebAssembly, Socket.IO client, TailwindCSS

**Backend:** Node.js (Express hoặc NestJS), Socket.IO server, Chess.js, Stockfish, REST API

**Database:** MongoDB hoặc PostgreSQL

---

## Ngôn ngữ lập trình

* Frontend: JavaScript / TypeScript
* Backend: JavaScript / TypeScript
* AI Engine: C++ (Stockfish) hoặc JavaScript (WASM)
* Database: Mongo Query hoặc SQL

---

## Thuật toán chính

* Kiểm tra nước đi hợp lệ bằng Chess.js, cập nhật FEN và lịch sử nước đi
* AI Stockfish sử dụng Minimax + Alpha-Beta, NNUE, Iterative Deepening
* Gửi FEN đến Stockfish để nhận nước đi tốt nhất và điểm đánh giá
* Phân tích ván: nhập PGN → Stockfish → nhận nước tốt nhất và đánh giá
* Puzzle: chọn theo Elo và độ khó, kiểm tra nước đi đúng/sai bằng Chess.js

---

## Luồng hoạt động

**Chơi với AI:** người chơi đi → board cập nhật → gửi FEN → Stockfish → nhận nước AI → render

**Chơi online:** Player A đi → Server → Player B nhận (realtime bằng Socket.IO)

**Phân tích ván:** nhập PGN → Backend → Stockfish → trả kết quả → hiển thị cho người dùng

---

## Kết luận

Web cung cấp:

* Chơi cờ trực tuyến realtime với người khác hoặc AI
* Học cờ, giải puzzle và phân tích ván cờ bằng Stockfish
* Kiến trúc Frontend React + Backend Node + Socket.IO
