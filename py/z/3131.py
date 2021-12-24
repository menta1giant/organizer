import json

f = open('../logs/monthly_results/res_1.json','r')
ff = json.loads(f.read())
f.close()
for i in range(2,193):
    print(ff)
    ff["pId"] = i
    fn = json.dumps(ff)
    f = open('../logs/monthly_results/res_' + str(i) + '.json','w')
    f.write(fn)
    f.close()
