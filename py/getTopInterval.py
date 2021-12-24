#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe
import cgi
import json

import createConnection as cconn
import formatDate
import getLatestDateInDatabase as gldid
import getTopCurrentMonth as gtcm


def append_points_to_dict(pts):
    for i in range(len(pts)):
        attr = str(pts[i][0])
        if not (attr in resDict):
            resDict[attr] = [0, '']
        resDict[attr][0] += pts[i][1]


def format_ids(names):
    listOfIds = list(names.keys())
    outputString = '('
    for i in range(len(listOfIds) - 1):
        outputString += listOfIds[i] + ','
    outputString += listOfIds[len(listOfIds) - 1] + ')'
    return outputString


def get_names_by_id(names):
    sql = 'SELECT ID, name FROM people WHERE ID IN ' + names


data = cgi.FieldStorage()
d1 = int(data.getfirst("d1", 2017))
d2 = int(data.getfirst("d2", 2017))

if ((d1 < 10000) or (d2 < 10000)):
    d1 = d1 * 100 + 1
    d2 = d2 * 100 + 12

db_file = '..\\diary.db'
conn = cconn.create_connection(db_file)

d = gldid.get_latest_date_in_database(conn)
dnow = int(formatDate.stupid_date_to_normal_date(str(d), 1, True)) // 100

resDict = {}
repeat = True
cMnth = max(d1, 201702)
while cMnth <= d2:
    if (cMnth % 100) == 13:
        cMnth += 88
    cMnth_points = ''
    if cMnth != dnow:
        f = open('../logs/top' + str(cMnth) + '.json', 'r')
        cMnth_points = json.loads(f.read())
        append_points_to_dict(cMnth_points)
        f.close()
    else:
        conn = cconn.create_connection(db_file)
        cMnth_points = gtcm.get_top_current_month(conn)
        append_points_to_dict(cMnth_points)
        break
    cMnth += 1

conn = cconn.create_connection(db_file)
cur = conn.cursor()
sql = 'SELECT ID,name FROM people WHERE ID IN ' + format_ids(resDict)
cur.execute(sql)
rows = cur.fetchall()

for row in rows:
    resDict[str(row[0])][1] = row[1]

conn.close()

resDict = json.dumps(resDict)
print("Content-type: text/json\n")
print(resDict)
