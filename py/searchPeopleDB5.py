#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import createConnection as cconn

data= cgi.FieldStorage()

db_file = '..\diary.db'

name = data.getfirst("string", "")

conn = cconn.create_connection(db_file)

cur = conn.cursor()
cur.execute("SELECT ID, Name FROM people WHERE Name LIKE '%" + str(name) + "%'")

rows = cur.fetchall()
outputNames = []
     
for row in range(min(5,len(rows))):
    outputNames.append({});
    outputNames[row]['id'] = rows[row][0]
    outputNames[row]['name'] = rows[row][1]

conn.close()

print("Content-type: text/json\n")
print(json.dumps(outputNames))

