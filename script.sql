
-- Tạo Database (SQL Server không hỗ trợ IF NOT EXISTS trong CREATE DATABASE)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'randoxdb')
BEGIN
    CREATE DATABASE randoxdb;
END
GO

USE randoxdb;
GO

-- Các bảng
CREATE TABLE withdraw_status (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    withdraw_status_name NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE transaction_type (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    transaction_type_name NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE role (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    role_name NVARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE transaction_status (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    transaction_status_name NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE shipment_status (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    shipment_status_name NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE account (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email NVARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    phone_number NVARCHAR(15),
    status INT DEFAULT 1,
    role_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE wallet (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (id) REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE wallet_history (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    time_transaction DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    account_id UNIQUEIDENTIFIER,
    transaction_type_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (account_id) REFERENCES account(id),
    FOREIGN KEY (transaction_type_id) REFERENCES transaction_type(id)
);

CREATE TABLE voucher (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    voucher_name NVARCHAR(255) NOT NULL,
    voucher_discount_amount DECIMAL(12,2),
    is_discount_percentage BIT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    amount INT,
    min_order_value DECIMAL(12,2),
    max_discount_value DECIMAL(12,2),
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE cart (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    total_amount DECIMAL(12,2),
    account_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (id) REFERENCES account(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TABLE [order] (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    cart_id UNIQUEIDENTIFIER,
    total_amount DECIMAL(12,2),
    shipping_cost DECIMAL(12,2),
    voucher_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (voucher_id) REFERENCES voucher(id),
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE
);

CREATE TABLE [transaction] (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    payment_type_id UNIQUEIDENTIFIER,
    payment_location BIT,
    pay_date DATE,
    amount DECIMAL(12,2),
    Description NVARCHAR(255),
    transaction_status_id UNIQUEIDENTIFIER,
    wallet_history_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (transaction_status_id) REFERENCES transaction_status(id),
    FOREIGN KEY (wallet_history_id) REFERENCES wallet_history(id),
    FOREIGN KEY (id) REFERENCES [order](id) ON DELETE CASCADE
);

CREATE TABLE manufacturer (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    manufacturer_name NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE promotion (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    event NVARCHAR(255),
    start_date DATE,
    end_date DATE,
    percentage_discount_value INT,
    discount_value DECIMAL(12,2),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE product_set (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    product_set_name NVARCHAR(255),
    description NVARCHAR(255),
    set_quantity INT,
    quantity INT,
    price DECIMAL(12,2),
    promotion_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (promotion_id) REFERENCES promotion(id)
);

CREATE TABLE category (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    category_name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE product (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    product_name NVARCHAR(255) NOT NULL,
    description NVARCHAR(255),
    quantity INT,
    price DECIMAL(12,2) NOT NULL,
    manufacturer_id UNIQUEIDENTIFIER,
    product_set_id UNIQUEIDENTIFIER,
    promotion_id UNIQUEIDENTIFIER,
    category_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturer(id),
    FOREIGN KEY (product_set_id) REFERENCES product_set(id),
    FOREIGN KEY (promotion_id) REFERENCES promotion(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);


CREATE TABLE cart_product (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    product_id UNIQUEIDENTIFIER,
    cart_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (cart_id) REFERENCES cart(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE address (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    full_address NVARCHAR(255) NOT NULL,
    phone_number NVARCHAR(255),
    recipient_name NVARCHAR(255),
    is_default BIT DEFAULT 0,
    account_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TABLE shipment (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    test_result_dispatched_date DATE,
    test_result_delivery_date DATE,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE shipment_history (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    shipment_status_id UNIQUEIDENTIFIER,
    shipment_id UNIQUEIDENTIFIER,
    account_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (shipment_status_id) REFERENCES shipment_status(id),
    FOREIGN KEY (shipment_id) REFERENCES shipment(id),
    FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TABLE with_draw_form (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    title NVARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    withdraw_status_id UNIQUEIDENTIFIER,
    account_id UNIQUEIDENTIFIER,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (withdraw_status_id) REFERENCES withdraw_status(id),
    FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TABLE image (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    order_id UNIQUEIDENTIFIER,
    product_id UNIQUEIDENTIFIER,
    image_url NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    deleted_at DATETIME NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES [order](id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE email_token (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    account_id UNIQUEIDENTIFIER NOT NULL,
    token NVARCHAR(255) NOT NULL,
    token_type NVARCHAR(50) NOT NULL,
    expiry_date DATETIME NOT NULL,
    is_used BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (account_id) REFERENCES account(id)
);

-- Indexes for email_token
CREATE INDEX idx_token ON email_token(token);
CREATE INDEX idx_token_type ON email_token(token_type);
CREATE INDEX idx_expiry_date ON email_token(expiry_date);

-- Initial data
INSERT INTO withdraw_status (id, withdraw_status_name) VALUES (NEWID(), 'Pending'), (NEWID(), 'Success'), (NEWID(), 'Fail');
INSERT INTO transaction_type (id, transaction_type_name) VALUES (NEWID(), 'Deposit'), (NEWID(), 'Payment'), (NEWID(), 'Withdrawal');
INSERT INTO role (id, role_name) VALUES (NEWID(), 'Admin'), (NEWID(), 'Manager'), (NEWID(), 'Staff'), (NEWID(), 'Customer');
INSERT INTO transaction_status (id, transaction_status_name) VALUES (NEWID(), 'Pending'), (NEWID(), 'Fail'), (NEWID(), 'Success');
INSERT INTO shipment_status (id, shipment_status_name) VALUES (NEWID(), 'Pending'), (NEWID(), 'Shipping'), (NEWID(), 'Fail'), (NEWID(), 'Success');


GO
CREATE TRIGGER trg_update_withdraw_status_updated_at
ON withdraw_status
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE withdraw_status
    SET updated_at = GETDATE()
    FROM withdraw_status t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_transaction_type_updated_at
ON transaction_type
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE transaction_type
    SET updated_at = GETDATE()
    FROM transaction_type t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_role_updated_at
ON role
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE role
    SET updated_at = GETDATE()
    FROM role t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_transaction_status_updated_at
ON transaction_status
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE transaction_status
    SET updated_at = GETDATE()
    FROM transaction_status t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_shipment_status_updated_at
ON shipment_status
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE shipment_status
    SET updated_at = GETDATE()
    FROM shipment_status t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_account_updated_at
ON account
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE account
    SET updated_at = GETDATE()
    FROM account t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_wallet_updated_at
ON wallet
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE wallet
    SET updated_at = GETDATE()
    FROM wallet t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_wallet_history_updated_at
ON wallet_history
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE wallet_history
    SET updated_at = GETDATE()
    FROM wallet_history t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_voucher_updated_at
ON voucher
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE voucher
    SET updated_at = GETDATE()
    FROM voucher t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_cart_updated_at
ON cart
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE cart
    SET updated_at = GETDATE()
    FROM cart t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_order_updated_at
ON [order]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [order]
    SET updated_at = GETDATE()
    FROM [order] t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_transaction_updated_at
ON [transaction]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [transaction]
    SET updated_at = GETDATE()
    FROM [transaction] t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_manufacturer_updated_at
ON manufacturer
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE manufacturer
    SET updated_at = GETDATE()
    FROM manufacturer t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_promotion_updated_at
ON promotion
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE promotion
    SET updated_at = GETDATE()
    FROM promotion t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_product_set_updated_at
ON product_set
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE product_set
    SET updated_at = GETDATE()
    FROM product_set t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_category_updated_at
ON category
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE category
    SET updated_at = GETDATE()
    FROM category t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_product_updated_at
ON product
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE product
    SET updated_at = GETDATE()
    FROM product t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_cart_product_updated_at
ON cart_product
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE cart_product
    SET updated_at = GETDATE()
    FROM cart_product t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_address_updated_at
ON address
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE address
    SET updated_at = GETDATE()
    FROM address t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_shipment_updated_at
ON shipment
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE shipment
    SET updated_at = GETDATE()
    FROM shipment t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_shipment_history_updated_at
ON shipment_history
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE shipment_history
    SET updated_at = GETDATE()
    FROM shipment_history t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_with_draw_form_updated_at
ON with_draw_form
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE with_draw_form
    SET updated_at = GETDATE()
    FROM with_draw_form t
    INNER JOIN inserted i ON t.id = i.id;
END;

GO
CREATE TRIGGER trg_update_image_updated_at
ON image
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE image
    SET updated_at = GETDATE()
    FROM image t
    INNER JOIN inserted i ON t.id = i.id;
END;


