//
//  BackgroundManager.h
//  HotAndNew
//
//  Created by Jon Kent on 7/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@protocol NativeBackgroundManagerDelegate

- (void)application:(UIApplication *)application performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler;

@end

@interface NativeBackgroundManager : RCTEventEmitter <RCTBridgeModule, NativeBackgroundManagerDelegate>

@end
