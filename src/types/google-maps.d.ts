
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      [key: string]: any;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class PlacesService {
      constructor(attrContainer: Element | Map);
      findPlaceFromQuery(request: FindPlaceFromQueryRequest, callback: (results: PlaceResult[], status: PlacesServiceStatus) => void): void;
      getDetails(request: PlaceDetailsRequest, callback: (result: PlaceResult, status: PlacesServiceStatus) => void): void;
      nearbySearch(request: NearbySearchRequest, callback: (results: PlaceResult[], status: PlacesServiceStatus, pagination: PlaceSearchPagination) => void): void;
      textSearch(request: TextSearchRequest, callback: (results: PlaceResult[], status: PlacesServiceStatus, pagination: PlaceSearchPagination) => void): void;
    }

    interface PlaceDetailsRequest {
      placeId: string;
      fields?: string[];
    }

    interface FindPlaceFromQueryRequest {
      fields: string[];
      query: string;
    }

    interface TextSearchRequest {
      query: string;
      bounds?: LatLngBounds;
      location?: LatLng;
      radius?: number;
    }

    interface NearbySearchRequest {
      bounds?: LatLngBounds;
      location?: LatLng;
      radius?: number;
      rankBy?: number;
      type?: string;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      contains(latLng: LatLng): boolean;
      equals(other: LatLngBounds | null): boolean;
      extend(point: LatLng): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      intersects(other: LatLngBounds): boolean;
      isEmpty(): boolean;
      toJSON(): LatLngLiteral[];
      toSpan(): LatLng;
      toString(): string;
      union(other: LatLngBounds): LatLngBounds;
    }

    class PlaceSearchPagination {
      hasNextPage: boolean;
      nextPage(): void;
    }

    interface PlaceResult {
      formatted_address?: string;
      geometry?: {
        location: LatLng;
        viewport: LatLngBounds;
      };
      icon?: string;
      name?: string;
      place_id?: string;
      types?: string[];
      vicinity?: string;
      [key: string]: any;
    }

    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
        addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
        getBounds(): LatLngBounds;
        getPlace(): PlaceResult;
        setBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
        setComponentRestrictions(restrictions: ComponentRestrictions): void;
        setFields(fields: string[]): void;
        setOptions(options: AutocompleteOptions): void;
        setTypes(types: string[]): void;
      }

      interface AutocompleteOptions {
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        componentRestrictions?: ComponentRestrictions;
        placeIdOnly?: boolean;
        strictBounds?: boolean;
        types?: string[];
      }

      interface ComponentRestrictions {
        country: string | string[];
      }
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    type PlacesServiceStatus = "OK" | "ZERO_RESULTS" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "INVALID_REQUEST" | "UNKNOWN_ERROR";

    interface MapsEventListener {
      remove(): void;
    }

    namespace event {
      function clearInstanceListeners(instance: object): void;
    }
  }
}
