import { Injectable } from '@angular/core';
// import {  } from '@types/googlemaps';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  constructor() { }

  createMarker(pos, urlIcon){
    let icon = this.createIcon(urlIcon, null, null);
    return new google.maps.Marker({
      position: pos,
      // animation: google.maps.Animation.BOUNCE,
      icon: icon
    });
  }
  
  createInfoWindow(content, maxWidth, maxHeight){
    if(!maxWidth) maxWidth = 300;
    if(!maxHeight) maxHeight = 300;
    return new google.maps.InfoWindow({content, maxWidth, maxHeight});
  }
  
  createIcon(url, width, height){
    if(!width) width = 17;
    if(!height) height = 17;
    return {
      url: url, // url
      scaledSize: new google.maps.Size(width, height), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
  }
  
  createPolyline(path, strokeColor = 'red', strokeOpacity = 0.8, strokeWeight = 4){
    return new google.maps.Polyline({
      path: path,
      strokeColor: strokeColor,
      strokeOpacity: strokeOpacity,
      strokeWeight: strokeWeight
    });
  }
  
  createPolygon(path, strokeColor = "green", strokeOpacity = 0.8, strokeWeight = 2, fillColor = "green", fillOpacity = 0.4){
    return new google.maps.Polygon({
      path,
      strokeColor: strokeColor,
      strokeOpacity: strokeOpacity,
      strokeWeight: strokeWeight,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    });
  }
  
  createMapProp(zoom, lat, lng){
    return {
      center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
    };
  }

  // createIcon(url, width, height){
  //   return {
  //     url,
  //     scaledSize: { width, height }
  //   }
  // }

  calDistanceOfRoute(points){
    let sumOfDistance = 0;
    console.log(points);
    points.forEach((point, index) => {
      if(index != points.length - 1){
        const { dPointLat, dPointLong } = point;
        let lat1 = Number(dPointLat);
        let lon1 = Number(dPointLong);
        let lat2 = Number(points[index + 1].dPointLat);
        let lon2 = Number(points[index + 1].dPointLong);
        let R = 6371; // km
        let φ1 = this.toRadian(lat1);
        let φ2 = this.toRadian(lat2);
        let Δφ = this.toRadian(lat2 - lat1);
        let Δλ = this.toRadian(lon2 - lon1);
  
        let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
              let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
              let d = R * c;
        sumOfDistance += d;
      }
    })
    return sumOfDistance;
  }
  
  toRadian(degree) {
    return degree * Math.PI/180;
  }

}
