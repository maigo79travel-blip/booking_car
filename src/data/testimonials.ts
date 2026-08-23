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
    name: "Nguyễn Văn Hùng",
    avatar:
      "https://ui-avatars.com/api/?name=Nguyen+Van+Hung&background=f97316&color=fff",
    rating: 5,
    comment:
      "Dịch vụ tuyệt vời! Tài xế rất nhiệt tình, xe sạch sẽ, đúng giờ. Giá cả hợp lý, tôi sẽ tiếp tục sử dụng dịch vụ.",
    date: "10/01/2026",
    location: "Hà Nội",
    service: "Xe sân bay Nội Bài",
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    avatar:
      "https://ui-avatars.com/api/?name=Tran+Thi+Mai&background=f97316&color=fff",
    rating: 5,
    comment:
      "Đặt xe rất dễ dàng, tài xế đến đúng giờ. Xe 7 chỗ rộng rãi, phù hợp cho gia đình. Giá rẻ hơn nhiều so với taxi thường.",
    date: "08/01/2026",
    location: "Hà Nội",
    service: "Xe đi tỉnh",
  },
  {
    id: 3,
    name: "Lê Quang Minh",
    avatar:
      "https://ui-avatars.com/api/?name=Le+Quang+Minh&background=f97316&color=fff",
    rating: 5,
    comment:
      "Tôi đã sử dụng dịch vụ nhiều lần, luôn hài lòng. Tài xế lái xe an toàn, xe mới, sạch sẽ. Rất đáng tin cậy!",
    date: "05/01/2026",
    location: "Hà Nội",
    service: "Xe sân bay Nội Bài",
  },
  {
    id: 4,
    name: "Phạm Thị Hương",
    avatar:
      "https://ui-avatars.com/api/?name=Pham+Thi+Huong&background=f97316&color=fff",
    rating: 5,
    comment:
      "Dịch vụ chuyên nghiệp, giá cả minh bạch. Đi Hải Phòng với giá rất tốt. Sẽ giới thiệu cho bạn bè.",
    date: "03/01/2026",
    location: "Hà Nội",
    service: "Xe đi tỉnh",
  },
  {
    id: 5,
    name: "Hoàng Anh Tuấn",
    avatar:
      "https://ui-avatars.com/api/?name=Hoang+Anh+Tuan&background=f97316&color=fff",
    rating: 5,
    comment:
      "Xe 16 chỗ đi du lịch rất tiện, tài xế nhiệt tình hỗ trợ. Giá cả hợp lý, không phát sinh chi phí. Tuyệt vời!",
    date: "01/01/2026",
    location: "Hà Nội",
    service: "Xe 16 chỗ",
  },
  {
    id: 6,
    name: "Vũ Thị Lan",
    avatar:
      "https://ui-avatars.com/api/?name=Vu+Thi+Lan&background=f97316&color=fff",
    rating: 5,
    comment:
      "Đặt xe đi sân bay lúc 4h sáng, tài xế vẫn đến đúng giờ. Rất ấn tượng với sự chuyên nghiệp.",
    date: "28/12/2025",
    location: "Hà Nội",
    service: "Xe sân bay Nội Bài",
  },
  {
    id: 7,
    name: "Đỗ Văn Nam",
    avatar:
      "https://ui-avatars.com/api/?name=Do+Van+Nam&background=f97316&color=fff",
    rating: 5,
    comment:
      "Giá rẻ hơn Grab nhiều, xe cũng đẹp hơn. Tài xế lịch sự, không nói nhiều. Rất hài lòng!",
    date: "25/12/2025",
    location: "Hà Nội",
    service: "Xe 5 chỗ",
  },
  {
    id: 8,
    name: "Ngô Thị Thanh",
    avatar:
      "https://ui-avatars.com/api/?name=Ngo+Thi+Thanh&background=f97316&color=fff",
    rating: 5,
    comment:
      "Dịch vụ tốt, xe sạch, tài xế thân thiện. Đi Ninh Bình với giá rất hợp lý. Sẽ dùng lại!",
    date: "22/12/2025",
    location: "Hà Nội",
    service: "Xe đi tỉnh",
  },
  {
    id: 9,
    name: "Bùi Quang Huy",
    avatar:
      "https://ui-avatars.com/api/?name=Bui+Quang+Huy&background=f97316&color=fff",
    rating: 5,
    comment:
      "Xe 7 chỗ đi Hạ Long rất thoải mái. Tài xế có kinh nghiệm, lái xe êm. Giá tốt nhất thị trường!",
    date: "20/12/2025",
    location: "Hà Nội",
    service: "Xe 7 chỗ",
  },
  {
    id: 10,
    name: "Trịnh Thị Nga",
    avatar:
      "https://ui-avatars.com/api/?name=Trinh+Thi+Nga&background=f97316&color=fff",
    rating: 5,
    comment:
      "Đặt xe qua điện thoại rất nhanh, nhân viên tư vấn nhiệt tình. Xe đến đúng giờ, sạch sẽ. Rất hài lòng!",
    date: "18/12/2025",
    location: "Hà Nội",
    service: "Xe sân bay Nội Bài",
  },
  {
    id: 11,
    name: "Phan Văn Đức",
    avatar:
      "https://ui-avatars.com/api/?name=Phan+Van+Duc&background=f97316&color=fff",
    rating: 5,
    comment:
      "Dùng dịch vụ đưa đón sân bay hàng tháng. Luôn đúng giờ, giá cố định, rất tiện lợi cho công việc.",
    date: "15/12/2025",
    location: "Hà Nội",
    service: "Xe sân bay Nội Bài",
  },
  {
    id: 12,
    name: "Lý Thị Hồng",
    avatar:
      "https://ui-avatars.com/api/?name=Ly+Thi+Hong&background=f97316&color=fff",
    rating: 5,
    comment:
      "Xe mới, sạch sẽ, có wifi. Tài xế lịch sự, hỗ trợ xách hành lý. Dịch vụ 5 sao!",
    date: "12/12/2025",
    location: "Hà Nội",
    service: "Xe 5 chỗ",
  },
];
