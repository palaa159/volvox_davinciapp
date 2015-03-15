angular.module('app.controllers', [])

/* 00-settings */
.controller('SettingsCtrl', function(
    $scope,
    $rootScope,
    $state,
    Dropbox,
    Dialogs) {
    console.log('```` Rendering Settings');

    $scope.confirmEvent = function() {
        localStorage['event_folder'] = $rootScope.settings.event_folder;
        EVENT_FOLDER = localStorage['event_folder'];
        console.log(EVENT_FOLDER);
    };

    $scope.confirmDropboxToken = function() {
        localStorage['dropbox_token'] = $rootScope.settings.dropbox_token;
        DROPBOX_TOKEN = localStorage['dropbox_token'];
    };

    $scope.confirmMandrillEmail = function() {
        localStorage['mandrill_email'] = $rootScope.settings.mandrill_email;
        POSTMARK_EMAIL = localStorage['mandrill_email'];
    };

    $scope.confirmMandrillToken = function() {
        localStorage['mandrill_token'] = $rootScope.settings.mandrill_token;
        POSTMARK_TOKEN = localStorage['mandrill_token'];
    };

    $scope.back = function() {
        Dropbox.getSettings(function(res) {
            console.log(res);

            EVENT_NAME = res.event_name;
            EVENT_FOLDER = res.event_folder;
            EVENT_BG = '/' + DROPBOX_FOLDER + '/' + getEventFolder() + '/src_img/welcome_bg.jpg';

            Dropbox.returnDirectLink(EVENT_BG, function(d) {
                $rootScope.backgroundBg = d;
                console.log($rootScope.backgroundBg); // √
                $state.go('/01-welcome');
                // $state.go('/02-register');
            });
        }, function(err) {
            console.log(err);
            if (err == null) {
                err = {};
                err.error = 'No internet connection.';
            }
            /*
			    Cannot get settings file
			    – EVENT_FOLDER does not exist
			    – or, Internet connection lost
			*/
            Dialogs.alert('settings.json | ' + err.error, 'OK', function() {
                $state.go('/00-settings');
            });
        });
    };

})

/* 01-welcome */
.controller('WelcomeCtrl', function(
    $scope,
    $rootScope) {
    console.log('```` Rendering Welcome');
    $rootScope.backgroundPosX = 0;
})

/* 02-register */
.controller('RegisterCtrl', function(
    $scope,
    $rootScope,
    $state,
    $ionicViewSwitcher,
    Dropbox,
    $ionicLoading,
    Mandrill) {
    console.log('```` Rendering Register');
    $rootScope.backgroundPosX = -40;
    $scope.user = {};

    $scope.cancel = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go('/01-welcome');
    };

    $scope.register = function() {
        // form validation

        // Spinner
        $ionicLoading.show({
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Mandrill.sendMail($scope.user.name, $scope.user.email, function() {
            // Save a user
            // find a file: users_iPadID.json
            Dropbox.appendUser($scope.user.name, $scope.user.email, function() {
                console.log('User saved.');
            });
            // Load images
            Dropbox.getImages(function() {
                $rootScope.gallery = $rootScope.gallery.chunk(6);
                console.log($rootScope.gallery);
                $ionicViewSwitcher.nextDirection('forward');
                $state.go('/03-gallery');
            });
        });
        // https://scotch.io/tutorials/angularjs-form-validation
        // Dropbox append
        // go to gallery
    };
})

/* 03-image-selection */
.controller('GalleryCtrl', function(
    $scope,
    $rootScope,
    Dropbox) {
    // imageLoaded
    console.log('```` Rendering Gallery');
    $rootScope.backgroundPosX = -80;

})

/* 04-share */
.controller('ShareCtrl', function(
    $scope,
    $rootScope,
    $ionicViewSwitcher,
    $state) {
    console.log('```` Rendering Share');
    $rootScope.backgroundPosX = -120;

    $scope.back = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go('/03-gallery');
    };

    $scope.postOnFb = function() {
        $http.get('https://graph.facebook.com/v2.2/me?access_token=' + $rootScope.fb_token.toString())
            .success(function(data, status, headers, config) {
                console.log("get headers: " + JSON.stringify(headers));
                console.log("get user data: " + JSON.stringify(data));

                var user_id = data.id;
                var msgToPost = $rootScope.msgToShare;
                var photoToPost = "http://itchmo.com/wp-content/uploads/2007/06/p48118p.jpg";

                $http({
                    method: "POST",
                    url: 'https://graph.facebook.com/v2.2/' + uid + '/photos?access_token=' + $rootScope.fb_token + '&url=' + photoUrl + '&message=' + photoMessage
                }).
                success(function(data) {
                    // alert("POST SUCCESSFUL"); 
                    console.log("success on POST: " + JSON.stringify(data));
                    $rootScope.goToPage('/05-thankyou');
                }).
                error(function(data) {
                    console.log("error on POST: " + JSON.stringify(data));
                });

            }).
        error(function(data, status, headers, config) {
            console.log("error data: " + JSON.stringify(data));
            console.log("error status: " + status);
        });
    };
})

/* 05-thankyou */
.controller('ThankYouCtrl', function(
    $scope,
    $rootScope,
    $state) {
    console.log('```` Rendering ThankYou');
    $rootScope.backgroundPosX = -160;
});