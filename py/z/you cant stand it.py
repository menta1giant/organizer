import sqlite3
from sqlite3 import Error
import createConnection as cconn
import cgi, cgitb
import json

data= cgi.FieldStorage()
target = data.getfirst("target",183)
db_file = 'C:\Server\data\htdocs\diary.db'


resArr = []

sql = 'select * from top order by Date desc limit 14'
conn = cconn.create_connection(db_file)
cur = conn.cursor()
cur.execute(sql)
rows = cur.fetchall()
for row in rows:
    resArr.append([row[0],0])
    for i in range(3):
        if (row[i+1] == target):
            resArr[len(resArr)-1][1] += (3-i)


op = {
    'data': resArr
    }

print("Content-type: text/json\n")
print(json.dumps(op))
