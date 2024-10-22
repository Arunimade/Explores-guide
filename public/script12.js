var app = angular.module('loginApp', []);

app.controller('LoginController', ['$scope', '$window', function($scope, $window) {
    $scope.username = '';
    $scope.password = '';
    $scope.rememberMe = false;

    $scope.login = function() {
        if ($scope.username === 'admin' && $scope.password === 'password') {
            // Successful login
            $window.location.href = 'home.html';
        } else {
            alert('Invalid username or password');
        }
    };
}]);
