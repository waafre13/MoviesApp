
(function () {
    var myMoviesApp = angular.module("MyMoviesApp", ["ngRoute"]);

    myMoviesApp.config(function ($routeProvider) {

        $routeProvider
            .when("/", {
                templateUrl: "Pages/mainPage.html",
                controller: "MainController"
            })
            .when("/viewAllMovies", {
                templateUrl: "Pages/viewAllMovies.html",
                controller: "MainController"
            })
            .when("/manageMovies", {
                templateUrl: "Pages/manageMovies.html",
                controller: "MainController"
            })
            .when("/createNewMovie", {
                templateUrl: "Pages/createNewMovie.html",
                controller: "MainController"
            })
        ;

    });


    myMoviesApp.controller("MainController", ["$scope", "MoviesFactory", function ($scope, MoviesFactory) {

        $scope.test = MoviesFactory.getAllMovies();

        //API Urls

        //

    }]);

    myMoviesApp.controller("MoviesController", ["$scope", function ($scope) {

        $scope.test = "Fredric";
        con


    }]);

    myMoviesApp.controller("ReviewsController", ["$scope", function ($scope) {

        $scope.test = "Fredric";



    }]);

    myMoviesApp.factory("MoviesFactory", ["$http",
        function ($http) {

            //TODO: FACTORY: getMovies, getMovie(id)r object, updateMovie()



            return {

                getAllMovies: function () {
                    $http.get("api/Movie/GetAllMovies")
                        .success(function (data) {
                            console.debug(data);
                            return data;
                        })
                        .error(function (e) {
                            console.error(e);
                            $scope.error = e;
                            return false;
                        });
                }

            };


        }
    ]);

}());