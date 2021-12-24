#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import createConnection as cconn

data= cgi.FieldStorage()

db_file = '..\diary.db'

pId = data.getfirst("pId", "17")

conn = cconn.create_connection(db_file)

cur = conn.cursor()
cur.execute("SELECT points FROM people WHERE ID = " + str(pId))

row = cur.fetchone()
output = row[0]
if not(output): output = 0

conn.close()

print("Content-type: text/json\n")
print(json.dumps(output))
