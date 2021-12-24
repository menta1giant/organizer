#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

def get_top_current_month(conn):
    cur = conn.cursor()
    cur.execute("SELECT ID,pointslm FROM people WHERE pointslm >0")
    rows = cur.fetchall()
    conn.close()
    return rows

