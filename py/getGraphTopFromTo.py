#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import cgi
import json

import createConnection as cconn
import getLatestDateInDatabase as gldid


def increase_f(f, val):
    global temp, maxValue
    if (not (cy) and ((f % 100) <= 12) and ((f % 100) != 0)):
        resArr.append([f, val])
    localF = f
    localF += 1
    if (localF % 100 == 13):
        if (cy):
            check_if_dailies()
            resArr.append([localF // 100, temp])
            if (temp > maxValue):
                maxValue = temp
            temp = 0
            tempc = 0
        localF += 88
    return localF


def check_if_dailies():
    global m, temp, tempc
    if (m == "dailies" and tempc):
        temp = temp / tempc


data = cgi.FieldStorage()
db_file = '..\\diary.db'
conn = cconn.create_connection(db_file)
currentMonth = int(gldid.get_latest_date_in_database(conn)) // 100

target = data.getfirst("target", 1)
f = int(data.getfirst("from", 201701))
t = int(data.getfirst("to", currentMonth))
cy = int(data.getfirst("cy", 0))
m = data.getfirst("mode", "monthly_results")

maxValue = 0
temp = 0
tempc = 0

file = open('../logs/' + m + '/res_' + str(target) + '.json', 'r')

data = json.loads(file.read())

resArr = []

for i in range(len(data["data"])):
    if (f > data["data"][i][0]):
        continue
    while f != data["data"][i][0]:
        f = increase_f(f, 0)
    multiplier = 1
    if (len(data["data"][i]) > 2):
        multiplier = data["data"][i][2]
    temp += data["data"][i][1] * multiplier
    tempc += multiplier
    if (data["data"][i][1] > maxValue):
        maxValue = data["data"][i][1]
    f = increase_f(f, data["data"][i][1])

for ir in range(f, t + 1):
    # print(ir)
    if (((ir % 100) > 12) or ((ir % 100) == 0)):
        continue
    if not (cy):
        resArr.append([ir, 0])

if (cy):
    check_if_dailies()
    resArr.append([f // 100, temp])
    if (temp > maxValue):
        maxValue = temp
    while f // 100 != t // 100:
        f += 100
        temp = 0
        resArr.append([f // 100, temp])

if (t == currentMonth and m == 'monthly_results'):
    sql = "SELECT pointslm FROM people WHERE ID=" + str(target)
    conn = cconn.create_connection(db_file)
    cur = conn.cursor()
    cur.execute(sql)
    row = cur.fetchone()
    resArr[len(resArr) - 1][1] += row[0]
    if (resArr[len(resArr) - 1][1] > maxValue):
        maxValue = resArr[len(resArr) - 1][1]

op = {
    'data': resArr,
    'max': maxValue
}
conn.close()
file.close()

print("Content-type: text/json\n")
print(json.dumps(op))
