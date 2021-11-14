# BookmarkSpinner

Click the extension icon or hit CTRL+b to go to your next bookmark.


To build:

### 1. create a directory for the extension, prob in your dev dir
```
cd ~
cd dev
mkdir ext
```

### 2. git clone this dir
`git clone https://github.com/shmooth/bookmarkspinner.git`


### 3. Go to chrome extensions url and 'Load Unpacked'
go to chrome://extensions/
Load Unpacked button
navigate to your 'ext' dir and 'Open'
use the 'refresh' button as necessary to reload your files
click on the 'Inspect views background page (inactive)' as necessary to see log of ext activity



### To create distributable zip of the extension, zip from the 'dev' directory
```
cd ~/dev
zip -r myextension.zip ext/
```







