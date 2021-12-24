#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import json
import cgi, cgitb
import createConnection as cconn

def get_name_by_id(pid):
    db_file = '..\diary.db'
    conn = cconn.create_connection(db_file)
    cur = conn.cursor()
    sql = 'SELECT name FROM people WHERE ID = ' + str(pid)
    cur.execute(sql)
    row = cur.fetchone()
    return row[0]
