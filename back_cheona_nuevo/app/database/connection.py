import mysql.connector


# Connect to the database
mydb = mysql.connector.connect(
    host="localhost",
    port = "3306",
    user="root",
    password="Mathias23**",
    database="finca_cheona"
)

# Create a cursor object
cursor = mydb.cursor()