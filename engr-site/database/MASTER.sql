SET foreign_key_checks = 0;
DROP TABLE IF EXISTS Users, Files, Tags, FileTags, Pages, Comments;
SET foreign_key_checks = 1;

CREATE TABLE Users (
  UserId INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(255),
  Email VARCHAR(255),
  Password VARCHAR(255),
  Role VARCHAR(255),
  PRIMARY KEY (UserId)
);


CREATE TABLE Files (
  FileId INT NOT NULL AUTO_INCREMENT,
  FileName VARCHAR(255),
  S3Url VARCHAR(255),
  UploadedUserId INT,
  PRIMARY KEY (FileId),
  FOREIGN KEY (UploadedUserId) REFERENCES Users(UserId) ON DELETE CASCADE
);


CREATE TABLE Tags (
  TagId INT NOT NULL AUTO_INCREMENT,
  TagName VARCHAR(255),
  PRIMARY KEY (TagId)
);


CREATE TABLE FileTags (
  FileTagId INT NOT NULL AUTO_INCREMENT,
  FileId INT,
  TagId INT,
  PRIMARY KEY (FileTagId),
  FOREIGN KEY (TagId) REFERENCES Tags(TagId) ON DELETE CASCADE,
  FOREIGN KEY (FileId) REFERENCES Files(FileId) ON DELETE CASCADE
);


CREATE TABLE Pages (
  PageId INT NOT NULL AUTO_INCREMENT,
  PageName VARCHAR(255) NOT NULL,
  PageUrl VARCHAR(255) NOT NULL,
  PRIMARY KEY (PageId),
  UNIQUE KEY UniquePageUrl (PageUrl)
);


CREATE TABLE Comments (
  CommentId INT NOT NULL AUTO_INCREMENT,
  UserId INT NOT NULL,
  PageId INT NOT NULL,
  UserName VARCHAR(255) NOT NULL,
  CommentText TEXT NOT NULL,
  CommentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (CommentId),
  FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
  FOREIGN KEY (PageId) REFERENCES Pages(PageId) ON DELETE CASCADE
);





