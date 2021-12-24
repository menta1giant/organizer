#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import createConnection as cconn
import getLatestDateInDatabase as gldid

data= cgi.FieldStorage()
db_file = 'C:\Server\data\htdocs\diary.db'
conn = cconn.create_connection(db_file)

count = 0
temp = 0
last_month = 0
maximum = 0

for i in range(1,18):
    file = open('../logs/dailies/res_' + str(i) + '.json','w+')
    temp_dict = {'id':i,'data':[]}
    sql = "SELECT Date,c" + str(i) + " FROM daily_res"
    print(sql)
    conn = cconn.create_connection(db_file)
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    last_month = rows[0][0] // 100
    for r in rows:
        if (r[0] // 100 != last_month):
            if (count):
                mean = temp / count
                temp_dict['data'].append([last_month,mean,count,maximum])
            last_month = r[0] // 100
            temp = count = maximum = 0
        if (bool(r[1]) and int(r[1]) > 1):
            count +=1
            if (int(r[1]) > maximum): maximum = int(r[1])
            temp+= int(r[1])
    print(temp_dict)
    file.write(json.dumps(temp_dict))
    file.close()
