-- Vehicle catalogue for /loai-xe. The admin CMS owns all future changes.
INSERT INTO public.site_content (content_key, content_type, value)
VALUES (
  'vehicle_categories',
  'json',
  $$[
    {
      "title": "XE 5 CHỖ",
      "seats": "2 hàng lý trình + 1 hàng xách",
      "luggage": "2 hàng lý trình + 1 hàng xách",
      "maxPassengers": "Tối đa 4 khách hàng",
      "maxLuggage": "4 vali",
      "features": [
        "Đưa đón toàn bộ xe đời mới nhất, hiện đại, tiện nghi, sang trọng và lịch sự",
        "Với đầy đủ các dòng xe từ 4 chỗ, 7 chỗ, 16 chỗ, 29 chỗ đến 45 chỗ",
        "Dàn xe của chúng tôi đảm bảo đầy đủ các quy chuẩn dịch vụ và vận tải hành khách và thường xuyên được kiểm tra, bảo dưỡng",
        "Với đội ngũ xe lớn, chúng tôi có khả năng đáp ứng nhu cầu dịch vụ của khách hàng mọi nơi, mọi lúc"
      ],
      "vehicles": [
        {"id": 1, "name": "HONDA CITY", "image": "/images/51.png", "category": "5-seater"},
        {"id": 2, "name": "MAZDA 3", "image": "/images/52.png", "category": "5-seater"},
        {"id": 3, "name": "NISSAN ALMERA", "image": "/images/53.png", "category": "5-seater"},
        {"id": 4, "name": "ACCENT", "image": "/images/54.png", "category": "5-seater"},
        {"id": 5, "name": "VF6", "image": "/images/55.png", "category": "5-seater"}
      ]
    },
    {
      "title": "XE 7 CHỖ",
      "seats": "3 hàng lý trình + 1 hàng xách",
      "luggage": "3 hàng lý trình + 1 hàng xách",
      "maxPassengers": "Tối đa 6 khách hàng",
      "maxLuggage": "6 vali",
      "features": [
        "Đưa đón toàn bộ xe đời mới nhất, hiện đại, tiện nghi, sang trọng và lịch sự",
        "Với đầy đủ các dòng xe từ 4 chỗ, 7 chỗ, 16 chỗ, 29 chỗ đến 45 chỗ",
        "Dàn xe của chúng tôi đảm bảo đầy đủ các quy chuẩn dịch vụ và vận tải hành khách và thường xuyên được kiểm tra, bảo dưỡng",
        "Với đội ngũ xe lớn, chúng tôi có khả năng đáp ứng nhu cầu dịch vụ của khách hàng mọi nơi, mọi lúc"
      ],
      "vehicles": [
        {"id": 6, "name": "FORTUNER", "image": "/images/71.png", "category": "7-seater"},
        {"id": 7, "name": "CUTIN", "image": "/images/72.png", "category": "7-seater"},
        {"id": 8, "name": "LIMOGREEN", "image": "/images/73.png", "category": "7-seater"},
        {"id": 9, "name": "INOVAR", "image": "/images/74.png", "category": "7-seater"},
        {"id": 10, "name": "EXPANDER", "image": "/images/75.png", "category": "7-seater"}
      ]
    },
    {
      "title": "XE 16 CHỖ",
      "seats": "4 hàng lý trình + 1 hàng xách",
      "luggage": "4 hàng lý trình + 1 hàng xách",
      "maxPassengers": "Tối đa 15 khách hàng",
      "maxLuggage": "15 vali",
      "features": [
        "Đưa đón toàn bộ xe đời mới nhất, hiện đại, tiện nghi, sang trọng và lịch sự",
        "Với đầy đủ các dòng xe từ 4 chỗ, 7 chỗ, 16 chỗ, 29 chỗ đến 45 chỗ",
        "Dàn xe của chúng tôi đảm bảo đầy đủ các quy chuẩn dịch vụ và vận tải hành khách và thường xuyên được kiểm tra, bảo dưỡng",
        "Với đội ngũ xe lớn, chúng tôi có khả năng đáp ứng nhu cầu dịch vụ của khách hàng mọi nơi, mọi lúc"
      ],
      "vehicles": [
        {"id": 11, "name": "COUNTY", "image": "/images/big1.png", "category": "16-seater"},
        {"id": 12, "name": "FORD TRANSIT ĐEN", "image": "/images/big2.png", "category": "16-seater"},
        {"id": 13, "name": "FORD TRANSIT TRẮNG", "image": "/images/big3.png", "category": "16-seater"},
        {"id": 14, "name": "UNIVERSE", "image": "/images/big4.png", "category": "16-seater"},
        {"id": 15, "name": "SOLATI", "image": "/images/big5.jpg", "category": "16-seater"}
      ]
    }
  ]$$::jsonb
)
ON CONFLICT (content_key) DO NOTHING;
