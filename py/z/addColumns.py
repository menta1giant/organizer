import sqlite3
from sqlite3 import Error
import cgi
import cgitb
import json

data = cgi.FieldStorage()

db_file = 'D:\\diary\\diary.db'

name = data.getfirst("string", "")


def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return None


conn = create_connection(db_file)


for i in range(4, 17):
    cur = conn.cursor()
    cur.execute("ALTER TABLE daily_res ADD '" + str(i) + "' DOUBLE")
