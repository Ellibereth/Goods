## Description
Code base for Edgar USA - best online store for American made goods.

## Built On 
Server Side - Python 3.6.2 <br/>
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

## Setup
### Virtual Enviroment
When testing locally, use the virutal environment with the following shell command from the root directory. 

```
source venv/bin/activate
```

The virtual environment will include all the necessary python dependencies. If not one can install them from requirements.txt as follows

```
pip install -r requirements.txt
```

#### Node and React
Install Node <br/>
https://nodejs.org/en/download/ <br/>
Run the following in linux  
(Windows power shell or Mac terminal)

```
sh setup
```

This will install reactjs and npm node modules.

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

Compress and obfuscate bundle.js.
```
https://jscompress.com/
https://javascriptobfuscator.com/
```

Then copy the bundle.js file in web/static folder and rename it to the appropriate version in the web/static/bundles folder. Lastly change the following line in main.py to match the new bundle version

```
version = "v0.0.1"
bundle_url = url_for('static', filename='bundles/bundle' + version + '.js')
```

## Environments
This project uses Heroku's pipeline to manage environments. We have the following. Note that the Heroku CLI Name is just the name I use to refer to it in the Heroku terminal. I'd advise you do the same for consistency.

Type | Heroku App Name | Heroku CLI Name
------------ | ------------ | ------------
Development | edgarusa-devgeniy | dev-heroku
Staging | edgarusa-testserver | stage-heroku
Production | edgarusa | prod-heroku

To set up the Heroku as remotes run the following lines of code 

```
git remote add dev-heroku https://git.heroku.com/edgarusa-devgeniy.git
git remote add stage-heroku https://git.heroku.com/edgarusa-testserver.git
git remote add prod-heroku https://git.heroku.com/edgarusa.git
```

Then if you want to push your current branch to any of these (although I recommend pushing mostly to dev first, then merge), use the following command where [ENV] is one of dev,stage,prod.

```
git push [ENV]-heroku
```

## Branching
Here is a guide to local branching. Starting from the master branch do the following

```
git checkout -b [BRANCH_NAME] # creates a new branch 
# make changes to files...
git add -A  # add files
git commit -m  "COMMIT MESSAGE" # commit files
git checkout master # returns to master branch
git merge --no-ff [BRANCH_NAME] # merges your branch with master
git branch -d [BRANCH_NAME] # deletes your old branch
```

If you want to push your branch to heroku then use the following 

```
git push [ENV]-heroku [BRANCH_NAME]:master
```

To create a remote branch you need to do the following. This shouldn't happen often but we can if we need to. Then other's can access your remote branch too. Use this for longer term changes, especially when prod,staging, dev will be very different.

```
git checkout -b [BRANCH_NAME] # creates a new branch 
# make changes to files...
git add -A  # add files
git commit -m  "COMMIT MESSAGE" # commit files
# make this branch remote
git remote add [BRANCH_NAME] https://github.com/darekj28/Goods/
git push --set-upstream origin [BRANCH_NAME]
git checkout master # returns to master branch
git push [ENV]-heroku [ENV]:master # push remote branch to Heroku
```

Here are two links that might help if you're stuck

https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging
https://stackoverflow.com/questions/18264621/how-do-i-push-different-branches-to-different-heroku-apps

Lastly, each environment has slightly different config variables.

- DATABASE_URI (Database URI)
- ENVIRONMENT (DEVELOPMENT, STAGING, PRODUCTION)
- HEROKU_APP_URL (example is https://edgarusa-testserver.herokuapp.com/) 

For production I have HEROKU_APP_URL set to https://edgarusa.herokuapp.com/ but may change it to https://edgarusa.com/ in the future. These can be accessed in python through 

```
os.environ.get(FIELD_NAME)
```

## Copying Databases Over
Take a snapshot in Heroky of the devgeniy database. Then run the following command - a recent example of [SNAPSHOT_ID] have been b006.

```
heroku pg:backups:restore edgarusa-devgeniy::[SNAPSHOT_ID] DATABASE_URL --app edgarusa-testserver
```


## Webpack notes for development
```
# bundlevendors compiles vendor libraries
# This does not need to be run after changes are made to static folder
cd web && sh bundlevendors
# bundledev compiles modules in static. Must be run after changes are made
cd web && sh bundledev
```


### Static Analysis Tools
For Python we use PyLint and React JS we use EsLint 

### PyLint 
Intall by initialize a config file by running 
```
pip install pylint
eslint --init
```

Run the following from the command line to analyze python files
```
pylint [FILENAME] --rcfile=[CONFIG_FILENAME] > [OUTPUT_FILENAME]
```

### EsLint 
Install by 
```
npm install --save eslint 
```


Run the following from the command line in /web to analyze react.js files
```
eslint [DIRECTORY / FILENAME]  > [OUTPUT_FILENAME]
```
one can add --fix to automatically make the changes from the config file. Currently it is named .eslintrc.js and is located in the web folder 

## Tests 
We have a 2 types of tests. Backend unit tests located at ./run_tests.py and Selenium web driver tests at ./tests/web_tests/webtests.py. One can run these with 

```
# Backend unit tests
python3 run_tests.py
# Selenium web driver tests
cd tests/webtests && python3 web_tests.py
```


## Contributors
Any questions can be sent to darek@edgarusa.com

## License
Edgar USA Inc.

