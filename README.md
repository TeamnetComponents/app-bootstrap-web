# app-bootstrap-web

Teamnet bootstrap web application

#Key Features

* Multiple themes support using [Compass][compass] + [SASS][sass].
* CSS minify grunt task.
* // TODO - add details for all bootstrap web application features


[sass]: http://sass-lang.com/
[compass]: http://compass-style.org/

### Managing themes
All theme related scss stylesheets can be found in <code>/src/main/scss</code> folder. In order to apply updates for a specific theme, after modifying the scss files you must run <code>grunt compass:dev</code> or <code>grunt compass:prod</code> task. 
Before running compass commands fist you must [install compass][compass_install] on your sistem.

[compass_install]: http://thesassway.com/beginner/getting-started-with-sass-and-compass

###CSS minify

All css files are minified and concatenated in a single <code>all.css</code> file located in <code>/src/main/webapp/styles</code> folder. The list of included css files cand be edited inside <code>Gruntfile.js</code> <code>cssmin</code> grunt task. In order to update the minified version of the <code>all.css</code> file you must run the <code>grunt cssmin</code> task.

##To be continued...