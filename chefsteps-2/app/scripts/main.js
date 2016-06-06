/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function(window, document) {
  'use strict';
  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here
  let emailGenerator = function * (numEmails) {
    while (numEmails > 0) {
      yield ('test' + numEmails + '@test.com');
      numEmails--;
    }
  };

  // Take in number of unique emails to generate and return a list of 100,0000
  // using these set of unique emails.
  let getInputList = numEmails => {
    const INPUT_SIZE = 100000;
    if (typeof numEmails !== 'number') {
      // Lets gracefully recover by defaulting it
      // to 50% of INPUT_SIZE
      numEmails = (INPUT_SIZE / 100) * 50;
    }
    let input = [];
    let emails = [];
    for (let email of emailGenerator(numEmails)) {
      emails.push(email);
    }

    let factor = Math.floor(INPUT_SIZE / numEmails);
    while (factor--) {
      input.push(...emails);
    }

    let reminder = INPUT_SIZE % numEmails;
    if (reminder) {
      for (let email of emailGenerator(reminder)) {
        input.push(email);
      }
    }

    return input;
  };

  // Take an list as input and return a shuffled new list back.
  let shuffle = list => {
    if (!Array.isArray(list)) {
      throw new Error('Invalid input to shuffle');
    }

    let i = list.length;
    let j;
    let shuffledList = list.slice();
    let temp;

    for (; i > 0; j = Math.trunc((Math.random() * i)), i--) {
      temp = shuffledList[i];
      shuffledList[i] = shuffledList[j];
      shuffledList[j] = temp;
    }
    return shuffledList;
  };

  // Filter out duplicates and return a new list of unique emails.
  let uniqueEmails = emailList => {
    if (!Array.isArray(emailList)) {
      throw new Error('Invalid input passed. Expects a list to be passed');
    }
    let emails = {};
    return emailList.filter(email => {
      return emails[email] === undefined ? emails[email] = true : false;
    });
  };

  let init = numEmails => {
    let input = getInputList(numEmails);
    input = shuffle(input);

    // Simple instrumentation of filtering emails;
    let timer = {};
    timer.startTime = window.performance.now();
    uniqueEmails(input);
    timer.endTime = window.performance.now();
    return timer;
  };

  // Expose the inner functions
  window.chefSteps = {
    uniqueEmails,
    init,
    shuffle,
    getInputList,
    emailGenerator
  };

  let clickHandler = event => {
    let btn = event.target;
    btn.textContent = 'Clicked...';
    // Unbind handler to prevent multiple clicks.
    btn.removeEventListener('click', clickHandler);
    // Read user input
    let count = parseInt(document.querySelector('#user-input').value, 10);
    let timer = init(count);

    document.querySelector('#start-time').textContent = timer.startTime + ' ms';
    document.querySelector('#end-time').textContent = timer.endTime + ' ms';
    document.querySelector('#elapsed-time').textContent = (timer.endTime - timer.startTime) + ' ms';
    // Bind handler back
    btn.addEventListener('click', clickHandler);
    btn.textContent = 'Click Me!';
  };

  let btn = document.querySelector('#btn-start');
  if (btn) {
    btn.addEventListener('click', clickHandler);
  }
})(window, document);
