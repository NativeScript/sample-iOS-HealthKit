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
    hideKeyboard();
    getHealthKitValue(healthStore, weightType, function (weight) {
        alert("Your weight is " + weight.doubleValueForUnit(HKUnit.poundUnit()) + " pounds");
    });
}
exports.getWeightButtonTap = getWeightButtonTap;
function setWeightButtonTap(args) {
    hideKeyboard();
    var textField = page.getViewById("weightTextView");
    var weight = parseFloat(textField.text);
    setHalthKitValue(healthStore, weightType, HKQuantity.quantityWithUnitDoubleValue(HKUnit.poundUnit(), weight));
}
exports.setWeightButtonTap = setWeightButtonTap;
function hideKeyboard() {
    var textField = page.getViewById("weightTextView");
    textField.ios.resignFirstResponder();
}
function requestPermissions(healthStore, writeTypes, readTypes) {
    var writeDataTypes = NSSet.setWithArray(writeTypes);
    var readDataTypes = NSSet.setWithArray(readTypes);
    healthStore.requestAuthorizationToShareTypesReadTypesCompletion(writeDataTypes, readDataTypes, function (success, error) {
        if (!success) {
        }
    });
}
function getHealthKitValue(healthStore, quantityType, callback) {
    var endDateSortDescriptor = NSSortDescriptor.alloc().initWithKeyAscending(HKSampleSortIdentifierEndDate, false);
    var query = HKSampleQuery.alloc().initWithSampleTypePredicateLimitSortDescriptorsResultsHandler(quantityType, null, 1, [endDateSortDescriptor], function (query, results, error) {
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
}
//# sourceMappingURL=main.js.map