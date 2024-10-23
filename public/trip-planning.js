// Define AngularJS module
var app = angular.module('tripApp', []);

// Define the main controller
app.controller('TripController', ['$scope', '$http', function ($scope, $http) {
    // Initialize trip data and active tab
    $scope.trip = {};
    $scope.trips = [];
    $scope.currentTab = 1;
    $scope.editIndex = undefined; 

    // Fetch and display all trips from the backend
    async function fetchTrips(url = '/trips') {
        try {
            const response = await $http.get(url);
            $scope.trips = response.data;
            $scope.$apply();  // Update scope manually for async
        } catch (error) {
            console.error('Error fetching trips:', error);
        }
    }

    // Call fetchTrips on page load to initialize data
    fetchTrips();

    // Switch between tabs
    $scope.setActiveTab = (tabIndex) => $scope.currentTab = tabIndex;

    $scope.previousTab = () => {
        if ($scope.currentTab > 1) $scope.currentTab--;
    };

    // Submit new trip to the backend
    $scope.submitForm = async function () {
        try {
            const response = await $http.post('/add-trip', $scope.trip);
            if (response.status === 200) {
                alert('Trip successfully added!');
                fetchTrips();  // Refresh trip list
                $scope.trip = {};  // Reset form
                $scope.setActiveTab(1);  // Go to the first tab
            }
        } catch (error) {
            console.error('Error adding trip:', error);
            alert('Failed to add trip.');
        }
    };

    // Edit an existing trip
    $scope.editTrip = function (index) {
        $scope.trip = angular.copy($scope.trips[index]);
        $scope.setActiveTab(1);  // Switch to the first tab for editing
        $scope.editIndex = $scope.trips[index]._id;  // Save the trip ID
    };

    // Update trip in the backend
    $scope.updateTrip = async function () {
        try {
            const response = await $http.put(`/update-trip/${$scope.editIndex}`, $scope.trip);
            if (response.status === 200) {
                alert('Trip successfully updated!');
                fetchTrips();  // Refresh trip list
                $scope.trip = {};  // Reset form
                $scope.setActiveTab(1);  // Go back to the first tab
                $scope.editIndex = undefined;  // Clear edit index
            }
        } catch (error) {
            console.error('Error updating trip:', error);
            alert('Failed to update trip.');
        }
    };

    // Delete a trip
    $scope.deleteTrip = async function (index) {
        const tripId = $scope.trips[index]._id;
        if (confirm('Are you sure you want to delete this trip?')) {
            try {
                const response = await $http.delete(`/delete-trip/${tripId}`);
                if (response.status === 200) {
                    alert('Trip successfully deleted!');
                    fetchTrips();  // Refresh trip list
                }
            } catch (error) {
                console.error('Error deleting trip:', error);
                alert('Failed to delete trip.');
            }
        }
    };

    // Load only planned trips
    $scope.loadPlannedTrips = () => fetchTrips('/trips/planned');
}]);
