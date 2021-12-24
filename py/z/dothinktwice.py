import json
import os

for i in range(201702, 202005):
    pth = '../logs/top' + str(i) + '.json'
    if (os.path.exists(pth)):
        f = open(pth, 'r')

        tempDict = json.loads(f.read())
        f.close()
        for k in range(len(tempDict)):

            if (tempDict[k][0] == 1):
                pth = '../logs/monthly_results/res_1.json'
                ff = open(pth, 'r')
                fread = json.loads(ff.read())
                ff.close()
                ff = open(pth, 'w+')
                fread["pts"].append([i, tempDict[k][1]])
                if (fread["firstAppearance"] == 201601):
                    fread["firstAppearance"] = i
                fread["lastAppearance"] = i
                print(fread)
                ff.write(json.dumps(fread))
                ff.close()
