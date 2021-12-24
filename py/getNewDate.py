#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import cgi, cgitb
import json
import tomorrowDate as td

d = td.get_date()


print("Content-type: text/json\n")
print(json.dumps(d))

