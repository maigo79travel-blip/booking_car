export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
  service: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Nguyễn Hoàng Nam",
    avatar:
      "https://ui-avatars.com/api/?name=Nguyen+Hoang+Nam&background=f97316&color=fff",
    rating: 5,
    comment:
      "Dịch vụ rất tuyệt vời! Tài xế đón đúng giờ tại sảnh Ga Quốc Nội sân bay Cam Ranh, xe mới tinh thơm tho và chạy rất êm. Giá 250k trọn gói không phát sinh.",
    date: "10/01/2026",
    location: "Nha Trang",
    service: "Xe sân bay Cam Ranh",
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    avatar:
      "https://ui-avatars.com/api/?name=Tran+Thi+Mai&background=f97316&color=fff",
    rating: 5,
    comment:
      "Đặt xe rất dễ dàng, tài xế đến đúng giờ. Xe 7 chỗ rộng rãi, đưa cả nhà từ Nha Trang lên Đà Lạt ngắm cảnh đèo Khánh Lê cực an toàn.",
    date: "08/01/2026",
    location: "Nha Trang",
    service: "Xe Nha Trang - Đà Lạt",
  },
  {
    id: 3,
    name: "Lê Quang Minh",
    avatar:
      "https://ui-avatars.com/api/?name=Le+Quang+Minh&background=f97316&color=fff",
    rating: 5,
    comment:
      "Tôi thường xuyên công tác tại Nha Trang, luôn tin tưởng đặt xe đưa đón sân bay Cam Ranh tại maigo79.com. Tài xế lịch sự, hỗ trợ hành lý chu đáo.",
    date: "05/01/2026",
    location: "Nha Trang",
    service: "Xe sân bay Cam Ranh",
  },
  {
    id: 4,
    name: "Phạm Thị Hương",
    avatar:
      "https://ui-avatars.com/api/?name=Pham+Thi+Huong&background=f97316&color=fff",
    rating: 5,
    comment:
      "Dịch vụ chuyên nghiệp, giá cả minh bạch. Đặt xe đi Mũi Né Phan Thiết với giá rất tốt. Sẽ giới thiệu cho bạn bè và đối tác.",
    date: "03/01/2026",
    location: "Nha Trang",
    service: "Xe đi Mũi Né",
  },
  {
    id: 5,
    name: "Hoàng Anh Tuấn",
    avatar:
      "https://ui-avatars.com/api/?name=Hoang+Anh+Tuan&background=f97316&color=fff",
    rating: 5,
    comment:
      "Xe 16 chỗ Solati đi tour Dốc Lết - Điệp Sơn rất rộng và êm, tài xế nhiệt tình hỗ trợ đoàn chụp ảnh. Giá cả hợp lý, không phát sinh chi phí.",
    date: "01/01/2026",
    location: "Nha Trang",
    service: "Xe 16 chỗ tour du lịch",
  },
  {
    id: 6,
    name: "Park Ji-hoon",
    avatar:
      "https://ui-avatars.com/api/?name=Park+Ji+Hoon&background=f97316&color=fff",
    rating: 5,
    comment:
      "Very friendly driver, clean car and on-time pickup. The driver was waiting with my nameplate at Cam Ranh Terminal 2. Highly recommended!",
    date: "28/12/2025",
    location: "Nha Trang",
    service: "Cam Ranh Airport Transfer",
  },
  {
    id: 7,
    name: "Đỗ Văn Nam",
    avatar:
      "https://ui-avatars.com/api/?name=Do+Van+Nam&background=f97316&color=fff",
    rating: 5,
    comment:
      "Giá rẻ hơn nhiều so với bắt taxi truyền thống tại sân bay, xe mới đẹp. Bác tài nhiệt tình chỉ cho những quán hải sản ngon rẻ ở bờ kè Tháp Bà.",
    date: "25/12/2025",
    location: "Nha Trang",
    service: "Xe 5 chỗ sân bay",
  },
  {
    id: 8,
    name: "Ngô Thị Thanh",
    avatar:
      "https://ui-avatars.com/api/?name=Ngo+Thi+Thanh&background=f97316&color=fff",
    rating: 5,
    comment:
      "Dịch vụ tốt, xe sạch, tài xế thân thiện. Đi Ninh Thuận tham quan Vĩnh Hy Hang Rái với giá rất hợp lý. Nhất định sẽ ủng hộ tiếp!",
    date: "22/12/2025",
    location: "Nha Trang",
    service: "Xe tour Ninh Thuận",
  },
  {
    id: 9,
    name: "Bùi Quang Huy",
    avatar:
      "https://ui-avatars.com/api/?name=Bui+Quang+Huy&background=f97316&color=fff",
    rating: 5,
    comment:
      "Xe 7 chỗ đưa đón resort Alma Bãi Dài rất tiện lợi. Lái xe cẩn thận, đúng giờ. Giá tốt nhất thị trường!",
    date: "20/12/2025",
    location: "Nha Trang",
    service: "Xe Resort Bãi Dài",
  },
  {
    id: 10,
    name: "Trịnh Thị Nga",
    avatar:
      "https://ui-avatars.com/api/?name=Trinh+Thi+Nga&background=f97316&color=fff",
    rating: 5,
    comment:
      "Đặt xe qua Zalo rất nhanh, nhân viên trực tổng đài tư vấn nhiệt tình. Xe đón tận sảnh đến Cam Ranh đúng giờ, sạch sẽ. Rất hài lòng!",
    date: "18/12/2025",
    location: "Nha Trang",
    service: "Xe sân bay Cam Ranh",
  },
  {
    id: 11,
    name: "Phan Văn Đức",
    avatar:
      "https://ui-avatars.com/api/?name=Phan+Van+Duc&background=f97316&color=fff",
    rating: 5,
    comment:
      "Dùng dịch vụ đưa đón khách hàng và đối tác đến Nha Trang dự hội nghị. Luôn đúng giờ, giá cố định có xuất hóa đơn VAT nhanh chóng.",
    date: "15/12/2025",
    location: "Nha Trang",
    service: "Xe sân bay Cam Ranh",
  },
  {
    id: 12,
    name: "Lý Thị Hồng",
    avatar:
      "https://ui-avatars.com/api/?name=Ly+Thi+Hong&background=f97316&color=fff",
    rating: 5,
    comment:
      "Xe mới, sạch sẽ, máy lạnh mát rượi. Tài xế lịch sự, hỗ trợ xách hành lý. Đánh giá 5 sao cho chất lượng phục vụ!",
    date: "12/12/2025",
    location: "Nha Trang",
    service: "Xe 5 chỗ",
  },
];
