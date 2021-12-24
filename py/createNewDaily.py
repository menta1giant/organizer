#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import sqlite3
import cgi, cgitb
import json
import createConnection as cconn

db_file = '..\diary.db'
data= cgi.FieldStorage()
nm = data.getfirst("name","")
conn = cconn.create_connection(db_file)

data = (nm,1)
sql = "INSERT INTO daily(Name,Category) VALUES(?,?)"

cur = conn.cursor()
cur.execute(sql, data)
conn.commit()

resfile = {
    "id": cur.lastrowid,
    "data": []
}

newid = str(cur.lastrowid)
dd = '../logs/dailies/res_'+newid+'.json'
file = open(dd,'w+')
file.write(json.dumps(resfile))
file.close()

sql = 'ALTER TABLE daily_res ADD c'+ newid +' DOUBLE'
cur = conn.cursor()
cur.execute(sql)
conn.commit()


print("Content-type: text/plain\n")
print(newid)
