USE [master]
GO

/******************************************************************************* 
   Xoá database nếu đã tồn tại 
*******************************************************************************/
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'Personal_Blog_Web')
BEGIN
    ALTER DATABASE Personal_Blog_Web SET OFFLINE WITH ROLLBACK IMMEDIATE;
    ALTER DATABASE Personal_Blog_Web SET ONLINE;
    DROP DATABASE Personal_Blog_Web;
END
GO

CREATE DATABASE Personal_Blog_Web;
GO

USE Personal_Blog_Web;
GO

/******************************************************************************* 
   Tạo bảng Users 
*******************************************************************************/
CREATE TABLE Users (
    ID INT PRIMARY KEY IDENTITY,
    Username NVARCHAR(100),
    FullName NVARCHAR(150),
    Email NVARCHAR(255),
    PasswordHash NVARCHAR(255),
    Role INT,
    Avatar NVARCHAR(255),
    Bio NVARCHAR(500)
);
GO

/******************************************************************************* 
   Tạo bảng Categories 
*******************************************************************************/
CREATE TABLE Categories (
    ID INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255)
);
GO

/******************************************************************************* 
   Tạo bảng Posts 
*******************************************************************************/
CREATE TABLE Posts (
    ID INT PRIMARY KEY IDENTITY,
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    AuthorID INT FOREIGN KEY REFERENCES Users(ID),
    CategoryID INT FOREIGN KEY REFERENCES Categories(ID),
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    CoverImage NVARCHAR(255),
    Status TINYINT NOT NULL DEFAULT 0
);
GO

/******************************************************************************* 
   Tạo bảng Comments
*******************************************************************************/
CREATE TABLE Comments (
    ID INT PRIMARY KEY IDENTITY,
    PostID INT FOREIGN KEY REFERENCES Posts(ID),
    UserID INT FOREIGN KEY REFERENCES Users(ID),
    Content NVARCHAR(1000) NOT NULL,
    ParentCommentID INT NULL FOREIGN KEY REFERENCES Comments(ID)
);
GO

/******************************************************************************* 
   Tạo bảng Likes
*******************************************************************************/
CREATE TABLE Likes (
    ID INT PRIMARY KEY IDENTITY,
    UserID INT FOREIGN KEY REFERENCES Users(ID),
    PostID INT NULL FOREIGN KEY REFERENCES Posts(ID),
    CommentID INT NULL FOREIGN KEY REFERENCES Comments(ID),
    CONSTRAINT CK_Likes_OnlyOneTarget CHECK (
        (PostID IS NOT NULL AND CommentID IS NULL)
        OR (PostID IS NULL AND CommentID IS NOT NULL)
    )
);
GO

/******************************************************************************* 
   Tạo bảng Notifications
*******************************************************************************/
CREATE TABLE Notifications (
    ID INT PRIMARY KEY IDENTITY,
    UserID INT FOREIGN KEY REFERENCES Users(ID),
    Message NVARCHAR(255),
    IsRead BIT DEFAULT 0
);
GO