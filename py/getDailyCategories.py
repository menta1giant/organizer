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
cur.execute("SELECT ID, Name, Checkbox FROM daily_cat")

rows = cur.fetchall()
outputNames = {}
     
for row in rows:
    outputNames[row[0]] = {'name':row[1],'units':[],'checkbox':row[2]}

cur = conn.cursor()
cur.execute("SELECT ID, Name, Category FROM daily")
rows = cur.fetchall()
for row in rows:
    outputNames[row[2]]['units'].append([row[0],row[1]])

outputNames.pop(0,None)

conn.close()

print("Content-type: text/json\n")
print(json.dumps(outputNames))
