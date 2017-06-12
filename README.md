## Description
Code base for Edgar USA. 

## Dependencies 
Server Side - Python 3.5.2 <br/>
Client Side - NPM/Node (for ReactJS), ReactJS <br/> 
Database Management - Flask SQL Alchemy <br/>
Python Package Management - https://pip.pypa.io/en/stable/installing/ <br/>
Python Dependencies - './requirements.txt' <br/>
React Version - 15.5.4 <br/>
Webpack Version - 2.4.1 https://webpack.github.io/ <br/>


## HTTP Caching
Images are stored on S3. Uses 2 week expire caching. <br/>
Plugins like Bootstrap are cached with 2 day expirations.


## Security 
Stores and handles payments with Stripe. https://stripe.com/ <br/>
Stores addresses with Lob. https://lob.com/ <br/>
All user requests are authenticated with JWT https://jwt.io/ <br/>
Uses SSL for HTTPS connection <br/>

## Installation
Install Node <br/>
https://nodejs.org/en/download/ <br/>
Run the following in linux  
(Windows power shell or Mac terminal)

```
sh setup
```

This will install reactjs, install react dependencies, and python dependencies




## Testing Locally
Run the following commands in linux 

```
## Windows (power shell)
sh localtestwin
## Mac (terminal)
sh localtest
```

## Bundling for production
Run the following in linux
``` 
cd web
sh bundleprod
cd ..
```
This will compile and bundle all cached vendor libraries.
Once this is done, then comment out the line in index.html. 

```
<script src= {{url_for('static', filename='dist/dll/dll.vendor.js') }}></script>
```

Then compress and obfuscate bundle.js.
```
https://jscompress.com/
https://javascriptobfuscator.com/
```




## Webpack notes for development
```
# bundlevendors compiles vendor libraries
# This does not need to be run after changes are made to static folder
cd web && sh bundlevendors
# bundledev compiles modules in static. Must be run after changes are made
cd web && sh bundledev
```







## Contributors
Any questions can be sent to darek@manaweb.com

## License
Edgar USA Inc.

