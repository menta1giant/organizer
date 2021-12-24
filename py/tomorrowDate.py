#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import createConnection as cconn
import formatDate
import getLatestDateInDatabase as gldid

db_file = '..\\diary.db'


def get_date():
    conn = cconn.create_connection(db_file)

    d = gldid.get_latest_date_in_database(conn)

    d = formatDate.stupid_date_to_normal_date(str(d), 1, True)
    conn.close()
    return d
