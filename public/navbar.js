/**
 * Created by Donald on 5/22/2015.
 *
 * @citation This code references the following forum thread
 * http://stackoverflow.com/questions/16199418/how-do-i-implement-the-bootstrap-navbar-active-class-with-angular-js
 */

angular.module("navbar", [])

.controller("NavbarCtrl", ["$scope", "$location", function($scope, $location) {

    $scope.isCollapsed = true;

    $scope.isActive = function(path) {
        return path === $location.path();
    }
}]);