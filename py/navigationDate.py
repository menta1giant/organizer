#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import cgi

import formatDate

data = cgi.FieldStorage()
dt = data.getfirst("d", "20160101")
ch = data.getfirst("ch", 0)

d = formatDate.stupid_date_to_normal_date(str(dt), int(ch), False)

print("Content-type: text/plain\n")
print(d)
