package com.nutanxt

import android.util.Log
import com.facebook.react.bridge.*
import java.io.BufferedReader
import java.io.InputStreamReader

class ArpScannerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ArpScanner"
    }

    @ReactMethod
    fun scanDevices(promise: Promise) {
        try {
            val process = Runtime.getRuntime().exec("ip neigh")
            val reader = BufferedReader(InputStreamReader(process.inputStream))
            val resultArray = Arguments.createArray()

            var line: String? = reader.readLine()
            while (line != null) {
                val parts = line.trim().split(Regex("\\s+"))
                if (parts.size >= 5) {
                    val device = Arguments.createMap()
                    device.putString("ip", parts[0])
                    device.putString("mac", parts[4])
                    resultArray.pushMap(device)
                }
                line = reader.readLine()
            }

            promise.resolve(resultArray)
        } catch (e: Exception) {
            Log.e("ArpScanner", "Error scanning devices: ${e.message}")
            promise.reject("ARP_SCAN_ERROR", e.message, e)
        }
    }
}
