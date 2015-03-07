angular.module('app.services', [])

/* Dropbox */
.factory('Dropbox', function($http, $rootScope) {
    var service = {};

    service.getAccountInfo = function(cb) {
        $http.get('https://api.dropbox.com/1/account/info', {
            headers: {
                'Authorization': 'Bearer ' + DROPBOX_TOKEN
            }
        }).then(function(result) {
            cb(result.data);
        });
    };

    service.getSettings = function(success, fail) {
        console.log('````` Get settings.json');
        $http.get('https://api-content.dropbox.com/1/files/auto/' + DROPBOX_FOLDER + '/' + getEventFolder() + '/settings.json', {
            headers: {
                'Authorization': 'Bearer ' + DROPBOX_TOKEN
            }
        })
        .success(function(res) {
            success(res);
        })
        .error(function(err) {
            fail(err);
        });
    };

    service.getImages = function(cb) {
        $http.get('https://api.dropbox.com/1/metadata/auto/' + DROPBOX_FOLDER + '/' + getEventFolder() + '/social_gallery', {
            headers: {
                'Authorization': 'Bearer ' + DROPBOX_TOKEN
            }
        }).then(function(result) {
            // return links via Dropbox media api
            $rootScope.gallery = [];
            // TODO: Async
            var i = 0;
            async.each(result.data.contents, function(content, callback) {
                function callback() {
                    // console.log(result.data.contents.length, i);
                    if (i === result.data.contents.length - 1) {
                        // console.log('Done');
                        if (cb) cb();
                    } else {
                        i++;
                    }
                }
                service.returnDirectLink(content.path, function(result) {
                    $rootScope.gallery.push(result);
                    callback();
                });
            }, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    };

    service.appendUser = function(cb) {

    };

    // Helper
    service.returnDirectLink = function(path, cb) {
        // "/davinci_app/test_event/photobooth/6a010535647bf3970b015390876439970b-500wi.jpg"
        var link;
        $http.get('https://api.dropbox.com/1/media/auto' + path, {
            headers: {
                'Authorization': 'Bearer ' + DROPBOX_TOKEN
            }
        }).then(function(result) {
            if (cb) cb(result.data.url);
        });
    };

    return service;
})

/* Postmarkapp */
.factory('Postmark', function($http) {
    var service = {};

    service.sendMail = function(name, email, cb) {
        $http.post('https://api.postmarkapp.com/email', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Postmark-Server-Token': POSTMARK_TOKEN
            },
            data: {
                'From': POSTMARK_EMAIL,
                'To': email,
                'Subject': 'Thank you for registering Davinci',
                'HtmlBody': ''
            }
        }).then(function(response) {
            if (cb) cb(response);
        });
    };

    return service;
})

/* Dialogs */
.factory('Dialogs', function($ionicPopup, $cordovaDialogs) {
    var service = {};

    service.alert = function(message, buttonName, cb) {
        $cordovaDialogs.alert(message, getEventName(), buttonName).then(function() {
            if (cb) cb();
        });
    };
    service.prompt = function(msg, cb) {
        $ionicPopup.prompt({
            title: 'Password Check',
            template: 'Enter your secret password',
            inputType: 'password',
            inputPlaceholder: 'Your password'
        }).then(function(res) {
            cb(res);
        });
    };

    return service;
});