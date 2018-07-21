//
//  BackgroundManager.m
//  HotAndNew
//
//  Created by Jon Kent on 7/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTViewManager.h>
#import "NativeBackgroundManager.h"
#import "AppDelegate.h"

static NSString* const EnteredBackground = @"EnteredBackground";
static NSString* const BackgroundRefreshStatusChanged = @"BackgroundRefreshStatusChanged";
static NSString* const PerformFetch = @"PerformFetch";

@implementation NativeBackgroundManager {
  void (^completion)(UIBackgroundFetchResult);
  BOOL hasListeners;
}

RCT_EXPORT_MODULE()

# pragma mark -- receivable events

RCT_EXPORT_METHOD(setMinimumBackgroundFetchInterval:(double)minimumBackgroundFetchInterval)
{
  if (minimumBackgroundFetchInterval == 0) {
    minimumBackgroundFetchInterval = UIApplicationBackgroundFetchIntervalNever;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    [UIApplication.sharedApplication setMinimumBackgroundFetchInterval: minimumBackgroundFetchInterval];
    RCTLogInfo(@"RCT - setMinimumBackgroundFetchInterval: %f", minimumBackgroundFetchInterval);
  });
}

RCT_EXPORT_METHOD(backgroundRefreshStatus:(RCTResponseSenderBlock)callback)
{
  NSString *status = backgroundRefreshStatus();
  callback(@[status]);
  RCTLogInfo(@"RCT - backgroundRefreshStatus: %@", status);
}

RCT_EXPORT_METHOD(backgroundRefreshComplete:(NSString *)result)
{
  NSDictionary *results = @{@"newdata" : @(UIBackgroundFetchResultNewData),
                            @"nodata" : @(UIBackgroundFetchResultNoData),
                            @"failed" : @(UIBackgroundFetchResultFailed)
                            };
  NSNumber *resultObject = results[result];
  UIBackgroundFetchResult fetchResult = resultObject.unsignedIntegerValue ?: UIBackgroundFetchResultNoData;
  completion(fetchResult);
  RCTLogInfo(@"RCT - backgroundRefreshComplete: %@", result);
}

NSString* backgroundRefreshStatus()
{
  NSDictionary *strings = @{@(UIBackgroundRefreshStatusAvailable) : @"available",
                            @(UIBackgroundRefreshStatusDenied) : @"denied",
                            @(UIBackgroundRefreshStatusRestricted) : @"restricted"
                            };
  __block NSString *status;
  dispatch_sync(dispatch_get_main_queue(), ^{
    status = strings[@(UIApplication.sharedApplication.backgroundRefreshStatus)] ?: @"unknown";
  });
  
  return status;
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appDidEnterBackground:) name:UIApplicationDidEnterBackgroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(backgroundRefreshStatusDidChange:) name:UIApplicationBackgroundRefreshStatusDidChangeNotification object:nil];
    AppDelegate *appDelegate = (AppDelegate *)UIApplication.sharedApplication.delegate;
    appDelegate.delegate = self;
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[EnteredBackground,
           BackgroundRefreshStatusChanged,
           PerformFetch
           ];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
  hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  hasListeners = NO;
}

# pragma mark -- sent events

- (void)appDidEnterBackground:(NSNotification *)notification
{
  [self sendEventWithName:EnteredBackground body:nil];
}

- (void)backgroundRefreshStatusDidChange:(NSNotification *)notification
{
  [self sendEventWithName:EnteredBackground body:backgroundRefreshStatus()];
}

- (void)application:(UIApplication *)application performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  // Only send events if anyone is listening
  if (!hasListeners) {
    completionHandler(UIBackgroundFetchResultNoData);
    return;
  }
  
  completion = ^(UIBackgroundFetchResult result){
    completionHandler(result);
    completion = nil;
  };
  
  
  [self sendEventWithName:PerformFetch body:nil];
}

- (void)sendEventWithName:(NSString *)name body:(id)body {
  // Only send events if anyone is listening
  if (!hasListeners) {
    return;
  }
  
  [super sendEventWithName:name body:body];
}

@end
