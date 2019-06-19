#!/usr/bin python
# Import modules for CGI handling
import cgi, cgitb
# Create instance of FieldStorage
form = cgi.FieldStorage()
# Get data from fields
name = form.getvalue('name')
mail = form.getvalue('mail')
msg = form.getvalue('msg')