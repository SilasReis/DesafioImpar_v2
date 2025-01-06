export default interface Card {
    id: number;
    name: string;
    status: boolean;
    photo: Photo;
}

interface Photo {
    id: number;
    base64: string;
}

