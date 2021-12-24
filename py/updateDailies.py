#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import cgi
import json
from sqlite3 import Error

import createConnection as cconn

data = cgi.FieldStorage()

db_file = '..\\diary.db'

res = json.loads(
    data.getfirst(
        "res",
        '{"1":"","2":"","3":"","5":"","6":"","7":"","8":"","9":"","10":"","11":"","13":"",'
        '"14":"","15":"","17":""}'))
d = data.getfirst("d", "20200610")

conn = cconn.create_connection(db_file)

cur = conn.cursor()


def new_entry(conn, data):
    string = ''
    string2 = ''
    i = 0
    for attr, value in res.items():
        string += ("'c" + str(attr) + "'")
        string2 += "?"
        if (not (i == len(res) - 1)):
            string += ","
            string2 += ","
        i += 1

    sql = "INSERT INTO daily_res(Date," + string + \
        ") VALUES(?," + string2 + ")"
    try:
        cur = conn.cursor()
        cur.execute(sql, data)
        conn.commit()
    except Error as e:
        print(e)


def update_entry(conn):
    string = ''
    i = 0
    for attr, value in res.items():
        v = value
        if (not (v)):
            v = "''"
        if (not (i == 0)):
            string += ", "
        string += "'c" + str(attr) + "'=" + str(v)
        i += 1

    sql = "UPDATE daily_res SET " + string + " WHERE Date=" + str(d)

    try:
        cur = conn.cursor()
        cur.execute(sql)
        conn.commit()
    except Error as e:
        print(e)


cur = conn.cursor()
cur.execute("SELECT * FROM daily_res WHERE Date=" + str(d))
rows = cur.fetchall()

if (rows):
    update_entry(conn)
else:
    tup = (d,)
    for attr, value in res.items():
        tup += (value,)

    new_entry(conn, tup)

cur = conn.cursor()
cur.execute("SELECT * FROM daily_res WHERE Date=" + str(d))

row = cur.fetchone()
print("Content-type: text/plain\n")
print(row)
