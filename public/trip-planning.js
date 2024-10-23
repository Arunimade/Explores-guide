// trip-planning.js
var app = angular.module('tripApp', []);

app.controller('TripController', function($scope) {
    // Initialize trips list and form data
    $scope.trips = [];
    $scope.trip = {};
    $scope.currentTab = 1;

    // Function to set the active tab
    $scope.setActiveTab = function(tabNumber) {
        $scope.currentTab = tabNumber;
    };

    // Add or update a trip
    $scope.submitForm = function() {
        if ($scope.trip.index !== undefined) {
            // Update existing trip
            $scope.trips[$scope.trip.index] = angular.copy($scope.trip);
            delete $scope.trip.index; // Remove index after updating
        } else {
            // Add new trip
            $scope.trips.push(angular.copy($scope.trip));
        }
        $scope.resetForm(); // Clear form after submission
    };

    // Edit trip (populate form with existing data)
    $scope.editTrip = function(index) {
        $scope.trip = angular.copy($scope.trips[index]);
        $scope.trip.index = index; // Save index to know which trip to update
        $scope.setActiveTab(1); // Go to the form tab for editing
    };

    // Delete a trip
    $scope.deleteTrip = function(index) {
        $scope.trips.splice(index, 1);
    };

    // Reset the form
    $scope.resetForm = function() {
        $scope.trip = {}; // Clear the trip object
        $scope.currentTab = 1; // Return to the first tab
    };

    // Go to the previous tab
    $scope.previousTab = function() {
        if ($scope.currentTab > 1) {
            $scope.currentTab--;
        }
    };
});
