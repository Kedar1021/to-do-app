import sqlite3
import os

db_path = 'db.sqlite3'
print(f"Checking database at: {os.path.abspath(db_path)}")

if not os.path.exists(db_path):
    print("Database file not found!")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables found:")
    for table in tables:
        print(table[0])
    
    if ('tasks_task',) in tables:
        print("\ntasks_task table exists.")
    else:
        print("\ntasks_task table MISSING.")
    conn.close()
