import os.path
import json

for i in range(205):
    p = '../logs/monthly_results/res_' + str(i) + '.json'
    if (os.path.isfile(p)):
        file = open(p,'r')
        d = json.loads(file.read())
        d['data'] = d['pts'].copy()
        d.pop('pts', None)
        file.close()
        file = open(p,'w')
        file.write(json.dumps(d))
        file.close()
