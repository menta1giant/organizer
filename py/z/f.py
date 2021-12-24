import sqlite3
from sqlite3 import Error
import cgi, cgitb
import json

def increaseF(f,val):
    print(f)
    global temp, max_value
    if not(cy):
        resArr.append([f,val])
    local_f = f
    local_f+=1
    if (local_f % 100 == 13):
            if (cy):
                resArr.append([local_f // 100,temp])
                if (temp > max_value): max_value = temp
                temp = 0
            local_f+=88
    return local_f

data= cgi.FieldStorage()

db_file = 'C:\Server\data\htdocs\diary.db'

target = data.getfirst("target",189)
f = data.getfirst("from",201712)
t = data.getfirst("to",202005)

cy = False
max_value = 0
temp = 0

file = open('../logs/monthly_results/res_' + str(target) + '.json','r')

data = json.loads(file.read())



resArr = []

for i in range(len(data["pts"])):
    if (f > data["pts"][i][0]): continue
    while f != data["pts"][i][0]:
        f = increaseF(f,0)
    temp+= data["pts"][i][1]
    if (data["pts"][i][1] > max_value):
        max_value = data["pts"][i][1]
    f = increaseF(f,data["pts"][i][1])


for i in range(data["pts"][len(data["pts"])-1][0]+1,t+1):
    if (i % 100 > 12):
        continue
    if not(cy): resArr.append([i,0])

if (cy): resArr.append([t // 100,temp])

op = {
    'data': resArr,
    'max': max_value
    }

file.close()

print("Content-type: text/json\n")
print(json.dumps(op))

