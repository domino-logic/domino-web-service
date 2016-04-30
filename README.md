# domino-web-service

A web server offering HTTP endpoing and Web Socket to interact with Domino Actors

# demo

A demo runs 4 socket instances and as many web servers as the number of CPU
cores permits.

Make sure you to look at the nginx config file.


```
npm install
npm start
```

should result in:

```
Starting Socket on port 6001
Starting Socket on port 6002
Starting Socket on port 6003
Starting Socket on port 6004
Starting HTTP on port 8081
Starting HTTP on port 8081
Starting HTTP on port 8081
Starting HTTP on port 8081
New connection...
Published message to message@domino_action: Hello world
```