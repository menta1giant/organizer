#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import createConnection as cconn

data= cgi.FieldStorage()

db_file = '..\diary.db'

catName = data.getfirst('cat','')
isCheckbox = data.getfirst('iscb',0)
v = (catName,isCheckbox)

conn = cconn.create_connection(db_file)

sql = "INSERT INTO daily_cat(Name,Checkbox) VALUES(?,?)"

try:
    cur = conn.cursor()
    cur.execute(sql, v)
    conn.commit()
except Error as e:
    print(e)

conn.close()
