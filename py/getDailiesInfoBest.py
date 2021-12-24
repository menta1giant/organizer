#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import createConnection as cconn
import getLatestDateInDatabase as gldid
db_file = '..\diary.db'
data= cgi.FieldStorage()
daily = data.getfirst("daily",7)
conn = cconn.create_connection(db_file)
ld = gldid.get_latest_date_in_database(conn)

conn = cconn.create_connection(db_file)
sql = "SELECT Category FROM daily WHERE ID =" + str(daily)
cur = conn.cursor()
cur.execute(sql)
cat = cur.fetchone()

sql = "SELECT Modifier FROM daily_cat WHERE ID = " + str(cat[0])
cur = conn.cursor()
cur.execute(sql)
m = cur.fetchone()

modifier = "desc"
if (m[0]): modifier = "asc"
sql = "SELECT Date, c" + str(daily) + " FROM daily_res WHERE c" + str(daily) + " <> '' AND c" + str(daily) + " > 1  order by c" + str(daily) + " " + modifier + " limit 5"
cur = conn.cursor()
cur.execute(sql)
rows = cur.fetchall()

op = {}
op['top5'] = rows
sql = "SELECT Date, c" + str(daily) + " FROM daily_res WHERE c" + str(daily) + " <> '' AND c" + str(daily) + " > 1 AND Date > " + str(ld // 100 * 100) + " order by c" + str(daily) + " " + modifier + " limit 1"

cur = conn.cursor()
cur.execute(sql)
row = cur.fetchone()

if (not(row)): row = [20160101,'']
op['bestm'] = row

sql = "SELECT Date, c" + str(daily) + " FROM daily_res WHERE c" + str(daily) + " <> '' AND c" + str(daily) + " > 1 AND Date > " + str(ld // 10000 * 10000) + " order by c" + str(daily) + " " + modifier + " limit 1"

cur = conn.cursor()
cur.execute(sql)
row = cur.fetchone()
conn.close()
if (not(row)): row = [20160101,'']
op['besty'] = row

print("Content-type: text/json\n")
print(json.dumps(op))

