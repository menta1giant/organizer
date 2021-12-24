#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import sqlite3
import cgi, cgitb
import createConnection as cconn

db_file = '..\diary.db'
data= cgi.FieldStorage()
target = data.getfirst("target",7)
moveto = data.getfirst("moveto",1)
conn = cconn.create_connection(db_file)
sql = "UPDATE daily SET Category=" + str(moveto) + " WHERE ID=" + str(target)

cur = conn.cursor()
cur.execute(sql)
conn.commit()
conn.close()
