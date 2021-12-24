#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import cgi
import json

import createConnection as cconn

data = cgi.FieldStorage()
daily = data.getfirst("target", 7)
db_file = '..\\diary.db'
conn = cconn.create_connection(db_file)
sql = "SELECT Date, c" + str(daily) + \
    " FROM daily_res order by Date desc limit 30"
cur = conn.cursor()
cur.execute(sql)
rows = cur.fetchall()

op = {
    'data': []
}

for row in rows:
    op['data'].append([row[0], row[1]])

print("Content-type: text/json\n")
print(json.dumps(op))
