var Blog=angular.module('Blog',[]);
console.log(Blog)
Blog.controller('postCtrl',function($scope,$http){
    console.log($scope.cruds)
	$scope.cruds=[
		{
			post_title:"Loading...",
			post_desc:"Loading...",
			add_time:"Loading..."
		}
	];
	$http({
        method : "GET",
        url : "/Blog/Crud/displaydata/get_posts"
    }).then(function(response){
        console.log(response,"respon")
        $scope.cruds = response.data.postData;
    },function(response) {
        console.error("Error getting articles.");
    });
});