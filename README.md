
# Simple Web Server  

### Language
- Node.js
### Library
- Net Module
- PM2 (for clustering)
### How to start
1. clone this repository
2. ```cd node_server```
3. ```npm install```
4. ```npm install pm2```
5. ```pm2-dev index.js```

### How to test out
1. Get files from the server (example text file)  
    - type ```host1.localhost/files/localfile.txt ``` on a browsesr
    
2. Caching 
    1. open a new window and a secret window (with inspector opened)
    2. type ```host1.localhost/files/image1.png ``` in a new window  
    3. type ```host1.localhost/files/image2.png ``` in a secret window  
    4. repeat step ii and step iii one more time.
    5. you can see 304 responses on two windows

3. Virtual Hosting  
    - write ``` host2 ``` instead of ``` host1 ``` in all steps above  
  
### How it works

#### 1. Initiates clusters
#### 2. When it gets request, it stores request headers and bodies
#### 3. Generates responses for different types of requests, such as :  
- Re-direction
- Local file requests
- Cache control
- Query strings 
  
#### 4. When client requires cache control, it broadcasts the file information to all clusters (with PM2)
#### 5. Send response to the client

#
### Diagram
![다이어그램](./diagram.png)
