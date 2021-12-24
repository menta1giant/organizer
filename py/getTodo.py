#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json
import formatDate

data= cgi.FieldStorage()

d1 = data.getfirst("d1", "20160101")

def read_file(fn):
    r = '[]'
    try:
        f = open(fn, 'r')
        r = f.read()
        if not(r): r = '[]'
    except IOError:
        f = open(fn, 'w')
    f.close();
    return json.loads(r)

fn = "..\\diary\\todo\\" + str(d1) + ".json"

output=[read_file(fn)]

d2 = formatDate.stupid_date_to_normal_date(str(d1),1,False)


fn = "..\\diary\\todo\\" + str(d2) + ".json"

output.append(read_file(fn))


print("Content-type: text/plain\n")
print(json.dumps(output))


