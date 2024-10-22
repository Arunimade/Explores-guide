// Define AngularJS module
var app = angular.module('tripApp', []);

// Define the main controller
app.controller('TripController', ['$scope', '$http', function ($scope, $http) {
    // Initialize trip data and active tab
    $scope.trip = {};
    $scope.trips = [];
    $scope.currentTab = 1;
    $scope.editIndex = undefined; // Initialize editIndex

    // Load all trips from the backend on page load
    $scope.loadTrips = function () {
        $http.get('/trips').then(
            function (response) {
                $scope.trips = response.data;
            },
            function (error) {
                console.error('Error fetching trips:', error);
            }
        );
    };

    // Load planned trips from the backend
    $scope.loadPlannedTrips = function () {
        $http.get('/trips/planned').then(
            function (response) {
                $scope.trips = response.data; // Update trips with planned trips
            },
            function (error) {
                console.error('Error fetching planned trips:', error);
            }
        );
    };

    // Call loadTrips when the controller initializes
    $scope.loadTrips();

    // Set active tab
    $scope.setActiveTab = function (tabIndex) {
        $scope.currentTab = tabIndex;
    };

    // Navigate to the previous tab
    $scope.previousTab = function () {
        if ($scope.currentTab > 1) {
            $scope.currentTab--;
        }
    };

    // Submit new trip to the backend
    $scope.submitForm = function () {
        $http.post('/add-trip', $scope.trip).then(
            function () {
                alert('Trip successfully added!');
                $scope.loadTrips(); // Refresh trips list
                $scope.trip = {}; // Reset trip form
                $scope.currentTab = 1; // Reset to the first tab
            },
            function (error) {
                console.error('Error adding trip:', error);
                alert('Failed to add trip.');
            }
        );
    };

    // Edit an existing trip
    $scope.editTrip = function (index) {
        $scope.trip = angular.copy($scope.trips[index]);
        $scope.currentTab = 1; // Switch to the first tab
        $scope.editIndex = $scope.trips[index]._id; // Store the trip's ID for updating
    };

    // Update trip in the backend
    $scope.updateTrip = function () {
        $http.put('/update-trip/' + $scope.editIndex, $scope.trip).then(
            function () {
                alert('Trip successfully updated!');
                $scope.loadTrips(); // Refresh trips list
                $scope.trip = {}; // Reset trip form
                $scope.currentTab = 1; // Reset to the first tab
                $scope.editIndex = undefined; // Clear edit index
            },
            function (error) {
                console.error('Error updating trip:', error);
                alert('Failed to update trip.');
            }
        );
    };

    // Delete trip from the backend
    $scope.deleteTrip = function (index) {
        const tripId = $scope.trips[index]._id;
        if (confirm('Are you sure you want to delete this trip?')) {
            $http.delete('/delete-trip/' + tripId).then(
                function () {
                    alert('Trip successfully deleted!');
                    $scope.loadTrips(); // Refresh trips list
                },
                function (error) {
                    console.error('Error deleting trip:', error);
                    alert('Failed to delete trip.');
                }
            );
        }
    };
}]);
