#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import createConnection as cconn

def log_last_month_dailies(month):
    db_file = '..\diary.db'
    sql = "SELECT ID FROM daily"
    conn = cconn.create_connection(db_file)
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    tObj = {}
    for row in rows:
        s = 0 #сумма
        m = 0
        tempc = 0
        sql = "SELECT c" + str(row[0]) + " FROM daily_res WHERE c" + str(row[0]) + " <> '' AND Date > " + str(int(month) * 100)
        cur = conn.cursor()
        cur.execute(sql)
        results = cur.fetchall()
        for r in results:
            tempc +=1
            s += r[0]
            if (r[0] > m): m = r[0]
        if (tempc): tObj[row[0]] = [s / tempc,tempc,m]
    for r in tObj:
        fpth = "..\\logs\\dailies\\res_" + str(r) + ".json"
        res = open(fpth,"r")
        res_read = json.loads(res.read())
        res_read["data"].append([int(month)] + tObj[r])
        res.close()
        res = open(fpth,"w")
        res.write(json.dumps(res_read))
        res.close()
    return tObj

