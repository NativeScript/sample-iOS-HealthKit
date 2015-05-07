import observableModule = require("data/observable");

import pageModule = require("ui/page");

export function pageLoaded(args: observableModule.EventData) {
    var page = <pageModule.Page>args.object;
    var vm = new observableModule.Observable();
    vm.set("isLoading", true);
    load(vm);
    page.bindingContext = vm;
}

function load(viewModel: observableModule.Observable) {
    viewModel.set("isLoading", true);
    if (HKHealthStore.isHealthDataAvailable()) {
        var weightType = HKObjectType.quantityTypeForIdentifier(HKQuantityTypeIdentifierBodyMass);
        var writeDataTypes = NSSet.setWithObject(weightType);
        var readDataTypes = NSSet.setWithObject(weightType);

        var healthStore = HKHealthStore.new();
        healthStore.requestAuthorizationToShareTypesReadTypesCompletion(readDataTypes, readDataTypes,(success, error) => {
            if (!success) {
                alert("ERROR");
                viewModel.set("isLoading", false);

                return;
            }

            first(healthStore, weightType,(result, error) => {
                if (result) {
                    var weight = result.doubleValueForUnit(HKUnit.poundUnit());
                    viewModel.set("weight", weight);
                }

                viewModel.set("isLoading", false);
            }); 
        });
    }
}

function first(healthStore: HKHealthStore, quantityType: HKQuantityType, callback: (result: HKQuantity, error) => void) {
    var timeSortDescriptor = NSSortDescriptor.alloc().initWithKeyAscending(HKSampleSortIdentifierEndDate, false);
    var sortDescriptors = NSArray.arrayWithObject(timeSortDescriptor);
    var query = HKSampleQuery.alloc().initWithSampleTypePredicateLimitSortDescriptorsResultsHandler(quantityType, null, 1, sortDescriptors,(query, results, error) => {
        if (results) {
            var quantitySample = <HKQuantitySample>results.firstObject;
            if (quantitySample) {
                var quantity = quantitySample.quantity;
                callback(quantity, error);
            }
            else {
                callback(null, "No data");
            }
        }

        callback(null, error);
    });

    healthStore.executeQuery(query);
}