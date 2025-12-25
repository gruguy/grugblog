-- 创建测试用户，密码哈希是123456的bcrypt哈希值
INSERT INTO user (username, password, email, nickname, bio, createdAt, updatedAt)
VALUES (
    'admin',
    '$2a$10$jW2rKzBnGfRz9rZ9rZ9rZ9rZ9rZ9rZ9rZ9rZ9rZ9rZ9rZ9rZ9rZ9',
    'admin@example.com',
    '管理员',
    '系统管理员',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    email = VALUES(email),
    nickname = VALUES(nickname),
    bio = VALUES(bio),
    updatedAt = NOW();
