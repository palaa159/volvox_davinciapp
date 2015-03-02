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
    Dropbox,
    Postmark) {
    console.log('```` Rendering Register');

    $scope.user = {};
    
    Dropbox.getImages(function() {
        $rootScope.gallery = $rootScope.gallery.chunk(6);
        console.log($rootScope.gallery);
    });
    $scope.register = function() {
        // form validation
        // Postmark.sendMail($scope.user.name, $scope.user.email, function() {

        // });
        $ionicViewSwitcher.nextDirection('forward');
        $state.go('/03-gallery');
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
})

/* 04-share */
.controller('ShareCtrl', function(
    $scope,
    $rootScope) {
    console.log('```` Rendering Share');

    //facebook login
    $scope.facebookShare = function() {
        console.log("facebookShare clicked!  Sharing image:" + $rootScope.imgToShare);
    };

    //instagram login
    $scope.instagramShare = function() {
        console.log("instagramShare clicked!  Sharing image:" + $rootScope.imgToShare);
    };
})

/* 05-thankyou */
.controller('ThankYouCtrl', function(
    $scope,
    $rootScope) {
    console.log('```` Rendering ThankYou');
});