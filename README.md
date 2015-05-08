# Using the HealthKit SDK with NativeScript
This sample shows a simple use of the [iOS HealthKit APIs](https://developer.apple.com/healthkit/).

It is a very simple scenario but should help you out if you want to work with this SDK.
The most important part of the sample is located in [main-page.js](https://github.com/NativeScript/sample-HealthKit/tree/master/app/components/main) file. Here is a snippet of code used to initialize the HealtKit SKD
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

If you have any questions about the sample please open an issue in our [issues repo](http://github.com/nativescript/nativescript/issues) or post directly in [NativeScript forums](https://groups.google.com/forum/#!forum/nativescript).

