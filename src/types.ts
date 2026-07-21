export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface Location {
    prefecture: string;
    city: string;
    coordinate: Coordinate;
}

export interface NewQuestion {
    location: Location;
    imageUrl: string;
}

export interface Question extends NewQuestion {
    id: number;
}