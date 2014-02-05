## running the app
1. `npm i`
2. `bower i`
3. dump the sql file to your mysql db (you can find the file under `db/leads.sql`) .
4. change your db permission at
 4.1. `collections/baseCollection.js`
 4.2. `models/baseModels`
 4.3. `lib/mysqlKnex.js`



### Mac Users:
  - Dont do nothing, my socketPath is using the MAMP Mysql. if you using a different mysql  database change the socketPath.

### Windows User:
  - I don't know, I dont have a windows machine.
  - Just check your mysql, you might need to delete the socketPath, also you can check on the node.js mysql package page (NPM).

### Linux User:
  - just figure it out, your'e a linux user.
  


