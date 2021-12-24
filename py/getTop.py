#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import createConnection as cconn

data= cgi.FieldStorage()

db_file = '..\diary.db'

d = data.getfirst("d", "20191226")

conn = cconn.create_connection(db_file)
cur = conn.cursor()
cur.execute("SELECT * FROM top WHERE Date=" + str(d))
row1 = cur.fetchone()
mas = []
for i in range(3):
    if (len(str(row1[i+1]))):
        cur = conn.cursor()
        cur.execute("SELECT * FROM people WHERE ID=" + str(row1[i+1]))
        row2 = cur.fetchone()
        if (not(row2)): row2 = row2 = [0,'']
    else:
        row2 = [0,'']
    mas.append([row2[0],row2[1]])


mas = json.dumps(mas)
print("Content-type: text/plain\n")
print(mas)
