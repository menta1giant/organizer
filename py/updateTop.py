#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import tomorrowDate as td
import logLastMonthDailies as llmd

data= cgi.FieldStorage()

db_file = '..\diary.db'

top3 = json.loads(data.getfirst("top3", '["189","2","159"]'))
d = data.getfirst("d", "20200701")

def create_log_file_for_new_person(pId,mnth):
    newPerson = open("..\\logs\\monthly_results\\res_" + str(pId) + ".json","w+")
    newPerson.write(json.dumps({"pId": pId, "firstAppearance": mnth, "lastAppearance": mnth, "data": [[mnth,0]]}))
    newPerson.close()

def select_by_date(dt):
    cur = conn.cursor()
    cur.execute("SELECT * FROM top WHERE Date=" + dt)
    return cur

def create_connection(db_file):
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)
 
    return None

conn = create_connection(db_file)

cur = conn.cursor()

def new_entry(conn, data):

    sql = "INSERT INTO top(Date,'1','2','3') VALUES(?,?,?,?)"
    try:
        if (d[6:8] == '01'): reset_cm_points()
        add_points()
        cur = conn.cursor()
        cur.execute(sql, data)
        conn.commit()
        #tomorrowDate = td.getDate()
    except Error as e:
        print(e)

def update_entry(conn):

    sql = "UPDATE top SET '1'='" + str(top3[0]) + "', '2'='" + str(top3[1]) + "', '3'='" + str(top3[2]) + "' WHERE Date=" + str(d)
    try:
        remove_points()
        add_points()
        cur = conn.cursor()
        cur.execute(sql)
        conn.commit()
    except Error as e:
        print(e)
    
def reset_cm_points():
    log_last_month_points()
    sql = "UPDATE people SET 'pointslm'=0"
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit() 

def log_last_month_points():
    mnth = str(int(d) // 100 - 1)
    if (mnth[4:6] == '00'):
        mnth = str(int(mnth)-88)
    llmd.log_last_month_dailies(mnth)
    f = open("..\\logs\\top" + mnth + ".json","w+")
    cur = conn.cursor()
    cur.execute("SELECT ID,pointslm FROM people WHERE pointslm>0")
    rows = cur.fetchall()
    for pers in rows:
        fpth = "..\\logs\\monthly_results\\res_" + str(pers[0]) + ".json"
        res = open(fpth,"r")
        resRead = json.loads(res.read())
        resRead["lastAppearance"] = mnth
        if (resRead["data"][0][0] == int(mnth)): resRead["data"] = []
        resRead["data"].append([int(mnth),pers[1]])
        res.close()
        res = open(fpth,"w")
        res.write(json.dumps(resRead))
        res.close()
    rows = json.dumps(rows)
    f.write(rows)
    f.close()

def add_points():
    for i in range(3):
        sql = "UPDATE people SET points=points + " + str(3-i) + ", pointslm = pointslm + " + str(3-i) + " WHERE ID=" + top3[i]
        try:
            cur = conn.cursor()
            cur.execute(sql)
            conn.commit()
        except Error as e:
            print(e)

def remove_points():
    cur = conn.cursor()
    cur.execute("SELECT * FROM top WHERE Date=" + str(d))
    oldTop3 = cur.fetchone()
    for i in range(3):
        sql = "UPDATE people SET points=points - " + str(3-i) + ", pointslm = pointslm - " + str(3-i) + " WHERE ID=" + str(oldTop3[i+1])
        try:
            cur = conn.cursor()
            cur.execute(sql)
            conn.commit()
        except Error as e:
            print(e)



for i in range(3):
    if (not(str.isdigit(top3[i])) and len(top3[i])):
        sql = "INSERT INTO people(Name) VALUES(?)"
        data = (top3[i],)
        try:
            cur = conn.cursor()
            cur.execute(sql, data)
            conn.commit()
            
            top3[i] = str(cur.lastrowid)
            create_log_file_for_new_person(int(top3[i]),(int(d) // 100))
        except Error as e:
            print(e)

cur = select_by_date(str(d))
rows = cur.fetchall()

if (rows):
    update_entry(conn)
else:
    if (top3[0] or top3[1] or top3[2]): new_entry(conn,(d,str(top3[0]),str(top3[1]),str(top3[2]),))

cur = select_by_date(str(d))

row = cur.fetchone()
print("Content-type: text/plain\n")
print(row)
