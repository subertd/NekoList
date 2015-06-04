/**
 * Created by Donald on 5/22/2015.
 */

"use strict";

angular.module("myApp", [
  "ngRoute",
  "navbar",
  "myApp.home",
  "myApp.view1",
  "myApp.view2"
])

.config(["$routeProvider", function($routeProvider) {
    $routeProvider.otherwise({redirectTo: "/home"});
}]);