import sqlite3

# Connect to the SQLite database (creates the file if not exist)
conn = sqlite3.connect('test.db')
cursor = conn.cursor()

# Create a users table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        type TEXT NOT NULL
    )
''')

# Insert sample users
cursor.execute('''
    INSERT INTO users (username, email, password, type) VALUES
    ('admin_user', 'admin@example.com', 'admin123', 'admin'),
    ('student_user', 'student@example.com', 'student123', 'student')
''')

# Create a clubs table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS clubs (
        id INTEGER PRIMARY KEY,
        club_name TEXT NOT NULL,
        club_topic TEXT NOT NULL,
        club_university TEXT NOT NULL,
        admin_id INTEGER NOT NULL,
        FOREIGN KEY (admin_id) REFERENCES users (id)
    )
''')

# Create a club_users junction table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS club_users (
        club_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (club_id) REFERENCES clubs (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        PRIMARY KEY (club_id, user_id)
    )
''')

# Insert sample clubs
cursor.execute('''
    INSERT INTO clubs (club_name, club_topic, club_university, admin_id) VALUES
    ('Programming Club', 'Coding', 'Example University', 1),
    ('Art Club', 'Fine Arts', 'Sample College', 2)
''')

# Insert sample club_users relationships
cursor.execute('''
    INSERT INTO club_users (club_id, user_id) VALUES
    (1, 2),  -- Adding student_user to Programming Club
    (2, 1)   -- Adding admin_user to Art Club
''')

# Commit changes and close the connection
conn.commit()
conn.close()

print("SQLite database 'test.db' created with sample users, clubs, and club_users relationships.")
