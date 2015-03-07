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

    $scope.confirmPostmarkEmail = function() {
        localStorage['postmark_email'] = $rootScope.settings.postmark_email;
        POSTMARK_EMAIL = localStorage['postmark_email'];
    };

    $scope.confirmPostmarkToken = function() {
        localStorage['postmark_token'] = $rootScope.settings.postmark_token;
        POSTMARK_TOKEN = localStorage['postmark_token'];
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
    $cordovaProgress,
    Dropbox,
    Postmark) {
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
        if (window.cordova) $cordovaProgress.showSimpleWithLabelDetail(true, "Registering...", "You will receive an email from us shortly.");

        Postmark.sendMail($scope.user.name, $scope.user.email, function() {

        });

        Dropbox.getImages(function() {
            $rootScope.gallery = $rootScope.gallery.chunk(6);
            console.log($rootScope.gallery);
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('/03-gallery');
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

    $scope.share = function() {
        $rootScope.goToPage('/05-thankyou');
    };
})

/* 05-thankyou */
.controller('ThankYouCtrl', function(
    $scope,
    $rootScope,
    $state) {
    console.log('```` Rendering ThankYou');
    $rootScope.backgroundPosX = -160;

    $scope.startOver = function() {
        // Restart
        $state.go('/01-welcome');
    };
});
