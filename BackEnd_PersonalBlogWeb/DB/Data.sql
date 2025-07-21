USE Personal_Blog_Web;
GO
/******************************************************************************* 
   Insert Sample Data 
*******************************************************************************/
-- INSERT USERS (Role: 0 - User, 1 - Moderator, 2 - Admin)
INSERT INTO Users (Username, FullName, Email, PasswordHash, Role, Avatar, Bio)
VALUES 
('admin', 'Admin User', 'admin@example.com', '$2a$12$Ep6jeNInO.qy.kvthnvieuLYvWDuRUtnbNCwVUdAVn0uI.Us3bmuq', 0, 'https://cdn2.tuoitre.vn/2019/5/8/mv5bmtk0odu5mdmwnv5bml5banbnxkftztgwnjy4ntexnjmv1-15572849726722144018447.jpg', 'Administrator of the blog.'),
('user1', 'John Doe', 'john@example.com', '$2a$12$Ep6jeNInO.qy.kvthnvieuLYvWDuRUtnbNCwVUdAVn0uI.Us3bmuq', 0, 'https://cdn2.tuoitre.vn/2019/5/8/mv5bmtk0odu5mdmwnv5bml5banbnxkftztgwnjy4ntexnjmv1-15572849726722144018447.jpg', 'Tech enthusiast and blogger.'),
('user2', 'Jane Smith', 'jane@example.com', '$2a$12$Ep6jeNInO.qy.kvthnvieuLYvWDuRUtnbNCwVUdAVn0uI.Us3bmuq', 0, 'https://cdn2.tuoitre.vn/2019/5/8/mv5bmtk0odu5mdmwnv5bml5banbnxkftztgwnjy4ntexnjmv1-15572849726722144018447.jpg', 'Writer and traveler.'),
('user3', 'Alice Wonderland', 'alice@example.com', '$2a$12$Ep6jeNInO.qy.kvthnvieuLYvWDuRUtnbNCwVUdAVn0uI.Us3bmuq', 0, 'https://cdn2.tuoitre.vn/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756.jpg', 'Passionate about design.'),
('user4', 'Bob Builder', 'bob@example.com', '$2a$12$Ep6jeNInO.qy.kvthnvieuLYvWDuRUtnbNCwVUdAVn0uI.Us3bmuq', 0, 'https://cdn2.tuoitre.vn/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756.jpg', 'Loves coding and coffee.'),
('user5', 'Chris Pine', 'chris@example.com', '$2a$12$Ep6jeNInO.qy.kvthnvieuLYvWDuRUtnbNCwVUdAVn0uI.Us3bmuq', 0, 'https://cdn2.tuoitre.vn/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756.jpg', 'Part-time blogger, full-time reader.'),
('hoangto', 'Hoang To', 'hoangto1@gmail.com', '$2a$12$Ep6jeNInO.qy.kvthnvieuLYvWDuRUtnbNCwVUdAVn0uI.Us3bmuq', 1, 'https://cdn2.tuoitre.vn/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756.jpg', 'Admin'),
('hoang', 'Sobin Hoang To', 'hoangto2@gmail.com', '$2a$12$Ep6jeNInO.qy.kvthnvieuLYvWDuRUtnbNCwVUdAVn0uI.Us3bmuq', 1, 'https://cdn2.tuoitre.vn/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756.jpg', 'Admin');
GO

-- INSERT CATEGORIES
INSERT INTO Categories (Name, Description)
VALUES 
('Technology', 'Tech trends and tutorials.'),
('Lifestyle', 'Lifestyle tips and stories.'),
('Travel', 'Travel guides and experiences.'),
('Food', 'Delicious recipes and reviews.'),
('Gaming', 'Game reviews and news.');
GO

-- INSERT POSTS (Status: 0 - Draft, 1 - Published)
INSERT INTO Posts (Title, Content, AuthorID, CategoryID, CoverImage, Status)
VALUES
('Top 5 Programming Languages in 2025',
'Fighting to stay alive is hard-coded into our DNA, so its pretty easy to see why we love survival games. The best survival games on PC push players to their limits, presenting them with tough problems and challenging them to find creative solutions.
You need to take a lot more into account than your standard health bar in survival games. Things like hunger, thirst, and extreme temperatures will need to be considered, alongside disease and threats from any hostile enemies. Paired with exploration, foraging, and crafting tools and gear, a lot of the best survival games will put your every instinct to the test.
But in such a popular genre, it can be hard to know where to start, especially if youre jumping into the world of survival games for the first time. Below youll find our favorite examples of simulated survival on PC, whether its among the stars, deep underground, and in other dangerous environments packed with monsters, mutants, zombies, dinosaurs, or the deadliest enemy of all: other players. Here are the best survival games on PC.',
1, 1, 'https://cdn-media.sforum.vn/storage/app/media/danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh%20vi%E1%BB%87t%20nam/danh-lam-thang-canh-viet-nam-3.jpg', 1),

('Best Practices for Remote Work',
'After picking through the wreckage of the plane crash that stranded you here, youll quickly discover youre not alone. You share a mysterious island with a tribe of terrifying cannibals, and while you struggle to stay fed and hydrated, build structures from simple tents to log homes, and construct traps to snare animals, youll have to defend against the hungry and determined locals. Best of all, youve got an AI-controlled pal, Kelvin, to help you out.',
2, 2, 'https://cdn-media.sforum.vn/storage/app/media/danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh%20vi%E1%BB%87t%20nam/danh-lam-thang-canh-viet-nam-4.jpg', 1),

('Exploring Japan: Travel Guide',
'Like many rural parts of Japan, the islands in the Seto Inland Sea have been suffering from massive depopulation in recent decades, while their remaining residents have been aging at a rapid pace, causing a wide range of problems. One of the festivals main goals is to counteract these trends and revitalize the region in a sustainable and creative way by bringing contemporary art and tourism onto the islands.
Visitors to the region will be charmed not only by the intriguing art but also by the laid back, slow paced rural atmosphere of the islands villages and the beauty of the island scenery. In many ways the festival resembles the Echigo-Tsumari Art Triennale, a similar art festival, which is held every three years in a rural mountainous area of Niigata Prefecture.',
3, 3, 'https://cdn-media.sforum.vn/storage/app/media/danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh%20vi%E1%BB%87t%20nam/danh-lam-thang-canh-viet-nam-2.jpg', 1),

('10 Healthy Recipes for Busy People', 'Food content...',
4, 4, 'https://cdn-media.sforum.vn/storage/app/media/danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh%20vi%E1%BB%87t%20nam/danh-lam-thang-canh-viet-nam-1.jpg', 1),

('Top Indie Games of the Year',
'Gaming content...', 
5, 5, 'https://cdn-media.sforum.vn/storage/app/media/danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh%20vi%E1%BB%87t%20nam/danh-lam-thang-canh-viet-nam-5.jpg', 1),


('How to Setup a Dev Environment',
'Dev setup guide...', 
1, 1, 'https://cdn-media.sforum.vn/storage/app/media/danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh%20vi%E1%BB%87t%20nam/danh-lam-thang-canh-viet-nam-6.jpg', 1),

('Budget Travel Tips',
'During the festival, many new artworks by artists from Japan and overseas are exhibited on the eleven islands and other venues, in addition to a considerable number of museums and artworks already in existence, including many permanent art installations from the previous festivals. Much of the artwork remains standing after the end of the festival, justifying a visit to the area at any time of the year.
The artworks are found across the islands. Some of them stand outdoors in the fields, along the coast or in villages. Others make use of the numerous old homes which have been left abandoned due to the depopulation. The buildings are employed as exhibition spaces or have been converted into artworks themselves. In addition, there are the established museums and art sites on Naoshima, Inujima and Teshima islands.',
3, 3, 'https://cdn-media.sforum.vn/storage/app/media/danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh%20vi%E1%BB%87t%20nam/danh-lam-thang-canh-viet-nam-7.jpg', 1),

('Understanding Machine Learning',
'Inujima (犬島, literally: "dog island") is a small island off Okayama in the Seto Inland Sea that is named after a large rock resembling a sitting dog. Like nearby Naoshima Island, Inujima has become known as a site for contemporary art and serves as a venue of the Setouchi Triennale modern art festival. Due to its small size, the peaceful island can be explored entirely on foot.
Before turning to contemporary art, Inujima was mostly an industrial site. During the feudal age it produced granite blocks for castle construction, and in the early 20th century a copper refinery was supposed to bring prosperity and people to the island. However, copper prices plummeted within ten years of the refinery s opening and led to its premature closure and a drop in the island s population.',
2, 1, 'https://cdn-media.sforum.vn/storage/app/media/danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh%20vi%E1%BB%87t%20nam/danh-lam-thang-canh-viet-nam-8.jpg', 1),

('Review: Zelda Breath of the Wild 2',
'In 2008, the refinery ruins were converted into the Inujima Seirensho Art Museum ("seirensho" is Japanese for "refinery") by tastefully incorporating an art gallery into the ruins. The gallery is located mostly underground and uses local materials such as granite and discarded bricks from the refinery. Among the small number of artworks on display are an intriguing tunnel of mirrors and a tribute to the late novelist Mishima Yukio, which consists of pieces of Mishimas former residence suspended in midair.
Admission tickets to the art museum are purchased at a Inujima Ticket Center next to the ferry terminal, a 200 meter walk from the refinerys gates. While in the past it was necessary to make advance reservations for a guided tour of the site, it is now possible to explore it on an individual basis without prior appointment.',
5, 5, 'https://cdn-media.sforum.vn/storage/app/media/danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh%20vi%E1%BB%87t%20nam/danh-lam-thang-canh-viet-nam-9.jpg', 1),

('Pending Article Example',
'Dining, shopping and lodging options are highly limited on the island. A couple of small restaurants are found in the proximity of the port, including a cafe inside the Inujima Ticket Center. The Seirensho Art Museum also has a cafe on its grounds, but outside of summer it is sometimes closed even when the museum is open. A beach with campground is found on the opposite side of the island, about a ten minute walk from the ferry terminal.',
1, 1, 'https://cdn-media.sforum.vn/storage/app/media/danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh%20vi%E1%BB%87t%20nam/danh-lam-thang-canh-viet-nam-10.jpg', 1);
GO

-- INSERT COMMENTS
INSERT INTO Comments (PostID, UserID, Content) VALUES (1, 2, 'Great article on programming!');
INSERT INTO Comments (PostID, UserID, Content, ParentCommentID) VALUES (1, 1, 'Thanks John!', 1);
INSERT INTO Comments (PostID, UserID, Content) VALUES (3, 3, 'I want to visit Kyoto!');
INSERT INTO Comments (PostID, UserID, Content) VALUES (5, 4, 'This game is amazing!');
INSERT INTO Comments (PostID, UserID, Content) VALUES (8, 5, 'Clear explanation on ML!');
GO

-- INSERT LIKES
INSERT INTO Likes (UserID, PostID) VALUES (2, 1);
INSERT INTO Likes (UserID, PostID) VALUES (3, 1);
INSERT INTO Likes (UserID, PostID) VALUES (4, 5);
INSERT INTO Likes (UserID, PostID) VALUES (5, 8);
INSERT INTO Likes (UserID, CommentID) VALUES (1, 1);
INSERT INTO Likes (UserID, CommentID) VALUES (3, 3);
GO

-- INSERT NOTIFICATIONS
INSERT INTO Notifications (UserID, Message) VALUES (2, 'Jane liked your post.');
INSERT INTO Notifications (UserID, Message) VALUES (3, 'Alice replied to your comment.');
INSERT INTO Notifications (UserID, Message) VALUES (4, 'You have a new follower.');
INSERT INTO Notifications (UserID, Message) VALUES (5, 'Bob liked your comment.');
INSERT INTO Notifications (UserID, Message) VALUES (1, 'You published a new post.');
GO