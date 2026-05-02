-- Tabla de productos
CREATE TABLE IF NOT EXISTS `store_products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `price` INT NOT NULL DEFAULT 0,
    `item` VARCHAR(50) NOT NULL DEFAULT 'none',
    `image` TEXT DEFAULT NULL,
    `category` VARCHAR(50) DEFAULT 'VIP'
);

-- Categorías dinámicas
CREATE TABLE IF NOT EXISTS `store_categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `icon` VARCHAR(50) DEFAULT 'Package'
);

-- Negocios activos
CREATE TABLE IF NOT EXISTS `store_businesses` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(100) DEFAULT NULL,
    `owner_id` VARCHAR(50) DEFAULT NULL,
    `status` TINYINT(1) DEFAULT 0,
    `icon` VARCHAR(50) DEFAULT 'Store',
    `image` TEXT DEFAULT NULL
);

-- Anuncios / Noticias
CREATE TABLE IF NOT EXISTS `store_announcements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `category` ENUM('Update','Alert','Event') DEFAULT 'Update',
    `date` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Historial de compras in-game
CREATE TABLE IF NOT EXISTS `store_purchases` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `citizen_id` VARCHAR(50) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `product_id` INT NOT NULL,
    `product_name` VARCHAR(100) NOT NULL,
    `price` INT NOT NULL,
    `date` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Datos de ejemplo
INSERT INTO `store_categories` (`name`, `icon`) VALUES 
('VIP', 'Shield'), ('Coches', 'Car'), ('Armas', 'Zap'), ('Otros', 'Package')
ON DUPLICATE KEY UPDATE `name`=`name`;

INSERT INTO `store_businesses` (`name`, `role`, `status`, `icon`) VALUES 
('Policía LSPD', 'Agente', 1, 'ShieldCheck'),
('Hospital Central', 'Médico', 1, 'HeartPulse'),
('Benny''s Motorworks', 'Mecánico', 0, 'Wrench'),
('Vanilla Unicorn', 'Gerente', 0, 'Music')
ON DUPLICATE KEY UPDATE `name`=`name`;

INSERT INTO `store_announcements` (`title`, `content`, `category`) VALUES 
('Bienvenido a la nueva tienda in-game', 'Ahora puedes comprar desde dentro del servidor. ¡Explora el catálogo!', 'Update'),
('Evento de fin de semana: x2 CC', 'Este fin de semana todos los productos tienen el doble de recompensa en monedas.', 'Event')
ON DUPLICATE KEY UPDATE `title`=`title`;
