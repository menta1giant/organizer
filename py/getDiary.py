#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import cgi
import json

data = cgi.FieldStorage()

d = data.getfirst("d", "20160101")


def read_file(fn):
    r = ''
    try:
        f = open(fn, 'r')
        r = f.read()
    except IOError:
        f = open(fn, 'w')
    f.close()
    return r


fn = "..\\diary\\" + str(d) + ".txt"
text = json.dumps(read_file(fn))

print("Content-type: text/plain\n")
print(text)
