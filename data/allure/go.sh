#!/bin/bash

rm -rf ~/Projects/te/public/raw/manhattan/regression
bundle exec ruby populate.rb
rake report:sync
