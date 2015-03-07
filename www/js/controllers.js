angular.module('app.controllers', [])

/* 00-settings */
.controller('SettingsCtrl', function(
    $scope,
    $rootScope) {
    console.log('```` Rendering Settings');
    $scope.dropbox_token = DROPBOX_TOKEN;
    $scope.postmark_token = POSTMARK_TOKEN;
    $scope.postmark_email = POSTMARK_EMAIL;
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
    $rootScope.backgroundPosX = -20;
    $scope.user = {};

    $scope.cancel = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go('/01-welcome');
    };

    $scope.register = function() {
        // form validation

        // Spinner
        if (window.cordova) $cordovaProgress.showSimpleWithLabelDetail(true, "Registering...", "You will receive an email from us shortly.");

        // Postmark.sendMail($scope.user.name, $scope.user.email, function() {

        // });
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
    $rootScope.backgroundPosX = -40;

    $scope.shareFacebook = function() {
        console.log('Selected');
    };

})

/* 04-share */
.controller('ShareCtrl', function(
    $scope,
    $rootScope) {
    console.log('```` Rendering Share');

    $scope.share = function() {
        $rootScope.goToPage('/05-thankyou');
    };
})

/* 05-thankyou */
.controller('ThankYouCtrl', function(
    $scope,
    $rootScope) {
    console.log('```` Rendering ThankYou');
});
