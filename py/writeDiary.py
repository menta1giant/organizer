#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json

data= cgi.FieldStorage()

text = json.loads(data.getfirst("data0", '""'))
d = data.getfirst("d", "20160103")

f = open("..\\diary\\" + str(d) + ".txt","w+")
f.write(text);
f.close();

print("Content-type: text/plain\n")
print('Success')
