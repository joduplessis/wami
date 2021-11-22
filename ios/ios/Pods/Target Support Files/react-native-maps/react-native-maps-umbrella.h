#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "AIRMap.h"
#import "AIRMapCallout.h"
#import "AIRMapCalloutManager.h"
#import "AIRMapCircle.h"
#import "AIRMapCircleManager.h"
#import "AIRMapCoordinate.h"
#import "AIRMapLocalTile.h"
#import "AIRMapLocalTileManager.h"
#import "AIRMapLocalTileOverlay.h"
#import "AIRMapManager.h"
#import "AIRMapMarker.h"
#import "AIRMapMarkerManager.h"
#import "AIRMapOverlay.h"
#import "AIRMapOverlayManager.h"
#import "AIRMapOverlayRenderer.h"
#import "AIRMapPolygon.h"
#import "AIRMapPolygonManager.h"
#import "AIRMapPolyline.h"
#import "AIRMapPolylineManager.h"
#import "AIRMapPolylineRenderer.h"
#import "AIRMapSnapshot.h"
#import "AIRMapUrlTile.h"
#import "AIRMapUrlTileManager.h"
#import "SMCalloutView.h"
#import "RCTConvert+AirMap.h"

FOUNDATION_EXPORT double react_native_mapsVersionNumber;
FOUNDATION_EXPORT const unsigned char react_native_mapsVersionString[];

