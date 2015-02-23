angular.module('app.controllers', [])

/* 00-settings */
.controller('SettingsCtrl', function(
    $scope,
    $rootScope) {
    console.log('```` Rendering Settings');
})

/* 01-welcome */
.controller('WelcomeCtrl', function(
    $scope,
    $rootScope) {
    console.log('```` Rendering Welcome');
})

/* 02-register */
.controller('RegisterCtrl', function(
    $scope,
    $rootScope,
    $state) {
    console.log('```` Rendering Register');
    $scope.register = function() {
        // form validation
        // https://scotch.io/tutorials/angularjs-form-validation
        // Dropbox append 
        // go to gallery
        $state.go('/03-gallery');
    };
})

/* 03-image-selection */
.controller('GalleryCtrl', function(
    $scope,
    $rootScope,
    Dropbox) {
    // Fetch img url
    Dropbox.getImages(function(result) {
        // console.log(result);
    });
    console.log('```` Rendering Gallery');
})

/* 04-share */
.controller('ShareCtrl', function(
    $scope,
    $rootScope) {
    console.log('```` Rendering Share');
})

/* 05-thankyou */
.controller('ThankYouCtrl', function(
    $scope,
    $rootScope) {
    console.log('```` Rendering ThankYou');
});