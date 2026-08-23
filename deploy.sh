#!/bin/bash

# Script tự động deploy lên VPS
# Sử dụng: ./deploy.sh your-vps-ip [ssh-port]
# Ví dụ: ./deploy.sh 103.56.161.203 24700

set -e

VPS_IP=$1
SSH_PORT=${2:-22}  # Mặc định port 22, hoặc dùng port được chỉ định
VPS_USER="root"
PROJECT_DIR="/var/www/booking-car"

if [ -z "$VPS_IP" ]; then
    echo "❌ Vui lòng cung cấp IP của VPS"
    echo "Sử dụng: ./deploy.sh your-vps-ip [ssh-port]"
    echo "Ví dụ: ./deploy.sh 103.56.161.203 24700"
    exit 1
fi

echo "🚀 Bắt đầu deploy lên VPS: $VPS_IP (Port: $SSH_PORT)"

# 1. Nén project
echo "📦 Đang nén project..."
cd /Users/admin/Project/Web/Booking_car
tar -czf /tmp/booking-car.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.git' \
    client/ server/ docker-compose.yml
cd -

# 2. Upload lên VPS
echo "⬆️  Đang upload lên VPS..."
scp -P $SSH_PORT /tmp/booking-car.tar.gz $VPS_USER@$VPS_IP:/tmp/

# 3. Deploy trên VPS
echo "🔧 Đang deploy trên VPS..."
ssh -p $SSH_PORT $VPS_USER@$VPS_IP << 'ENDSSH'
set -e

# Giải nén
cd /tmp
rm -rf booking-car 2>/dev/null || true
mkdir -p booking-car
tar -xzf booking-car.tar.gz -C booking-car 2>/dev/null || tar -xzf booking-car.tar.gz -C booking-car
ls -la booking-car/  # Debug: xem cấu trúc thư mục

# Backup version cũ nếu có
if [ -d "~/Booking_car" ]; then
    echo "💾 Backup version cũ..."
    BACKUP_NAME="Booking_car-backup-$(date +%Y%m%d-%H%M%S)"
    cp -r ~/Booking_car ~/$BACKUP_NAME
    
    # Giữ lại 3 backup gần nhất, xóa các backup cũ hơn
    cd ~
    ls -dt Booking_car-backup-* 2>/dev/null | tail -n +4 | xargs -r rm -rf
    echo "✅ Đã backup vào: $BACKUP_NAME"
fi

# Di chuyển code mới
mkdir -p ~/Booking_car
cd /tmp/booking-car
cp -r client server docker-compose.yml ~/Booking_car/

# Rebuild Docker
echo "🐳 Rebuild Docker containers..."
cd ~/Booking_car
docker-compose down
docker-compose up -d --build

echo "✅ Deploy thành công!"
docker-compose ps

ENDSSH

# 4. Dọn dẹp
echo "🧹 Dọn dẹp..."
rm -f /tmp/booking-car.tar.gz

echo ""
echo "✅ Deploy hoàn tất!"
echo "🌐 Truy cập: http://$VPS_IP"
echo ""
echo "📊 Kiểm tra logs:"
echo "   ssh -p $SSH_PORT $VPS_USER@$VPS_IP 'pm2 logs'"
