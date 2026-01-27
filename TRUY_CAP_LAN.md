# 🌐 Truy cập từ máy khác (LAN)

## 🚀 CÁCH ĐƠN GIẢN

### Bước 1: Kết nối cùng mạng

**Cả 2 máy phải cùng WiFi/mạng:**
- Mobile Hotspot (khuyên dùng), hoặc
- WiFi nhà, hoặc
- Router cá nhân

> ⚠️ **Không dùng WiFi trường PHENIKAA-STUDENT** (bị chặn)

---

### Bước 2: Chạy project

```bash
npm run dev
```

---

### Bước 3: Lấy IP máy HOST

```cmd
ipconfig
```

Tìm dòng `IPv4 Address`, ví dụ: `192.168.1.100`

---

### Bước 4: Truy cập từ máy khác

Mở browser trên **máy KHÁC** và gõ:

```
http://192.168.1.100:3000
```

(Thay `192.168.1.100` bằng IP thực tế của bạn)

**XONG!** 🎉

---

## 📱 Mobile Hotspot (Nếu WiFi trường bị chặn)

### Trên máy HOST:

```
1. Win + I (Settings)
2. Network & Internet → Mobile hotspot
3. Bật ON
4. Nhớ tên và mật khẩu hotspot
```

### Trên máy KHÁC:

```
1. Kết nối vào hotspot vừa tạo
2. Truy cập http://[IP]:3000
```

---

## 🔍 Troubleshooting

### Máy khác không vào được?

#### 1. Kiểm tra cùng mạng
```cmd
# Từ máy KHÁC
ping [IP-của-máy-HOST]
```

Phải thấy `Reply from...`

#### 2. Kiểm tra Firewall (nếu cần)

**Cách 1: Tắt Firewall tạm thời**
```
Win + I → Windows Security → Firewall
→ Tắt firewall trên mạng Private
```

**Cách 2: Allow Node.js**
```
Win + R → control firewall.cpl → Enter
→ Allow an app → Add → Tìm node.exe → OK
```

---

## ✅ Checklist

- [ ] Cả 2 máy cùng WiFi/mạng
- [ ] `npm run dev` đang chạy
- [ ] Đã lấy IP bằng `ipconfig`
- [ ] Thử `ping` từ máy khác → OK
- [ ] Truy cập `http://[IP]:3000`

---

## 📊 Các địa chỉ

| Từ đâu | Địa chỉ |
|--------|---------|
| **Máy HOST** (máy chạy project) | `http://localhost:3000` |
| **Máy KHÁC** (cùng mạng) | `http://192.168.x.x:3000` |
| **Điện thoại** (cùng WiFi) | `http://192.168.x.x:3000` |

---

**Cập nhật:** 2026-01-27  
**Đơn giản, không cần ngrok!** 🎮
