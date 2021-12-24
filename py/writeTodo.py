#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import cgi

import formatDate

data = cgi.FieldStorage()

text1 = data.getfirst("data1", '[1,2]')
text2 = data.getfirst("data2", '[4,5]')
d1 = data.getfirst("d1", "20160101")
d2 = formatDate.stupid_date_to_normal_date(str(d1), 1, False)

f = open("..\\diary\\todo\\" + str(d1) + ".json", "w+")
f.write(text1)
f.close()

f = open("..\\diary\\todo\\" + str(d2) + ".json", "w+")
f.write(text2)
f.close()

print("Content-type: text/plain\n")
print('Success')
