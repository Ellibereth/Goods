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

## Webpack Notes for Development
'./web/bundlevendors'
'./web/bundledev'

bundlevendors compiles vendor libraries. This does not need to be run after changes are made to static folder.
bundledev compiles modules in static. Must be run after changes are made.




## Contributors
Any questions can be sent to darek@manaweb.com

## License
Edgar USA Inc.

