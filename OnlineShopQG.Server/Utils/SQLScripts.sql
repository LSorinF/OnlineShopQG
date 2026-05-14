USE [master]
GO
CREATE DATABASE [OnlineShopQG]
GO

USE OnlineShopQG 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CartItems](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderItems](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[UnitPrice] [decimal](18, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[OrderDate] [datetime] NULL,
	[TotalAmount] [decimal](18, 2) NOT NULL,
	[ShippingAddress] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[Price] [decimal](18, 2) NOT NULL,
	[ImageUrl] [nvarchar](255) NULL,
	[Category] [nvarchar](100) NULL,
	[Brand] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[DateRegistered] [datetime] NULL,
	[AddressLine] [nvarchar](500) NULL,
	[City] [nvarchar](100) NULL,
	[State] [nvarchar](100) NULL,
	[ZipCode] [nvarchar](20) NULL,
	[Country] [nvarchar](100) NULL,
	[PhoneNumber] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT (getdate()) FOR [OrderDate]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [DateRegistered]
GO
ALTER TABLE [dbo].[CartItems]  WITH CHECK ADD  CONSTRAINT [FK_Cart_Product] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[CartItems] CHECK CONSTRAINT [FK_Cart_Product]
GO
ALTER TABLE [dbo].[CartItems]  WITH CHECK ADD  CONSTRAINT [FK_Cart_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[CartItems] CHECK CONSTRAINT [FK_Cart_User]
GO
ALTER TABLE [dbo].[OrderItems]  WITH CHECK ADD FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[OrderItems]  WITH CHECK ADD FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
USE [master]
GO
ALTER DATABASE [OnlineShopQG] SET  READ_WRITE 
GO

USE [OnlineShopQG];
GO

INSERT INTO [dbo].[Products] 
    ( [Name], [Description], [Price], [ImageUrl], [Category], [Brand])
VALUES 
    ( 'Velvet Night Dress', 'Elegant dark purple velvet evening dress', 450.00, 'https://britishretro.co.uk/wp-content/uploads/2023/11/001-Ava-gardner-50s-style-purple-pencil-dress-700x955.jpg', 'WOMEN', 'ZARA'),
    ( 'Lavender Office Blazer', 'Sophisticated blazer in soft lavender shades', 320.00, 'https://www.theambitioncollective.in/cdn/shop/products/B22I0996.jpg?v=1675251179', 'WOMEN', 'H&M'),
    ( 'Purple Silk Top', 'Delicate silk top perfect for summer evenings', 180.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjranYilnjT86Y9VtZPbf1SdvH1mdTG8dM3A&s', 'WOMEN', 'ZARA'),
    ( 'Amethyst Pleated Skirt', 'Midi pleated skirt with purple reflections', 240.00, 'https://www.ainahariz.com/wp-content/uploads/2024/12/20.jpg', 'WOMEN', 'ZARA'),
    ( 'White Oxford Shirt', 'Premium slim-fit cotton Oxford shirt', 160.00, 'https://ashanderie.com/cdn/shop/files/everyday-shirts-white-oxford-wrinkle-free-shirt-1236938054.jpg?v=1778093590', 'MEN', 'POLO'),
    ( 'Deep Purple Polo Shirt', 'Classic polo shirt with embroidered logo', 145.00, 'https://www.bladeandblue.com/cdn/shop/files/PurplePoloMain1000_61d89595-edb2-4602-9a3d-b03e8551c327_grande.png?v=1774675402', 'MEN', 'POLO'),
    ( 'Urban Grey Hoodie', 'Comfortable cotton hoodie with kangaroo pocket', 195.00, 'https://static.vecteezy.com/system/resources/thumbnails/040/220/065/small/ai-generated-portrait-of-a-young-african-american-man-in-a-hooded-sweatshirt-on-a-city-street-photo.jpg', 'MEN', 'H&M'),
    ( 'Dino-Purple Pajamas', 'Organic cotton pajama set with fun prints', 85.00, 'https://assets.theplace.com/image/upload/t_plp_img_m,f_auto,q_auto,dpr_1/v1/ecom/assets/products/TCP/3050844/3050844_1171.png', 'KIDS', 'H&M'),
    ( 'Junior Windbreaker', 'Lightweight rain-resistant jacket for kids', 220.00, 'https://contents.mediadecathlon.com/p2960289/k$8a4ec7e28f53eb6fff8330a7f3058601/sq/jacheta-protectie-ploaie-fotbal-viralto-club-negru-copii.jpg?format=auto&f=969x969', 'KIDS', 'ZARA'),
    ( 'Colorful Sock Set', 'Pack of 5 pairs of fun, high-quality socks', 35.00, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRvMc9BKE-xQQlZyUHStQ5CpVOr0lyhkmCgA2J7ZP0NXINxRUF2I4JijytA27lR7GPgJorX661plyRpxa04GWnr6m1lEx1ImvFKHDZH_yELuCcVDcEOWdKOB2k9J6wNd2fJpDWVLUTNrA&usqp=CAc', 'KIDS', 'POLO');
GO

