
Use test_ecommercedb

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2),
  discount DECIMAL(10,2),
  review_count INT,
  image_url TEXT
);

INSERT INTO products (name, price, discount, review_count, image_url) VALUES
('เสื้อยืดคอกลมสีขาว', 299.00, 50.00, 125, 'https://example.com/images/shirt-white.jpg'),
('กางเกงยีนส์ผู้ชาย', 899.00, 100.00, 88, 'https://example.com/images/jeans-men.jpg'),
('รองเท้าผ้าใบแฟชั่น', 1290.00, 200.00, 240, 'https://example.com/images/sneakers.jpg'),
('หมวกแก๊ปลายกราฟิก', 199.00, 20.00, 32, 'https://example.com/images/cap.jpg'),
('กระเป๋าสะพายข้าง', 599.00, 150.00, 59, 'https://example.com/images/bag.jpg');

SELECT * FROM products

ALTER TABLE products ADD COLUMN is_deleted BOOLEAN DEFAULT 0;
