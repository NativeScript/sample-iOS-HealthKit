# Using the HealthKit SDK with NativeScript
This sample shows a simple use of the [iOS HealthKit APIs](https://developer.apple.com/healthkit/).

It is a very simple scenario but should help you out to get started if you want to work with this SDK.
The most important part of the sample is located in [main.js](https://github.com/NativeScript/sample-HealthKit/tree/master/app/components/main) file. Here is a snippet of code used to initialize the HealthKit SDK
```javascript
if (HKHealthStore.isHealthDataAvailable()) {
        var weightType = HKObjectType.quantityTypeForIdentifier(HKQuantityTypeIdentifierBodyMass);
        var writeDataTypes = NSSet.setWithObject(weightType);
        var readDataTypes = NSSet.setWithObject(weightType);
        var healthStore = HKHealthStore.new();
        healthStore.requestAuthorizationToShareTypesReadTypesCompletion(readDataTypes, readDataTypes, function (success, error) {
            if (!success) {
...
```

To run this example you must enable HealthKit in you xCode project:

1. Add iOS platform to the application
2. Open the .xcodeproject (--MyNativeScriptProjectFolder--/platforms/iOS) in xCode.
3. Follow the steps from [Adding Capabilities article](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html) to add HealthKit.

If you have any questions about the sample please open an issue in our [issues repo](http://github.com/nativescript/nativescript/issues) or post directly in [NativeScript forums](https://groups.google.com/forum/#!forum/nativescript).

