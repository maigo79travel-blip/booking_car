#!/bin/bash

# Script rollback về version trước đó
# Sử dụng: ./rollback.sh your-vps-ip [ssh-port] [backup-name]
# Ví dụ: ./rollback.sh 103.56.161.203 24700

set -e

VPS_IP=$1
SSH_PORT=${2:-22}
VPS_USER="root"
BACKUP_NAME=$3

if [ -z "$VPS_IP" ]; then
    echo "❌ Vui lòng cung cấp IP của VPS"
    echo "Sử dụng: ./rollback.sh your-vps-ip [ssh-port] [backup-name]"
    echo "Ví dụ: ./rollback.sh 103.56.161.203 24700"
    exit 1
fi

echo "🔄 Bắt đầu rollback trên VPS: $VPS_IP (Port: $SSH_PORT)"

# Rollback trên VPS
ssh -p $SSH_PORT $VPS_USER@$VPS_IP << ENDSSH
set -e

cd /var/www

# Nếu không chỉ định backup, lấy backup mới nhất
if [ -z "$BACKUP_NAME" ]; then
    BACKUP_NAME=\$(ls -dt booking-car-backup-* 2>/dev/null | head -n 1)
    if [ -z "\$BACKUP_NAME" ]; then
        echo "❌ Không tìm thấy backup nào!"
        exit 1
    fi
    echo "📦 Sử dụng backup: \$BACKUP_NAME"
else
    BACKUP_NAME="$BACKUP_NAME"
fi

# Kiểm tra backup có tồn tại không
if [ ! -d "\$BACKUP_NAME" ]; then
    echo "❌ Backup không tồn tại: \$BACKUP_NAME"
    echo "Các backup có sẵn:"
    ls -dt booking-car-backup-* 2>/dev/null || echo "  Không có backup nào"
    exit 1
fi

# Stop services
echo "⏸️  Dừng services..."
pm2 stop booking-backend booking-frontend

# Backup version hiện tại (để phòng trường hợp)
if [ -d "booking-car" ]; then
    echo "💾 Backup version hiện tại..."
    sudo mv booking-car booking-car-failed-\$(date +%Y%m%d-%H%M%S)
fi

# Restore từ backup
echo "♻️  Restore từ backup..."
sudo cp -r "\$BACKUP_NAME" booking-car

# Restart services
echo "🚀 Khởi động lại services..."
cd booking-car/server
pm2 restart booking-backend

cd ../client
pm2 restart booking-frontend

pm2 save

echo ""
echo "✅ Rollback thành công!"
echo "📊 Kiểm tra status:"
pm2 list

ENDSSH

echo ""
echo "✅ Rollback hoàn tất!"
echo "🌐 Kiểm tra website: http://$VPS_IP"
