
# Simple Web Server  

### Environment
- Node.js
### Library
- Net Module
- PM2
### How to start
1. Clone this repository
2. ```cd node_server```
3. ```npm install```
4. ```npm install pm2```
5. ```pm2-dev index.js```

### How to test out
1. Download sample files from the server (text file)  
    1. Go to ```host1.localhost/files/localfile.txt ``` on a browsesr
    2. The server will give you the sample file

2. Redirection  
    1. Open a browser, with the developer tool  
    2. Go to ```host1.localhost/redir ```  
    3. The server will give you 301, 302, and 200 response with a landing page 
    
2. Caching 
    1. Open a 'NEW WINDOW' and a 'SECRET WINDOW' on browser(with the developer tool)
    2. Go to ```host1.localhost/files/image1.png ``` on a new window
    3. Go to ```host1.localhost/files/image2.png ``` on a secret window  
    4. Repeat step "ii" and "iii" once again for caching
    5. You'll see 304 responses on both 'NEW WINDOW' and 'SECRET WINDOW' .

3. Virtual Hosting  
    - Type ``` host2 ``` instead of ``` host1 ``` in all the steps above  
  
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
