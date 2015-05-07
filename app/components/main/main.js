var observableModule = require("data/observable");
function pageLoaded(args) {
    var page = args.object;
    var vm = new observableModule.Observable();
    vm.set("isLoading", true);
    load(vm);
    page.bindingContext = vm;
}
exports.pageLoaded = pageLoaded;
function load(viewModel) {
    viewModel.set("isLoading", true);
    if (HKHealthStore.isHealthDataAvailable()) {
        var weightType = HKObjectType.quantityTypeForIdentifier(HKQuantityTypeIdentifierBodyMass);
        var writeDataTypes = NSSet.setWithObject(weightType);
        var readDataTypes = NSSet.setWithObject(weightType);
        var healthStore = HKHealthStore.new();
        healthStore.requestAuthorizationToShareTypesReadTypesCompletion(readDataTypes, readDataTypes, function (success, error) {
            if (!success) {
                alert("ERROR");
                viewModel.set("isLoading", false);
                return;
            }
            first(healthStore, weightType, function (result, error) {
                if (result) {
                    var weight = result.doubleValueForUnit(HKUnit.poundUnit());
                    viewModel.set("weight", weight);
                }
                else {
                    alert(error);
                }
                viewModel.set("isLoading", false);
            });
        });
    }
}
function first(healthStore, quantityType, callback) {
    var timeSortDescriptor = NSSortDescriptor.alloc().initWithKeyAscending(HKSampleSortIdentifierEndDate, false);
    var sortDescriptors = NSArray.arrayWithObject(timeSortDescriptor);
    var query = HKSampleQuery.alloc().initWithSampleTypePredicateLimitSortDescriptorsResultsHandler(quantityType, null, 1, sortDescriptors, function (query, results, error) {
        if (results) {
            var quantitySample = results.firstObject;
            if (quantitySample) {
                var quantity = quantitySample.quantity;
                callback(quantity, error);
            }
            else {
                callback(null, "No data");
            }
        }
        else {
            callback(null, "No data");
        }
    });
    healthStore.executeQuery(query);
}
//# sourceMappingURL=main.js.map