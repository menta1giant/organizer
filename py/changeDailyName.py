#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import cgi

import createConnection as cconn

db_file = '..\\diary.db'
data = cgi.FieldStorage()
editId = data.getfirst("id", 2)
table = data.getfirst("table", "daily")
newName = data.getfirst("name", "")
conn = cconn.create_connection(db_file)

sql = "UPDATE " + table + " SET Name = '" + \
    newName + "' WHERE ID = " + str(editId)
cur = conn.cursor()
cur.execute(sql)
conn.commit()
conn.close()
