import datetime


def stupid_date_to_normal_date(b, ch, sec):
    a = datetime.date(int(b[0:4]), int(b[4:6]), int(b[6:8]))
    a += datetime.timedelta(days=ch)
    if (sec and (a > datetime.date.today())):
        a = datetime.date.today()
    c = a.strftime("%Y%m%d")
    return c
