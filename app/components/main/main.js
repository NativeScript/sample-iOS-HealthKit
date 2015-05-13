var page;
var healthStore;
var weightType;
function pageLoaded(args) {
    page = args.object;
    weightType = HKObjectType.quantityTypeForIdentifier(HKQuantityTypeIdentifierBodyMass);
    healthStore = HKHealthStore.new();
    requestPermissions(healthStore, [weightType], [weightType]);
}
exports.pageLoaded = pageLoaded;
function getWeightButtonTap(args) {
    getHealthKitValue(healthStore, weightType, function (weight) {
        alert("Your weight is " + weight.doubleValueForUnit(HKUnit.poundUnit()) + " pounds");
    });
}
exports.getWeightButtonTap = getWeightButtonTap;
function setWeightButtonTap(args) {
    var textField = page.getViewById("weightTextView");
    setHalthKitValue(healthStore, weightType, HKQuantity.quantityWithUnitDoubleValue(HKUnit.poundUnit(), +textField.text));
}
exports.setWeightButtonTap = setWeightButtonTap;
function requestPermissions(healthStore, writeTypes, readTypes) {
    var writeDataTypes = NSSet.new();
    for (var i = 0; i < writeTypes.length; i++) {
        writeDataTypes = writeDataTypes.setByAddingObject(writeTypes[i]);
    }
    var readDataTypes = NSSet.new();
    for (var i = 0; i < readTypes.length; i++) {
        readDataTypes = readDataTypes.setByAddingObject(readTypes[i]);
    }
    healthStore.requestAuthorizationToShareTypesReadTypesCompletion(writeDataTypes, readDataTypes, function (success, error) {
        if (!success) {
        }
    });
}
function getHealthKitValue(healthStore, quantityType, callback) {
    var endDateSortDescriptor = NSSortDescriptor.alloc().initWithKeyAscending(HKSampleSortIdentifierEndDate, false);
    var sortDescriptors = NSArray.arrayWithObject(endDateSortDescriptor);
    var query = HKSampleQuery.alloc().initWithSampleTypePredicateLimitSortDescriptorsResultsHandler(quantityType, null, 1, sortDescriptors, function (query, results, error) {
        if (results) {
            var quantitySample = results.firstObject;
            if (quantitySample) {
                callback(quantitySample.quantity);
            }
            else {
                alert("Error!");
            }
        }
        else {
            alert("Error!");
        }
    });
    healthStore.executeQuery(query);
}
function setHalthKitValue(healthStore, quantityType, quantity) {
    return new Promise(function (resolve, reject) {
        var now = NSDate.new();
        var sample = HKQuantitySample.quantitySampleWithTypeQuantityStartDateEndDate(quantityType, quantity, now, now);
        healthStore.saveObjectWithCompletion(sample, function (success, error) {
            if (success) {
                alert("Done!");
            }
            else {
                alert("Error!");
            }
        });
    });
}
//# sourceMappingURL=main.js.map