#!/usr/bin/python

# Import modules for CGI handling
import cgi, cgitb

# Create instance of FieldStorage
form = cgi.FieldStorage()

# Get data from fields
name = form.getvalue('name')
mail = form.getvalue('mail')
msg = form.getvalue('msg')

print "Content-type:text/html\r\n\r\n"
print "<html>"
print "<head>"
print "  <meta http-equiv=\"Content-Type\" content=\"text/html;charset=UTF-8\">"
print "  <title>Hello - Second CGI Program</title>"
print "</head>"
print "<body>"
print "<h2>您好！%s，“%s”将会被发送给 %s。</h2>" % (name, msg, mail)
print "</body>"
print "</html>"
