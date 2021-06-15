
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
### How it works

#### 1. Initiates clusters
#### 2. When it gets request, it stores request headers and bodies
#### 3. Generates responses for different types of requests, such as:
- Re-direction
- Query strings
- Local file requests
- Cache control
 
#### 4. When client requires cache control, it broadcasts the file information to all clusters (with PM2)
#### 5. Send response to the client

#
### Diagram
![다이어그램](./diagram.png)
