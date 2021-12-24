#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import createConnection as cconn

data= cgi.FieldStorage()

db_file = '..\diary.db'

d = data.getfirst("d", "20200528")

conn = cconn.create_connection(db_file)

cur = conn.cursor()
cur.execute("PRAGMA table_info(daily_res)")

row1 = cur.fetchall()

cur = conn.cursor()
cur.execute("SELECT * FROM daily_res WHERE Date=" + str(d))

row2 = cur.fetchone()

obj = {}
if (row2):
    for i in range(len(row2)):
        obj[row1[i][1]] = row2[i]

conn.close()

obj = json.dumps(obj)
print("Content-type: text/plain\n")
print(obj)
