#!C:\Users\Mental Giant\AppData\Local\Programs\Python\Python38\python.exe

import cgi
import cgitb
import os

cgitb.enable()

try:
    import msvcrt

    msvcrt.setmode(0, os.O_BINARY)  # stdin  = 0
    msvcrt.setmode(1, os.O_BINARY)  # stdout = 1
except ImportError:
    pass

form = cgi.FieldStorage()


def fbuffer(f, chunk_size=10000):
    while True:
        chunk = f.read(chunk_size)
        if not chunk:
            break
        yield chunk


fileitem = form['userfile']

if fileitem.filename:

    fn = os.path.basename(fileitem.filename)
    f = open('../photos/' + fn, 'wb', 10000)

    for chunk in fbuffer(fileitem.file):
        f.write(chunk)
    f.close()
    fileitem.file.seek(0, 2)
    message = fileitem.file.tell()
    fileitem.file.seek(0)

else:
    message = 'No file was uploaded'

print("Content-Type: text/plain\n")
print(message)
