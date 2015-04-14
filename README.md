# pre-request

- bundler
- node.js
- bower
- mysql

## install necessary things

You have to have ruby 2+ on your system. Check it with

    ruby --version

To install bundler:

    gem install bundler

To install node.js

    brew install node

To install bower

    npm install -g bower

To setup mysql

    brew install mysql
    unset TMPDIR
    mysql_install_db --verbose --user=`whoami` --basedir="$(brew --prefix mysql)" --datadir=/usr/local/var/mysql --tmpdir=/tmp
    mysql.server start
    mysql_secure_installation

Here are some references [ref1](http://blog.joefallon.net/2013/10/install-mysql-on-mac-osx-using-homebrew/), [ref2](https://coderwall.com/p/os6woq/uninstall-all-those-broken-versions-of-mysql-and-re-install-it-with-brew-on-mac-mavericks)

## checkout the file from tfs

Use whatever you are comfortable to checkout the project from tfs.
Here is an example with `git tf`
Follow the instructions from [here](https://gittf.codeplex.com/) to setup `git tf`.
You can install it through `homebrew`.

    brew install git-tf

Checkout the code

    git tf clone http://auk-tfs.mcom.local:8080/tfs/DefaultCollection $/Mobiliti/Framework/Automation/Trunk/Tools/te_website

## setup the website

`cd` to the project folder, and do the following.

    bundle install
    rake bower:install

To setup database.

    rake db:setup

If you got some error about mysql database, check the file `config/database.yml`. Look into the `development` section and match it with your mysql settings.

To run the website.

    rails server

or `rails s` for short.

Now you are able to access it through `http://localhost:3000`.

# deployment for production

Get latest.

    git tf pull

Generate secret key. Under the root folder of the project.

    echo SECRET_KEY_BASE=`rake secret` > .env.production

Deployment for production.

    RAILS_ENV=production rake fiserv:deploy

# diagnostic

Check the log files when you think something went wrong.
The log files are located in `log` folder directly in the root folder.
They are separated by environment (i.e. development, production, test).
The file `cron_error_log.log` and `cron_log.log` are for background tasks like syncing.

**Notice** that when you run the website on in development, the logs are output directly to `STDOUT`.


# tweaking

## update background syncing schedule

Modify the schedule file `config/schedule.rb`.

Then update the schedule:

    whenever --update-crontab

To list all jobs.

    crontab -l

## manually sync data

To manually sync data to database

    RAILS_ENV=production rake report:msync

This rake task will turn off the background syncing task first, then do the syncing, and turn the background task back on when finished.
