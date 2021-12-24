#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import json

import createConnection as cconn

db_file = '..\\diary.db'

op = []

sql = "SELECT ID FROM daily"
conn = cconn.create_connection(db_file)
cur = conn.cursor()
cur.execute(sql)
rows = cur.fetchall()
for cat in rows:
    tempDict = {
        'id': cat[0],
        'last': 0,
        'lm': 0,
        'ly': 0,
    }
    sql = "SELECT c" + str(cat[0]) + " FROM daily_res WHERE c" + str(
        cat[0]) + " <> '' AND c" + str(cat[0]) + " > 1 order by Date desc limit 1"
    cur = conn.cursor()
    cur.execute(sql)
    row = cur.fetchone()
    if row:
        tempDict['last'] = row[0]
    file = open('../logs/dailies/res_' + str(cat[0]) + '.json', 'r')
    data = json.loads(file.read())
    if len(data['data']):
        length = len(data['data']) - 1
        tempDict['lm'] = data['data'][length][1]
        temp = data['data'][length][1] * data['data'][length][2]
        tempc = data['data'][length][2]
        while length > 0 and data['data'][length -
                                          1][0] // 100 == data['data'][length][0] // 100:
            temp += data['data'][length - 1][1] * data['data'][length - 1][2]
            tempc += data['data'][length - 1][2]
            length -= 1
        tempDict['ly'] = temp / tempc
    file.close()
    op.append(tempDict)
conn.close()

print("Content-type: text/json\n")
print(json.dumps(op))
