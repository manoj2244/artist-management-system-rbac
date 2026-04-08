BEGIN;

TRUNCATE TABLE songs, artist_user_links, artists, users RESTART IDENTITY CASCADE;

INSERT INTO users (
  first_name,
  last_name,
  email,
  password,
  phone,
  dob,
  gender,
  address,
  role
)
VALUES
  (
    'Suresh',
    'Adhikari',
    'suresh.adhikari@gmail.com',
    '46fc0d08807f52b6cd3ae7c7d123ef50:5112c6c3323e16e32780f3efb752e6c290f2b6fea6a33c727b07bdf02688fe3c1cb17eef4077abec12ce94dd69424b4cd7077addb7343ccd49f4fa122860df11',
    '+977-9801000001',
    '1989-02-14',
    'm',
    'Kathmandu, Bagmati',
    'super_admin'
  ),
  (
    'Pramila',
    'Shrestha',
    'pramila.shrestha@gmail.com',
    '54b14d7bd45fdb874d75ba8e95e3c607:c5922196e04647d9255e7e0c216d48e36d40112eeb505c2c15d4466ce68bb697c085c81cee69b1b9057dbeebd6832543a25999df4f4b39b9637f79f438f78c52',
    '+977-9801000002',
    '1993-06-09',
    'f',
    'Pokhara, Gandaki',
    'artist_manager'
  ),
  (
    'Nabin',
    'Karki',
    'nabin.karki@gmail.com',
    'aa1bf9b1a2f2bf6cede6df588c7cf112:a09cc585e1c857abc001af47b2716e9b955b4a1371f52bf6637cb0140f6d02507f8b12c72b21cbea8f9205017b7a1da1ac5956d63a01203d9e049cfb2e243cb1',
    '+977-9801000003',
    '1997-11-21',
    'm',
    'Lalitpur, Bagmati',
    'artist'
  );

INSERT INTO artists (
  name,
  dob,
  gender,
  address,
  first_release_year,
  no_of_albums_released
)
VALUES
  ('Nabin Karki', '1997-11-21', 'm', 'Lalitpur, Bagmati', 2018, 3),
  ('Sajina Rai', '1994-03-17', 'f', 'Dharan, Koshi', 2015, 4),
  ('Aayush Gurung', '1992-09-30', 'm', 'Pokhara, Gandaki', 2012, 6);

INSERT INTO artist_user_links (user_id, artist_id)
SELECT u.id, a.id
FROM users u
JOIN artists a ON a.name = 'Nabin Karki'
WHERE u.email = 'nabin.karki@gmail.com';

INSERT INTO songs (artist_id, title, album_name, genre)
VALUES
  ((SELECT id FROM artists WHERE name = 'Nabin Karki'), 'Sajha Ko Geet', 'Bagmati Sessions', 'rock'),
  ((SELECT id FROM artists WHERE name = 'Nabin Karki'), 'Raat Ko Batti', 'Bagmati Sessions', 'rnb'),
  ((SELECT id FROM artists WHERE name = 'Sajina Rai'), 'Pahad Ko Bato', 'Koshi Lights', 'country'),
  ((SELECT id FROM artists WHERE name = 'Sajina Rai'), 'Purano Maya', 'Koshi Lights', 'classic'),
  ((SELECT id FROM artists WHERE name = 'Aayush Gurung'), 'Pokhara Rain', 'Lake Side', 'jazz'),
  ((SELECT id FROM artists WHERE name = 'Aayush Gurung'), 'Mirmire', 'Lake Side', 'rnb');

COMMIT;
