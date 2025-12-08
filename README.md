# Web Đánh Cờ & Học Cờ Online (AI Stockfish + Chatbot API)

## Giới thiệu

Web này cho phép người dùng:

* Chơi cờ vua trực tuyến với người khác hoặc với AI Stockfish
* Học cờ qua bài học, video và chiến thuật
* Giải puzzle và bài tập cờ theo độ khó
* Phân tích ván cờ bằng Stockfish từ PGN hoặc FEN
* **Tương tác với Chatbot AI qua API** để hỏi đáp về cờ vua, gợi ý chiến thuật, hướng dẫn khai cuộc và giải thích nước đi

---

## Chức năng chính

**Người chơi có thể:**

* Chơi cờ online realtime, tạo phòng hoặc ghép ngẫu nhiên
* Chơi với AI Stockfish với nhiều mức độ khác nhau
* Xem bài học, video, hướng dẫn chiến thuật
* Giải puzzle: mate in 1, mate in 2, fork, pin…
* Phân tích ván cờ: gợi ý nước đi, đánh giá vị trí
* Chat trực tiếp trong phòng cờ
* **Hỏi Chatbot AI qua API về cờ vua, chiến thuật, phân tích nước đi và mẹo chơi**
* Lưu lịch sử ván đấu, Elo và thông tin cá nhân

**Quản trị viên có thể:**

* Quản lý người dùng
* Thêm, sửa, xoá puzzle
* Quản lý bài học
* Theo dõi thống kê trận đấu

---

## Công nghệ sử dụng

**Frontend:** ReactJS / Next.js, Chessboard.jsx hoặc Chessground, Stockfish WebAssembly, Socket.IO client, TailwindCSS

**Backend:** Node.js (Express hoặc NestJS), Socket.IO server, Chess.js, Stockfish, REST API, Chatbot AI tích hợp qua **API bên ngoài** (ví dụ OpenAI GPT API hoặc engine khác)

**Database:** MongoDB hoặc PostgreSQL

---

## Ngôn ngữ lập trình

* Frontend: JavaScript / TypeScript
* Backend: JavaScript / TypeScript
* AI Engine: C++ (Stockfish) hoặc JavaScript (WASM)
* Chatbot: gọi API từ Node.js backend
* Database: Mongo Query hoặc SQL

---

## Thuật toán chính

* Kiểm tra nước đi hợp lệ bằng Chess.js, cập nhật FEN và lịch sử nước đi
* AI Stockfish sử dụng Minimax + Alpha-Beta, NNUE, Iterative Deepening
* Gửi FEN đến Stockfish để nhận nước đi tốt nhất và điểm đánh giá
* Phân tích ván: nhập PGN → Stockfish → nhận nước tốt nhất và đánh giá
* Puzzle: chọn theo Elo và độ khó, kiểm tra nước đi đúng/sai bằng Chess.js
* Chatbot AI: người dùng gửi câu hỏi → Backend gọi **API Chatbot** → nhận câu trả lời → hiển thị trong giao diện chat

---

## Luồng hoạt động

**Chơi với AI:** người chơi đi → board cập nhật → gửi FEN → Stockfish → nhận nước AI → render

**Chơi online:** Player A đi → Server → Player B nhận (realtime bằng Socket.IO)

**Phân tích ván:** nhập PGN → Backend → Stockfish → trả kết quả → hiển thị cho người dùng

**Chatbot AI:** người dùng gửi câu hỏi → Backend gọi API Chatbot → nhận câu trả lời → hiển thị trong chat realtime

---
Web cung cấp:

* Chơi cờ trực tuyến realtime với người khác hoặc AI
* Học cờ, giải puzzle và phân tích ván cờ bằng Stockfish
* Tương tác với Chatbot AI qua API để hỏi đáp và gợi ý chiến thuật
* Kiến trúc Frontend React + Backend Node + Socket.IO + Chatbot API

