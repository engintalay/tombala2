# Tombala (Turkish Bingo) - Multiplayer Online Game

A real-time multiplayer Tombala (Turkish Bingo) game built with Node.js, Express, and WebSockets.

### 📊 Sistem Gereksinimleri

| Bileşen | Versiyon | Durum |
|---------|----------|-------|
| Node.js | v12+ | Gerekli |
| npm | v6+ | Gerekli |
| Tarayıcı | Modern | Gerekli |
| RAM | 256MB+ | Minimum |
| Disk | 100MB+ | Minimum |
| OS | Ubuntu 18.04+ | Desteklenen |

**Desteklenen İşletim Sistemleri:**
- Ubuntu 18.04+
- Debian 10+
- Linux Mint
- Windows 10+ (WSL2 ile)
- macOS 10.13+

## 📋 Table of Contents

- [Hızlı Başlangıç (Quick Start)](#hızlı-başlangıç-quick-start)
- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Game Rules](#game-rules)
- [Project Structure](#project-structure)
- [Technical Details](#technical-details)
- [Troubleshooting](#troubleshooting)
- [İleri Konular (Advanced Usage)](#ileri-konular-advanced-usage)
- [Future Improvements](#future-improvements)

## ⚡ Hızlı Başlangıç (Quick Start)

**Ubuntu'da 5 dakikada başlayın:**

### Seçenek 1: Otomatik Kurulum Script'i (Önerilir)

```bash
cd /home/engin/projects/tombala2
bash setup.sh
```

Bu script otomatik olarak:
- Node.js ve npm'i kurar (varsa atlar)
- Bağımlılıkları yükler
- Tombala kartlarını oluşturur
- Sunucuyu başlatmaya hazır hale getirir

### Seçenek 2: Manuel Kurulum

```bash
# 1. Node.js kur (ilk kez yapıyorsanız)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Proje dizinine git
cd /home/engin/projects/tombala2

# 3. Bağımlılıkları kur
npm install

# 4. Sunucuyu başlat
npm start
```

Tarayıcı otomatik olarak `http://localhost:3000` açılacak. Oynanmaya hazır!

**Detaylı kurulum için:** [Installation](#installation) bölümünü okuyun.

### Kurulum Script Seçenekleri

```bash
# Tam kurulum (varsayılan)
bash setup.sh

# Sadece Node.js kur
bash setup.sh --nodejs-only

# Sadece bağımlılıkları kur
bash setup.sh --deps-only

# Sadece kartları oluştur
bash setup.sh --cards-only

# Yardım göster
bash setup.sh --help
```

## 🎯 Overview

Tombala is a traditional Turkish bingo game where players mark numbers on cards as they are drawn randomly. This implementation provides a web-based multiplayer version with real-time synchronization across all connected clients.

## ✨ Features

- **Real-time Multiplayer**: Multiple players can join and play simultaneously
- **WebSocket Communication**: Instant updates across all connected clients
- **Pre-generated Cards**: 24 unique Tombala cards ready to use
- **Player Identification**: Each player enters their name to identify their cards
- **Game States**: Supports Çinko (1 row), Çift Çinko (2 rows), and Tombala (3 rows)
- **Visual Feedback**: Color-coded cards and drawn numbers
- **Automatic Winner Detection**: Server-side validation of winning conditions
- **Game Control**: Only the game starter can draw numbers and reset the game
- **Session Persistence**: Player names are stored in browser session

## 📦 Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Ubuntu/Debian'da Node.js Kurulumu

Aşağıdaki adımları takip ederek Node.js'i Ubuntu sistemine kurun:

#### 1. Sistem Paketlerini Güncelle

```bash
sudo apt update
sudo apt upgrade
```

#### 2. Node.js ve npm Kur (Yöntem 1: APT Paket Yöneticisi)

**Basit kurulum (LTS sürümü):**
```bash
sudo apt install nodejs npm
```

#### 3. Node.js ve npm Kur (Yöntem 2: NodeSource Repository - ÖNERİLEN)

Bu yöntem daha güncel sürümleri sağlar:

```bash
# NodeSource repository'sini ekle
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js ve npm'i kur
sudo apt install -y nodejs
```

Farklı Node.js sürümleri için:
- **Node.js 16.x**: `setup_16.x` kullan
- **Node.js 18.x**: `setup_18.x` kullan (LTS)
- **Node.js 20.x**: `setup_20.x` kullan

#### 4. Kurulumu Doğrula

```bash
node --version
npm --version
```

Çıktı örneği:
```
v18.19.0
9.6.7
```

#### 5. Diğer Gerekli Araçlar

**Git yüklü değilse (opsiyonel ama önerilir):**
```bash
sudo apt install git
```

**Curl yüklü değilse:**
```bash
sudo apt install curl
```

#### 6. Node.js'i Güncellemek

Eğer daha sonra Node.js'i güncellemek isterseniz:

```bash
# APT kullanarak güncelle
sudo apt update
sudo apt upgrade nodejs npm

# Ya da NodeSource yöntemi ile:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Olası Sorunlar ve Çözümleri

**"command not found: nodejs" hatası:**
```bash
# Symlink oluştur
sudo ln -s /usr/bin/node /usr/bin/nodejs
```

**npm izin hatası (EACCES):**
```bash
# npm dizinini konfigüre et
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Bashrc'ye ekle (kalıcı yapmak için)
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**npm cache temizle:**
```bash
npm cache clean --force
```

## 🚀 Installation

### Hızlı Kurulum (Önerilir)

Ubuntu'da kurulumu otomatikleştirmek için:

```bash
cd /home/engin/projects/tombala2
bash setup.sh
```

Bu tek komut:
- ✓ Node.js ve npm'i kurar
- ✓ Bağımlılıkları yükler  
- ✓ Kartları oluşturur
- ✓ Sunucuyu başlatmaya hazır hale getirir

### Adım 1: Node.js Kurulumu

Ubuntu'nuzda Node.js yüklü değilse, yukarıdaki [Ubuntu/Debian'da Node.js Kurulumu](#ubuntudebian'da-nodejs-kurulumu) bölümünü takip edin.

Kurulumu doğrulamak için:
```bash
node --version
npm --version
```

### Adım 2: Projeyi Klon Edin veya İndirin

```bash
cd /home/engin/projects/tombala2
```

### Adım 3: Proje Bağımlılıklarını Yükle

```bash
npm install
```

Bu komut `package.json` dosyasındaki tüm bağımlılıkları indirir:
- `express` - Web sunucu framework'ü
- `ws` - WebSocket kütüphanesi
- `open` - Tarayıcıyı otomatik açar

**Yüklü paketleri kontrol et:**
```bash
npm list
```

### Adım 4: Tombala Kartlarını Oluştur (İsteğe Bağlı)

Yeni kartlar oluşturmak isterseniz:
```bash
npm run generate-cards
```

Bu komut `cards.json` dosyasını 24 benzersiz Tombala kartı ile oluşturacaktır.

### Adım 5: Sunucuyu Başlat

```bash
npm start
```

Başarılı başlangıç mesajı:
```
Server is listening on port 3000
```

Tarayıcı otomatik olarak `http://localhost:3000` adresini açacaktır.

### Ortam Değişkenleri (İsteğe Bağlı)

```bash
# Port numarasını değiştirmek istiyorsanız server.js'de:
# Line 167: server.listen(3000, () => {
# Bunu değiştir: server.listen(process.env.PORT || 3000, () => {

# Sonra kullan:
PORT=3001 npm start
```

### npm Komutları

```bash
# Sunucuyu başlat
npm start

# Kartları oluştur
npm run generate-cards

# Tüm komutları görmek
npm run
```

### Sunucuyu Durdurma

Terminal'de çalışan sunucuyu durdurmak için:
```
Ctrl + C
```

## 🎮 Usage

### Starting the Server

```bash
npm start
```

The server will:
- Start on port 3000
- Automatically open your default browser to `http://localhost:3000`
- Display "Server is listening on port 3000" in the console

### Playing the Game

1. **Enter Your Name**: When you first visit the page, you'll be prompted to enter your name

2. **Load Cards**: Click "Kartları Yükle" (Load Cards) to display all available cards

3. **Select Cards**: Click on cards to select them (they will be highlighted with an orange border)

4. **Start Game**: Click "Oyunu Başlat" (Start Game) to begin
   - Only players who have selected cards can start the game
   - The player who starts becomes the game master

5. **Draw Numbers**: Click "Taş Çek" (Draw Number) to draw random numbers
   - Only the game master can draw numbers
   - Numbers are automatically marked on all cards

6. **Win Conditions**:
   - **Çinko**: First player to complete 1 row (5 numbers)
   - **Çift Çinko**: First player to complete 2 rows (10 numbers)
   - **Tombala**: First player to complete all 3 rows (15 numbers) - wins the game!

7. **Reset Game**: Click "Reset" to start a new game
   - Only the game master can reset
   - Clears all drawn numbers and game states

8. **Reset User**: Click "Reset User" to change your player name

## 📜 Game Rules

### Tombala Card Structure

- Each card is a **3×9 grid** (27 cells total)
- Each card contains **15 numbers** and **12 blank cells**
- Each row has exactly **5 numbers** and **4 blanks**
- Numbers are distributed by columns:
  - Column 1: 1-9
  - Column 2: 10-19
  - Column 3: 20-29
  - Column 4: 30-39
  - Column 5: 40-49
  - Column 6: 50-59
  - Column 7: 60-69
  - Column 8: 70-79
  - Column 9: 80-90

### Winning Conditions

1. **Çinko (Single Line)**: Complete any one row (5 numbers marked)
2. **Çift Çinko (Double Line)**: Complete any two rows (10 numbers marked)
3. **Tombala (Full House)**: Complete all three rows (15 numbers marked)

### Number Drawing

- Numbers are drawn randomly from 1 to 90
- Each number can only be drawn once per game
- The game ends when someone achieves Tombala or all 90 numbers are drawn

## 📁 Project Structure

```
tombala2/
├── server.js                 # Ana sunucu dosyası (WebSocket lojik)
├── generateCards.js          # Kart üretim yardımcısı
├── setup.sh                  # Otomatik kurulum script'i (Ubuntu/Debian)
├── package.json              # Proje bağımlılıkları
├── README.md                 # Bu dosya
├── cards.json                # Önceden oluşturulmuş Tombala kartları
├── otherClientsCards.json    # Seçili kartlar (otomatik oluşturulur)
└── public/
    └── index.html           # Ana istemci arayüzü
```

### Dosya Açıklamaları

- **server.js**: 
  - Express sunucu kurulumu
  - WebSocket bağlantı yönetimi
  - Oyun durumu yönetimi
  - Kazanan algılama lojik
  - Kart seçimi senkronizasyonu

- **generateCards.js**: 
  - Benzersiz Tombala kartları üretir
  - Uygun kart yapısı sağlar (satır başına 5 sayı, toplam 15)
  - Sütun dağılımını doğrular
  - Kartları `cards.json`'a dışa aktarır

- **setup.sh**: 
  - Ubuntu/Debian otomatik kurulum script'i
  - Node.js kurulumunu yönetir
  - Bağımlılıkları yükler
  - Kartları oluşturur
  - Renk çıktısı ile kullanıcı dostu

- **public/index.html**: 
  - İstemci tarafı arayüzü
  - Kart görüntüleme ve seçimi
  - WebSocket istemcisi
  - Görsel sayı işaretleme
  - Oyuncu etkileşimi yönetimi

- **cards.json**: 
  - 24 önceden oluşturulmuş benzersiz Tombala kartı içerir
  - Her kart ID ile tanımlanır (1-24)
  - 27 öğeden oluşan dizi (boş hücreler için null, doldurulmuş hücreler için sayılar)

- **otherClientsCards.json**: 
  - Dinamik olarak güncellenen dosya
  - Şu anda seçili kartları saklar
  - Kartların sahipliğini istemciler arasında senkronize eder
  - Yeni oyun başladığında sıfırlanır

## 🔧 Technical Details

### WebSocket Messages

The application uses WebSocket for real-time communication. Message types include:

**Client to Server:**
- `startGame`: Initiates a new game session
- `drawNumber`: Requests a new number to be drawn
- `resetGame`: Resets the entire game state
- `selectCard`: Registers card selection
- `deselectCard`: Removes card selection

**Server to Client:**
- `init`: Initial connection data (drawn numbers, game state, client color)
- `drawNumber`: Broadcasts newly drawn number
- `startGame`: Notifies all clients that game has started
- `resetGame`: Notifies all clients of game reset
- `selectCard`: Broadcasts card selection to all clients
- `deselectCard`: Broadcasts card deselection
- `cinko`: Announces Çinko winner
- `ciftCinko`: Announces Çift Çinko winner
- `tombala`: Announces Tombala winner (game over)
- `alert`: Displays alert messages

### Color Coding

- **Yellow**: Marked/drawn numbers
- **Light Blue**: Çinko (1 row complete)
- **Light Green**: Çift Çinko (2 rows complete)
- **Light Coral**: Tombala (all rows complete)
- **Orange Border**: Selected cards

### Game State Management

The server maintains:
- `drawnNumbers`: Array of all drawn numbers
- `cinkoAchieved`: Boolean flag for first Çinko
- `ciftCinkoAchieved`: Boolean flag for first Çift Çinko
- `gameStarted`: Boolean indicating if game is active
- `gameStarter`: Reference to the WebSocket connection that started the game

## 🐛 Troubleshooting

### Linux/Ubuntu Spesifik Sorunlar

1. **"command not found: node" veya "command not found: npm":**
   ```bash
   # Node.js yüklü olup olmadığını kontrol et
   node --version
   npm --version
   
   # Yüklü değilse yukarıdaki kurulum adımlarını takip et
   ```

2. **"Permission denied" hatası (sudo şifresi iste):**
   ```bash
   # Sudo olmadan kul
   # Yeniden oturum aç veya:
   source ~/.bashrc
   ```

3. **npm EACCES izin hatası:**
   ```bash
   # npm global kurulumunu düzelt
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   export PATH=~/.npm-global/bin:$PATH
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

4. **Node.js sürüm uyumsuzluğu:**
   ```bash
   # Güncel sürümü kur
   sudo apt update
   sudo apt upgrade nodejs
   
   # Ya da belirli sürümü kur
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

5. **Port 3000 zaten kullanılıyor:**
   ```bash
   # Port 3000'ü kullanan işlemi bul
   sudo lsof -i :3000
   
   # İşlemi kapat
   kill -9 <PID>
   
   # Ya da server.js'de portu değiştir (örn: 3001)
   sed -i 's/server.listen(3000/server.listen(3001/g' server.js
   ```

### Genel Sorunlar

1. **Port 3000 already in use:**
   ```bash
   # Find and kill the process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```
   Or modify the port in [server.js](server.js#L167):
   ```javascript
   server.listen(3001, () => { // Change from 3000 to 3001
   ```

2. **Cards not loading:**
   - Ensure `cards.json` exists
   - Run `npm run generate-cards` to create it
   - Check browser console for errors

3. **WebSocket connection failed:**
   - Verify the server is running
   - Check if firewall is blocking port 3000
   - Ensure you're accessing via `http://localhost:3000`

4. **Cards showing extra blank at the end:**
   - This was fixed in the latest version
   - Card numbers are now properly filtered before sending

5. **"Sadece oyunu başlatan taş çekebilir" (Only game starter can draw):**
   - This is expected behavior
   - Only the player who clicked "Oyunu Başlat" can draw numbers
   - This prevents conflicts in multiplayer games

## 🚀 Future Improvements

### Potential Enhancements

1. **Database Integration**: Store game history and player statistics
2. **Multiple Game Rooms**: Allow multiple simultaneous games
3. **Chat Feature**: Enable player communication
4. **Sound Effects**: Add audio feedback for draws and wins
5. **Mobile Optimization**: Improve responsive design for mobile devices
6. **Admin Panel**: Game monitoring and management interface
7. **Custom Card Sets**: Allow players to generate custom card sets
8. **Replay Feature**: Ability to review previous games
9. **Tournament Mode**: Support for organized tournaments
10. **Authentication**: User accounts and profiles

### Known Limitations

- Single game session at a time
- No persistent storage (games reset on server restart)
- Limited to 24 pre-generated cards
- No reconnection handling for dropped connections
- Manual card selection required (no auto-assignment)

## 🎓 İleri Konular (Advanced Usage)

### Farklı Portta Çalıştırma

```bash
# server.js'de port değiştir
nano server.js

# Satır 167'de:
# server.listen(3000, () => {
# Bunu değiştir:
# server.listen(3001, () => {

# Sonra kaydet (Ctrl+O, Enter, Ctrl+X)
npm start
```

### Geliştirme Modu (Development Mode)

Kod değişikliklerinde otomatik yeniden başlama için `nodemon` kur:

```bash
npm install --save-dev nodemon

# Geliştirme modunda başlat
npx nodemon server.js
```

Sonra `package.json`'u güncelleyin:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "generate-cards": "node generateCards.js"
}
```

Kullanım:
```bash
npm run dev
```

### Arka Planda Çalıştırma (Linux/Ubuntu)

```bash
# nohup kullanarak (terminal kapandıktan sonra da çalışır)
nohup npm start > tombala.log 2>&1 &

# İşlemi listelemek
jobs

# Logları görmek
tail -f tombala.log

# İşlemi durdurmak
pkill -f "node server.js"
```

### PM2 ile Prodüksiyon Kurulumu

```bash
# PM2 kur
npm install -g pm2

# Uygulamayı başlat
pm2 start server.js --name "tombala"

# Otomatik başlama
pm2 startup
pm2 save

# Durum kontrol
pm2 list
pm2 logs tombala

# Durdur/Yeniden başlat
pm2 stop tombala
pm2 restart tombala
pm2 delete tombala
```

### Özel Kart Seti Oluşturma

Farklı sayıda kart oluşturmak için [generateCards.js](generateCards.js#L13):

```javascript
while (cardId <= 24) { // Bunu değiştir (örn: 50 kart)
```

Sonra çalıştır:
```bash
npm run generate-cards
```

### Server Loglarını İnceleme

```bash
# Server çalışırken logları görmek
tail -f tombala.log

# WebSocket mesajlarını görmek
grep "Received message" tombala.log

# Kazanan logları görmek
grep "Achieved" tombala.log
```

## 📝 License

This project is open source and available for educational purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For questions or issues, please check the [Troubleshooting](#troubleshooting) section or open an issue in the project repository.

---

**Enjoy playing Tombala! Good luck! 🍀**
