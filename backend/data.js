import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'Group4',
            dob: '10/10/1998',
            address: '123 Nguyen Trai',
            phone: '1234567890',
            email: 'admin@gmail.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true,
            isVerified: true,
        },
        {
            name: 'Người dùng 1',
            dob: '02/08/2000',
            address: '123456 Nguyen Tri Phuong',
            phone: '0987654321',
            email: 'user1@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: false,
            isVerified: true,
        },
    ],
    products: [
        {
            // _id: '1',
            name: 'Bàn phím cơ Newmen GM368 Mix Led',
            category: 'keyboard',
            // slug: 'newmen-gm368-mix-led',
            description: ["Keycap hai lớp nổi bật với vật liệu nhập khẩu: lựa chọn vật liệu nhập khẩu cao cấp, chịu lực mài mòn cao, tăng độ bền, bề mặt mịn và cho cảm giác thoải mái."
                        + "\nToàn bộ các phím không có sự xung đột, các kĩ năng phức tạp trong game đều có thể được khai triển, thỏa mãn những yêu cầu khắt khe của gamer khi sử dụng. Chế độ đèn nền khác nhau cho người dùng sự thú vị về thị giác.'"],
            image: '/images/keyboard_1.jpg',
            price: 800000,
            quantity: 100,
            brand: 'Newmen',
            rating: 4.9,
            reviews: 10,
        },

        {
            // _id: '2',
            name: 'Laptop MSI Modern 15 A11M',
            category: 'laptop',
            // slug: 'msi-modern-15-a11m',
            description:[ "- CPU: Intel Core i5-1155G7"
                        + "\n- Màn hình: 15.6\" IPS (1920 x 1080)"
                        + "\n- RAM: 1 x 8GB DDR4 3200MHz- Đồ họa: Onboard Intel Iris Xe Graphics"
                        + "- Lưu trữ: 512GB SSD M.2 NVMe /"
                        + "- Hệ điều hành: Windows 11"
                        + "- Pin: 3 cell 52 Wh Pin liền"
                        + "- Khối lượng: 1.6kg\""],
            image: '/images/laptop_1.jpg',
            price: 14690000,
            quantity: 0,
            brand: 'MSI',
            rating: 4.1,
            reviews: 38,
        },
        {
            // _id: '3',
            name: 'Tai nghe HyperX Cloud Earbuds',
            category: 'earphone',
            // slug: 'hyperx-cloud-earbuds',
            description: 'Tai nghe HyperX Cloud Earbuds được sản xuất hướng đến những game thủ được trải nghiệm âm thanh chất lượng khi đang chơi game. Với thiết kế năng động, cá tính cùng micro tích hợp giúp các game thủ có thể streaming khi đang chơi game. Tai nghe cũng phù hợp để sử dụng, nghe và nhận cuộc gọi hằng ngày rất linh hoạt.',
            image: '/images/earphone_1.jpg',
            price: 849000,
            quantity: 35,
            brand: 'HyperX',
            rating: 3.5,
            reviews: 5,
        },
        {
            // _id: '4',
            name: 'Smart Tivi Samsung UHD 4K 65 inch UA65AU7002KXXV',
            category: 'tivi',
            // slug: 'samsung-smartTV-UHD4K-65inch-UA65AU7002KXXV',
            description: 'Tivi Samsung UHD 4K 65 inch UA65AU7002 sẽ mang đến cho bạn những trải nghiệm hình ảnh mới mẻ. Ngoài ra, tivi cũng được tích hợp nhiều tính năng độc đáo nhằm phục vụ nhu cầu làm việc và học tập tại nhà.',
            image: '/images/tivi_1.jpg',
            price: 13290000,
            quantity: 5,
            brand: 'Samsung',
            rating: 3.6,
            reviews: 15,
        },
    ]
}

export default data;