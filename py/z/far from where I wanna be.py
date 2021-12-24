import os.path
import json

for i in range(200):
    fpth = "C:\\Server\\data\\htdocs\\logs\\monthly_results\\res_" + str(i) + ".json"
    if (os.path.isfile(fpth)):
        fl = open(fpth,"r")
        rr = json.loads(fl.read())
        fl.close()
        if (len(rr['data'])):
            rr['data'][len(rr['data'])-1][0] = int(rr['data'][len(rr['data'])-1][0])
            fl = open(fpth,"w")
            fl.write(json.dumps(rr))
            fl.close()
        
