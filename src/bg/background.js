// TODO:
// - test what happens when we hit the top/end of the URL list
// - write function to return very first URL if possible
//   this might just re-use existing functionality, maybe?
// - respond to keyboard input, which is not happening right now, gd
// - actually go to the next gd URL in the browser, how?
// - fix new broken functionality, gd. not advancing from 0 again.



// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
function getMyTree() {
    chrome.bookmarks.getTree(getCount);
}

function showMyTree() {
    chrome.bookmarks.getTree(getCount);
}

function getNextUrl() {
    //var lastBookmarkIndex = localStorage.getItem('lastBookmarkIndex');
    //chrome.bookmarks.getTree(getCount);
    //console.log('lastBookmarkIndex: ' + lastBookmarkIndex);
    console.log('');
    chrome.bookmarks.getTree(getUrl);
}


function getCount(nodeArray) {
    var num_count = countNode(nodeArray);
    //console.log(num_count);
}

function getUrl(nodeArray) {

    let lastBookmarkIndex = localStorage.getItem('lastBookmarkIndex');
    //console.log('first check: ' + lastBookmarkIndex);
    if ( isNaN(lastBookmarkIndex) ||
         (lastBookmarkIndex==null) ){
        console.log('lastBookmarkIndex is NaN, so we setting 0.');
        lastBookmarkIndex = 0;
        localStorage.setItem('lastBookmarkIndex','0');
    }

    console.log('lastBookmarkIndex: ' + lastBookmarkIndex);
    //var url = urlNode(nodeArray,lastBookmarkIndex);
    nextUrl = '';
    var numBookmarks = urlNode(nodeArray,lastBookmarkIndex);
    
    // reset these?
    urlIndex = 0;

    // 8828 bookmars currently
    //var numBookmarks = urlNode(nodeArray,8774);
    
    console.log('numBookmarks: ' + numBookmarks);
    if(nextUrl == null) { nextUrl = ''; } // prob a folder
    console.log('url is: ' + nextUrl);
    
    // if nextUrl is empty, that means we looped around, 
    // so do it again, but starting from 0, or at least
    // just set the conditions so that we can go there
    // on the next spin
    
    if ( lastBookmarkIndex >= numBookmarks ){
    //if ( (nextUrl==null) || (nextUrl == '') ){
        // setting back to beginning to see if this fixes things
        let msg = 'You have successfully navigated all your URLs.\n\n';
        msg += 'Back to the beginning you go on the next spin.';
        alert(msg);
        
        localStorage.setItem('lastBookmarkIndex','0');
        
        //console.log('TODO: Blank \'nextUrl\'; doing nothing for now...');
        //chrome.tabs.update({url: 'https://cnn.com/'});
    }
    else if( (nextUrl.startsWith('javascript:')) ||
            (nextUrl.startsWith('data:')) ) {
          let msg = 'The next bookmark is a \'javascript:\' bookmarklet, ';
          msg += 'or a \'data:\' url, which we cannot send/invoke for you, sorry:\n\n';
          msg += nextUrl;
          //alert(msg);
          console.log(msg);
      }
    else if ( nextUrl == '' ){
        let msg = 'It was a folder. Lame.';
        //alert(msg);
        console.log(msg);
    }
      else {
          //console.log('Trying to send url...');
          chrome.tabs.update({url: nextUrl});
      }
    
}



/**
 * Respond to extension icon clicked, and CTRL+B.
 */
chrome.browserAction.onClicked.addListener(
  function(tab) { 
      //alert('icon clicked');
      let urlIndex = 0;
      let nextUrl = '';
      getNextUrl();
      //console.log('doin it...');
  }
);



/*
function getNextUrl(nodeArray) {
    var num_count = nextUrl(nodeArray);
    //console.log(num_count);
}
*/

let exteriorCounter =0;
function countNode(nodeArray) {
    var maxShow = 10;
    let maxCounter = 0;
    var count = 0;
    if (nodeArray instanceof Array) {
        var i = 0;
        for (i = 0; i < nodeArray.length; i++) {
            count += countNode(nodeArray[i]);
        }
    } else {
        node = nodeArray;
        //console.log(node);
        if (node.children && node.children.length > 0) {
            count = countNode(node.children);
        } else {
            if( exteriorCounter < maxShow ){
                //console.log('id: ' + node.id);
                console.log(exteriorCounter + ': ' + node.id);
                //console.log('count: ' + count);
                //console.log('maxCounter: ' + maxCounter);         
            }
            count = count + 1;
            exteriorCounter++;
            maxCounter = maxCounter+1;
            //console.log('maxCounter: ' + maxCounter);
        }
    }
    return (count);
}


/* 
    This nodeArray is the topmost parent tree Bookmarks node. 

    Here we want to return the node one past where we were last time.
    
*/

function urlNode(nodeArray,lastBookmarkIndex) {
    var maxShow = 10;
    let maxCounter = 0;
    var count = 0;
    if (nodeArray instanceof Array) {
        var i = 0;
        for (i = 0; i < nodeArray.length; i++) {
            count += urlNode(nodeArray[i],lastBookmarkIndex);
        }
    } else {
        node = nodeArray;
        if (node.children && node.children.length > 0) {
            count = urlNode(node.children,lastBookmarkIndex);
        } else {
            //console.log('urlIndex is: ' + urlIndex);
            // is it time to capture the URL?
            //var comparator = lastBookmarkIndex + 1;
            //console.log('lastBookmarkIndex - urlIndex: ' + (lastBookmarkIndex-urlIndex));
            
            //console.log('lastBookmarkIndex: ' + lastBookmarkIndex);
            //console.log('urlIndex: ' + urlIndex);
            //console.log(lastBookmarkIndex + ' / ' + urlIndex);
            
            // if it's the next one, 
            //   AND it's not a folder, 
            //   AND and it's not null/empty
            //   AND it's not a 'javascript:' URL
            /*
            if( (urlIndex == lastBookmarkIndex) &&
                ('url' in node) &&
                ('url' != '')   &&
                (!node.url.startsWith('javascript:'))
                  ){
            */
            //if( (lastBookmarkIndex == urlIndex) && ('url' in node) ){
            if( (urlIndex == lastBookmarkIndex) ){
                    nextUrl = node.url;
                    var lni = parseInt(lastBookmarkIndex);
                    //console.log('-----> we DID grab the next url');
                    localStorage.setItem('lastBookmarkIndex',lni+1);
                    //console.log('we are updating the lastBookmarkIndex...');
                    //console.log(node);
            }
            /*
            else if( (lastBookmarkIndex <= urlIndex) && ('url' in node) ){
                    nextUrl = node.url;
                    var lni = parseInt(lastBookmarkIndex);
                    //console.log('-----> we DID grab the next url');
                    localStorage.setItem('lastBookmarkIndex',lni+1);
            }
            */
            else{
                //console.log('we in the else() clause...');
                // ok it's not but log something anyways
                //console.log('----->      urlIndex is: ' + urlIndex)
                //console.log('-----> LastBookmarkIndex is: ' + lastBookmarkIndex);
                //console.log('-----> we did not grab the next url');
            }
            count = count + 1;
            urlIndex = urlIndex + 1;
        }
    }
    return (count);
}




function setValue(key,value){
    chrome.storage.sync.set({key: value}, function() {
        console.log('Key/Value is set to ' + key + '/' + value);
    });
}

function getValue(key){
    let returnVal = '';
    chrome.storage.sync.get([key], function(result) {
        console.log('Value currently is ' + result.key);
        this.returnVal = result.key;
    });
    return returnVal;
}



chrome.runtime.onInstalled.addListener(() => {
  //getMyTree();
  //let nextUrl = getNextUrl();
  //localStorage.setItem('lastBookmarkIndex', '0');
  //var a = JSON.stringify(localStorage.getItem('peter'));
  //var bookmarkId = localStorage.getItem('bookmarkId');
  //var lastBookmarkIndex = localStorage.getItem('lastBookmarkIndex');
  //console.log('lastBookmarkIndex: ' + lastBookmarkIndex);
});


let urlIndex = 0;
let lastBookmarkIndex = 0;
chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        //case 'duplicate-tab':
        case 'next-url':
            //duplicateTab();
            urlIndex = 0;
            lastBookmarkIndex = 0;
            //console.log('we going to the next url');
            getNextUrl();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});



/**
 * Gets the current active tab URL and opens a new tab with the same URL.
*/
function duplicateTab() {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.create({ url: tabs[0].url, active: false });
    });
}



//example of using a message handler from the inject scripts
/*
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });
*/

//let color = '#3aa757';

