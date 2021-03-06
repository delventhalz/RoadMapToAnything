angular.module('creation.ctrl', ['services.server'])

.controller('CreationController', ['$scope', '$state', 'Server',  function($scope, $state, Server){

  var roadmapId = '';

  $scope.nodeType = "Blog Post";

  var clearAllInputs = function (){
    $scope.roadmapTitle = '';
    $scope.roadmapDescription = '';
    $scope.nodeTitle = '';
    $scope.nodeDescription = '';
    $scope.nodeType = 'Blog Post';
    $scope.nodeUrl = '';
    $scope.nodeImageUrl = '';
  };

  var clearNodeInputs = function (){
    $scope.nodeTitle = '';
    $scope.nodeDescription = '';
    $scope.nodeType = 'Blog Post';
    $scope.nodeUrl = '';
    $scope.nodeImageUrl = '';
  };

  var createRoadmap = function() {
    return Server.createRoadmap({
      title: $scope.roadmapTitle,
      description: $scope.roadmapDescription
    })
    .then(function (roadmap) {
      roadmapId = roadmap._id;
    });
  };

  var createNode = function() {
    if( $scope.nodeImageUrl === '' ){
      $scope.nodeImageUrl = 'https://openclipart.org/image/2400px/svg_to_png/103885/SimpleStar.png';
    }
    return Server.createNode({
      title: $scope.nodeTitle,
      description: $scope.nodeDescription,
      resourceType: $scope.nodeType,
      resourceURL: $scope.nodeUrl,
      imageUrl: $scope.nodeImageUrl,
      parentRoadmap: roadmapId
    });
  };

  // Creates the roadmap before the node if necessary
  var checkThenCreate = function() {
    if (!roadmapId) {
      return createRoadmap()
      .then(function() {
        createNode();
      });

    } else {
      return createNode();
    }
  };

  $scope.submitAndRefresh = function() {
    checkThenCreate()
    .then(function() {
      clearNodeInputs();
      Materialize.updateTextFields();
    });
  };

  $scope.submitAndExit = function() {
    checkThenCreate()
    .then(function() {
      $('#creation-modal').closeModal();
      $('.button-collapse').sideNav('hide');
      $('.lean-overlay').remove();
      $state.go('home.roadmapTemplate', { 'roadmapID': roadmapId });
      clearAllInputs();
      roadmapId = '';
    }, 
    function(err){
      console.log('error with node creation request', err);
    });
  };

}]);
