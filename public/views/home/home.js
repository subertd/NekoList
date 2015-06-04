/**
 * Created by Donald on 5/22/2015.
 */

"use strict";

angular.module("myApp.home", ["ngRoute"])

.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/home", {
      templateUrl: "views/home/home.html",
      controller: "HomeCtrl"
    });
}])

.controller("HomeCtrl", [function() {
    console.log("Initializing HomeCtrl");
}]);