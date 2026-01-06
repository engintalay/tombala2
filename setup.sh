#!/bin/bash

# Tombala Projesi Kurulum Scripti
# Ubuntu/Debian Linux için

set -e  # Hata durumunda çık

echo "=========================================="
echo "Tombala Projesi Kurulum Scripti"
echo "=========================================="
echo ""

# Renk tanımlamaları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Sistem kontrolleri
check_system() {
    echo -e "${BLUE}[1/4] Sistem kontrol ediliyor...${NC}"
    
    # OS kontrolü
    if ! grep -qi "ubuntu\|debian" /etc/os-release; then
        echo -e "${YELLOW}⚠️  Bu script Ubuntu/Debian için tasarlanmıştır.${NC}"
        read -p "Devam etmek istiyor musunuz? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✓ Sistem kontrol edildi${NC}"
    echo ""
}

# Node.js kontrol ve kurulum
check_nodejs() {
    echo -e "${BLUE}[2/4] Node.js kontrol ediliyor...${NC}"
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        NPM_VERSION=$(npm --version)
        echo -e "${GREEN}✓ Node.js zaten kurulu: ${NODE_VERSION}${NC}"
        echo -e "${GREEN}✓ npm: ${NPM_VERSION}${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Node.js kurulu değil, kuruluyor...${NC}"
        install_nodejs
    fi
    echo ""
}

# Node.js kurulumu
install_nodejs() {
    echo -e "${YELLOW}NodeSource repository ekleniyor...${NC}"
    
    # curl var mı kontrol et
    if ! command -v curl &> /dev/null; then
        echo -e "${YELLOW}curl kuruluyor...${NC}"
        sudo apt-get update
        sudo apt-get install -y curl
    fi
    
    # NodeSource repo'sunu ekle
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    
    echo -e "${YELLOW}Node.js kuruluyor...${NC}"
    sudo apt-get install -y nodejs
    
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ Node.js kuruldu: ${NODE_VERSION}${NC}"
    echo -e "${GREEN}✓ npm: ${NPM_VERSION}${NC}"
}

# Bağımlılıkları kur
install_dependencies() {
    echo -e "${BLUE}[3/4] Bağımlılıklar kuruluyor...${NC}"
    
    # package.json var mı kontrol et
    if [ ! -f "package.json" ]; then
        echo -e "${RED}✗ package.json bulunamadı!${NC}"
        echo "Bu scripti proje dizininden çalıştırın."
        exit 1
    fi
    
    if [ -d "node_modules" ]; then
        echo -e "${YELLOW}node_modules zaten var, atlanıyor...${NC}"
    else
        npm install
        echo -e "${GREEN}✓ Bağımlılıklar kuruldu${NC}"
    fi
    echo ""
}

# Kartları oluştur
generate_cards() {
    echo -e "${BLUE}[4/4] Tombala kartları oluşturuluyor...${NC}"
    
    if [ ! -f "cards.json" ]; then
        npm run generate-cards
        echo -e "${GREEN}✓ Kartlar oluşturuldu${NC}"
    else
        echo -e "${YELLOW}cards.json zaten var, atlanıyor...${NC}"
    fi
    echo ""
}

# Kurulum tamamlama mesajı
finish() {
    echo -e "${GREEN}=========================================="
    echo "Kurulum Başarıyla Tamamlandı! ✓"
    echo "==========================================${NC}"
    echo ""
    echo -e "${BLUE}Sunucuyu başlatmak için:${NC}"
    echo -e "${YELLOW}npm start${NC}"
    echo ""
    echo -e "${BLUE}Sunucu açılacak:${NC}"
    echo -e "${YELLOW}http://localhost:3000${NC}"
    echo ""
    echo -e "${BLUE}Kartları yeniden oluşturmak için:${NC}"
    echo -e "${YELLOW}npm run generate-cards${NC}"
    echo ""
}

# Ana fonksiyon
main() {
    # Pwd kontrolü
    if [ ! -f "package.json" ]; then
        echo -e "${RED}Hata: package.json bulunamadı!${NC}"
        echo "Bu scripti Tombala proje dizininden çalıştırın:"
        echo "  cd /home/engin/projects/tombala2"
        echo "  bash setup.sh"
        exit 1
    fi
    
    check_system
    check_nodejs
    install_dependencies
    generate_cards
    finish
}

# Komut satırı argümanlarını işle
case "${1}" in
    --help | -h)
        echo "Kullanım: bash setup.sh [OPTION]"
        echo ""
        echo "Options:"
        echo "  --nodejs-only    Sadece Node.js kur"
        echo "  --deps-only      Sadece bağımlılıkları kur"
        echo "  --cards-only     Sadece kartları oluştur"
        echo "  --help           Bu yardım mesajını göster"
        echo ""
        exit 0
        ;;
    --nodejs-only)
        check_system
        check_nodejs
        ;;
    --deps-only)
        install_dependencies
        ;;
    --cards-only)
        generate_cards
        finish
        ;;
    *)
        main
        ;;
esac
