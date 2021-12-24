#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import cgi, os
import cgitb; cgitb.enable()
import sqlite3
from sqlite3 import Error
import createConnection as cconn
import json

form = cgi.FieldStorage()
personName = form.getfirst("sNameInput")
personDesc = form.getfirst("sDescInput")
personId = form.getfirst("pId")

f = open('../desc/desc_' + personId + '.txt', 'w+',encoding='utf8')
f.write(personDesc)
f.close()

if (personName):
    db_file = '..\diary.db'
    conn = cconn.create_connection(db_file)
    sql = "UPDATE people SET name = '" + personName + "' WHERE ID=" + personId
    try:
        cur = conn.cursor()
        cur.execute(sql)
        conn.commit()
    except Error as e:
            print(e)
    conn.close()
        
print("Content-type: text/json\n")
print(json.dumps((personName,personDesc,personId)))
