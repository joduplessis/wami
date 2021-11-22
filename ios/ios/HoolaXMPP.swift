//
//  XMPP.swift
//  mobile
//
//  Created by Jo du Plessis on 2018/07/28.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation


@objc(HoolaXMPP)
class HoolaXMPP: NSObject {
  func initHoolaXMPP() {
    // Unused - using MQTT
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["initialCount": 0]
  }
}



