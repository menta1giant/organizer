def get_latest_date_in_database(conn):
    cur = conn.cursor()
    cur.execute("SELECT Date FROM top ORDER BY Date DESC LIMIT 1")
    row = cur.fetchone()
    conn.close()
    return row[0]
