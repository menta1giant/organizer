#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import createConnection as cconn
import getLatestDateInDatabase as gldid

db_file = 'C:\Server\data\htdocs\diary.db'

op = []

sql = "SELECT ID FROM daily"
conn = cconn.create_connection(db_file)
cur = conn.cursor()
cur.execute(sql)
rows = cur.fetchall()
conn.close()
for cat in rows:
    temp_dict = {
        'id': cat[0],
        'last':0,
        'lm':0,
        'ly':0,
        'maxm':0,
        'maxy':0
        }
    sql = "SELECT c" + str(cat[0]) + " FROM daily_res WHERE c" + str(cat[0]) + " <> '' order by Date desc limit 1"
    conn = cconn.create_connection(db_file)
    cur = conn.cursor()
    cur.execute(sql)
    row = cur.fetchone()
    temp_dict['last'] = row[0]
    conn.close()
    file = open('../logs/dailies/res_' + str(cat[0]) + '.json','r')
    data = json.loads(file.read())
    if (len(data['data'])):
        length = len(data['data']) - 1
        temp_dict['lm'] = data['data'][length][1]
        temp_dict['maxm'] = data['data'][length][3]
        temp = data['data'][length][1]* data['data'][length][2] 
        tempc = data['data'][length][2]
        tempm = data['data'][length][3]
        #print(temp_dict['id'])
        while (length > 0 and data['data'][length-1][0] // 100 == data['data'][length][0] // 100):
            #print(data['data'][length-1][0] // 100)
            temp += data['data'][length-1][1] * data['data'][length-1][2] 
            tempc += data['data'][length-1][2]
            if (data['data'][length - 1][3] > tempm): tempm = data['data'][length - 1][3]
            length-=1
        temp_dict['ly'] = temp / tempc
        temp_dict['maxy'] = tempm
    file.close()
    op.append(temp_dict)


print("Content-type: text/json\n")
print(json.dumps(op))

