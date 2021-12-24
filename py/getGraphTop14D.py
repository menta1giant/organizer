#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import cgi
import json

import createConnection as cconn

data = cgi.FieldStorage()
target = int(data.getfirst("target", ))
db_file = '..\\diary.db'

resArr = []

sql = 'select * from top order by Date desc limit 14'
conn = cconn.create_connection(db_file)
cur = conn.cursor()
cur.execute(sql)
rows = cur.fetchall()
for row in rows:
    resArr.append([row[0], 0])
    for i in range(3):
        if (row[i + 1] == target):
            resArr[len(resArr) - 1][1] += (3 - i)

op = {
    'data': resArr
}
conn.close()
print("Content-type: text/json\n")
print(json.dumps(op))
