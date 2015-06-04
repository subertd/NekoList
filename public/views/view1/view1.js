/**
 * Created by Donald on 5/22/2015.
 */

angular.module("myApp.view1", ['ngRoute'])

.config(["$routeProvider", function($routeProvider) {

    $routeProvider.when(
        "/view1", {
        templateUrl: "views/view1/view1.html",
        controller: "View1Ctrl"
    });
}])

.controller("View1Ctrl", [function() {

    console.log("Initializing View1Ctrl");
}]);