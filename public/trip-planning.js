// Define AngularJS module
var app = angular.module('tripApp', []);

// Define the main controller
app.controller('TripController', ['$scope', '$http', function ($scope, $http) {
    // Initialize trip data and active tab
    $scope.trip = {};
    $scope.trips = [];
    $scope.currentTab = 1;
    $scope.editIndex = undefined; // Track the edit index

    // Load all trips from the backend
    $scope.loadTrips = function () {
        $http.get('/trips').then(
            function (response) {
                $scope.trips = response.data; // Assign the response to trips array
            },
            function (error) {
                console.error('Error fetching trips:', error);
            }
        );
    };

    // Call loadTrips when the controller initializes
    $scope.loadTrips();

    // Set the active tab
    $scope.setActiveTab = function (tabIndex) {
        $scope.currentTab = tabIndex;
    };

    // Go to the previous tab
    $scope.previousTab = function () {
        if ($scope.currentTab > 1) $scope.currentTab--;
    };

    // Submit a new trip to the backend
    $scope.submitForm = function () {
        $http.post('/add-trip', $scope.trip).then(
            function () {
                alert('Trip successfully added!');
                $scope.loadTrips(); // Refresh the trip list
                $scope.trip = {}; // Clear form
                $scope.currentTab = 1; // Switch to the first tab
            },
            function (error) {
                console.error('Error adding trip:', error);
                alert('Failed to add trip.');
            }
        );
    };

    // Edit an existing trip
    $scope.editTrip = function (index) {
        $scope.trip = angular.copy($scope.trips[index]); // Copy the selected trip
        $scope.currentTab = 1; // Switch to the first tab for editing
        $scope.editIndex = $scope.trips[index]._id; // Track the trip's ID
    };

    // Update the trip in the backend
    $scope.updateTrip = function () {
        $http.put(`/update-trip/${$scope.editIndex}`, $scope.trip).then(
            function () {
                alert('Trip successfully updated!');
                $scope.loadTrips(); // Refresh the trip list
                $scope.trip = {}; // Clear form
                $scope.currentTab = 1; // Switch to the first tab
                $scope.editIndex = undefined; // Clear the edit index
            },
            function (error) {
                console.error('Error updating trip:', error);
                alert('Failed to update trip.');
            }
        );
    };

    // Delete a trip from the backend
    $scope.deleteTrip = function (index) {
        const tripId = $scope.trips[index]._id; // Get the trip's ID
        if (confirm('Are you sure you want to delete this trip?')) {
            $http.delete(`/delete-trip/${tripId}`).then(
                function () {
                    alert('Trip successfully deleted!');
                    $scope.loadTrips(); // Refresh the trip list
                },
                function (error) {
                    console.error('Error deleting trip:', error);
                    alert('Failed to delete trip.');
                }
            );
        }
    };

    // View trip details in a new tab
    $scope.viewTripDetails = function (tripId) {
        const detailsUrl = `http://localhost:5000/trip/${tripId}`; // Generate URL with trip ID
        window.open(detailsUrl, '_blank'); // Open the URL in a new tab
    };
}]);
