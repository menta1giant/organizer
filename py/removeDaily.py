#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import sqlite3
import cgi, cgitb
import createConnection as cconn

db_file = '..\diary.db'
data= cgi.FieldStorage()
todel = data.getfirst("ID",19)
conn = cconn.create_connection(db_file)

sql = "UPDATE daily SET Category=0 WHERE ID = "+str(todel)
cur = conn.cursor()
cur.execute(sql)
conn.commit()

conn.close()
