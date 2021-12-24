#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import datetime
import json
import os.path

import getNameById

now = datetime.datetime.now()


def sorting_func(e):
    return e[len(e) - 1]


resObj = {}

for i in range(2017, now.year + 1):
    for k in range(1, 13):
        fpth = "..\\logs\\top" + str(i * 100 + k) + ".json"
        if (os.path.isfile(fpth)):
            ff = open(fpth, "r")
            fres = json.loads(ff.read())
            # Determine top 3 point-getters for each month to give out medals
            fres.sort(reverse=True, key=sorting_func)
            for d in range(3):
                if (not (fres[d][0] in resObj)):
                    resObj[fres[d][0]] = [0, 0, 0, 0]
                resObj[fres[d][0]][d] += 1
                resObj[fres[d][0]][3] += (3 - d)
            ff.close()

resArr = []

for key in resObj:
    resArr.append([key] + resObj[key])

resArr.sort(reverse=True, key=sorting_func)

for el in resArr:
    el.append(getNameById.get_name_by_id(el[0]))
print("Content-type: text/json\n")
print(json.dumps(resArr))
