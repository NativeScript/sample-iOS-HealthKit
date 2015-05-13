import observableModule = require("data/observable");

import pageModule = require("ui/page");
import textFieldModule = require("ui/text-field");

var page: pageModule.Page;
var healthStore: HKHealthStore;
var weightType: HKQuantityType;
export function pageLoaded(args: observableModule.EventData) {
    page = <pageModule.Page>args.object;

    weightType = HKObjectType.quantityTypeForIdentifier(HKQuantityTypeIdentifierBodyMass);
    healthStore = HKHealthStore.new();

    requestPermissions(healthStore, [weightType], [weightType]);
}

export function getWeightButtonTap(args: observableModule.EventData) {
    getHealthKitValue(healthStore, weightType,(weight) => {
        alert("Your weight is " + weight.doubleValueForUnit(HKUnit.poundUnit()) + " pounds");
    });
}
export function setWeightButtonTap(args: observableModule.EventData) {
    var textField = <textFieldModule.TextField>page.getViewById("weightTextView");
    setHalthKitValue(healthStore, weightType, HKQuantity.quantityWithUnitDoubleValue(HKUnit.poundUnit(), +textField.text));
}

function requestPermissions(healthStore: HKHealthStore, writeTypes: HKQuantityType[], readTypes: HKQuantityType[]) {
    var writeDataTypes = NSSet.new();
    for (var i = 0; i < writeTypes.length; i++) {
        writeDataTypes = writeDataTypes.setByAddingObject(writeTypes[i]);
    }

    var readDataTypes = NSSet.new();
    for (var i = 0; i < readTypes.length; i++) {
        readDataTypes = readDataTypes.setByAddingObject(readTypes[i]);
    }

    healthStore.requestAuthorizationToShareTypesReadTypesCompletion(writeDataTypes, readDataTypes,(success, error) => {
        if (!success) {
        }
    });
}

function getHealthKitValue(healthStore: HKHealthStore, quantityType: HKQuantityType, callback: (result) => void) {
    var endDateSortDescriptor = NSSortDescriptor.alloc().initWithKeyAscending(HKSampleSortIdentifierEndDate, false);
    var sortDescriptors = NSArray.arrayWithObject(endDateSortDescriptor);
    var query = HKSampleQuery.alloc().initWithSampleTypePredicateLimitSortDescriptorsResultsHandler(quantityType, null, 1, sortDescriptors,(query, results, error) => {
        if (results) {
            var quantitySample = <HKQuantitySample>results.firstObject;
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

function setHalthKitValue(healthStore: HKHealthStore, quantityType: HKQuantityType, quantity: HKQuantity) {
    return new Promise<boolean>((resolve, reject) => {
        var now = NSDate.new();
        var sample = HKQuantitySample.quantitySampleWithTypeQuantityStartDateEndDate(quantityType, quantity, now, now);
        healthStore.saveObjectWithCompletion(sample,(success, error) => {
            if (success) {
                alert("Done!");
            }
            else {
                alert("Error!");
            }
        });
    });
}