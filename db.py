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

# Commit changes and close the connection
conn.commit()
conn.close()

print("SQLite database 'test.db' created with sample users.")
