package com.sixammvp

import android.widget.Toast
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.pinelabs.pluralsdk.PluralSDKManager
import com.pinelabs.pluralsdk.callback.PaymentResultCallBack


class PluralPaymentModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), PaymentResultCallBack {

    private var paymentPromise: Promise? = null

    override fun getName(): String = "PluralPayment"

    @ReactMethod
    fun addListener(eventName: String?) {
        // Required for NativeEventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for NativeEventEmitter
    }

    // Called from JS to start payment
    @ReactMethod
    fun startPayment(token: String, promise: Promise) {
        println("This is a Kotlin println log PluralPayment")
        this.paymentPromise = promise

        val sdkManager = PluralSDKManager()
        val currentActivity = reactContext.currentActivity

        if (currentActivity != null) {
            sdkManager.startPayment(currentActivity, token, this)
        } else {
            promise.reject("NO_ACTIVITY", "No current activity found")
        }
    }

    // Called when payment is successful
    override fun onSuccessOccured(orderId: String?) {

        Toast.makeText(reactContext, "Payment Successful: $orderId", Toast.LENGTH_SHORT).show()
        //this.paymentPromise?.resolve("Payment successful with orderId: $orderId")

        val params = Arguments.createMap()
        params.putString("status", "success")
        params.putString("orderId", orderId)
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onPaymentSuccess", params)
    }

    // Called when payment fails
    override fun onErrorOccured(orderId: String?, code: String?, message: String?) {
        Toast.makeText(reactContext, "Error occurred: $message", Toast.LENGTH_SHORT).show()
        //this.paymentPromise?.reject(code ?: "UNKNOWN_ERROR", message ?: "An error occurred", null)
        val params = Arguments.createMap()
        params.putString("status", "error")
        params.putString("UNKNOWN_ERROR", message)
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onPaymentError", params)
    }

    // Called when payment is cancelled
    override fun onCancelTransaction() {
        Toast.makeText(reactContext, "Payment Cancelled", Toast.LENGTH_SHORT).show()
        val params = Arguments.createMap()
        params.putString("status", "CANCELLED")
        params.putString("CANCELLED", "User cancelled the payment")
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onPaymentCancelled", params)
        //this.paymentPromise?.reject("CANCELLED", "User cancelled the payment")
    }
}
