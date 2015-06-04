/**
 * Created by Donald on 5/22/2015.
 */

angular.module("myApp.view2", ['ngRoute'])

  .config(["$routeProvider", function($routeProvider) {

    $routeProvider.when(
      "/view2", {
        templateUrl: "views/view2/view2.html",
        controller: "View2Ctrl"
      });
  }])

  .controller("View2Ctrl", [function() {

    console.log("Initializing View2Ctrl");
  }]);