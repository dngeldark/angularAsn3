(function(){
	'use strict';

	angular.module('NarrowItDownApp',[])
		.controller('NarrowItDownController',['MenuSearchService',function(MenuSearchService){


				var ctrl = this;
				ctrl.show = false;
				ctrl.narrow = function(){
					MenuSearchService.getMatchedMenuItems(ctrl.text).then(function(data){
						ctrl.show = false;
						ctrl.found = data;
						if(data.length == 0){
							ctrl.show = true;
						}
						
						
						
					}, function(data){

					});
				}

				ctrl.removeItem = function(itemIndex){
					ctrl.found.splice(itemIndex,1);
				};
				
		}])

		.controller('FoundListDirectiveController',function(){
			this.showMessage = function(){
				if(this.items != 0){
					return false;
				}
				return true;
			}

		})

		.directive('foundItems', function(){
			var ddo = {
				templateUrl: 'foundList.html',
				scope: {
					show: '<',
					items : '<',
					onRemove: '&'
				},
				controller: 'FoundListDirectiveController',
				controllerAs: 'foundList',
				bindToController: true
			};

			return ddo;
		})

		.service('MenuSearchService',['$http',function($http){
			var service = this;

			this.getMatchedMenuItems = function(text){
				
				return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json')
					.then(function(response){
						if(text === undefined || text.trim() === ''){
							return [];
						}
						var arr = response.data.menu_items;
						var res = [];
						for(var i=0;i<arr.length;i++){
							if(arr[i].description.indexOf(text)>-1){
								res.push(arr[i]);
							}
						}
						return res;
					},function(response){
						return response.status;
					}
				);
			};

		}]);

})()